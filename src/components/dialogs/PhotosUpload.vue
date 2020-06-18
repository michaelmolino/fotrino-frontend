<template>
  <q-dialog
    v-model="photosUploadDialog"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
    @before-hide="reset"
  >
    <q-card class="fotrino-dialog">
      <q-bar class="bg-accent">
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-info">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div>
          <div class="text-center">
            <q-file
              color="accent"
              :value="files"
              @input="updateFileList"
              label="Select photos"
              outlined
              multiple
              counter
              use-chips
              :counter-label="counterLabelFn"
              :clearable="!isUploading"
            >
              <template v-slot:file="{ index, file }">
                <q-chip class="full-width q-my-xs q-py-xs" square>
                  <q-linear-progress
                    class="absolute-full full-height"
                    :value="fileDetails[index].percent"
                    :color="fileDetails[index].color"
                    track-color="grey-2"
                  />

                  <q-avatar>
                    <q-icon :name="fileDetails[index].icon" />
                  </q-avatar>

                  <div class="ellipsis relative-position">
                    Name: {{ file.name }} |
                    {{ fileDetails[index].description }}
                  </div>

                  <q-tooltip>
                    {{ fileDetails[index].description }}
                  </q-tooltip>
                </q-chip>
              </template>

              <template v-slot:after>
                <q-btn
                  :color="uploadColor"
                  :icon="uploadIcon"
                  :disable="!canUpload"
                  :loading="isUploading || isHashing"
                  :percentage="percentage"
                  @click="upload"
                >
                  <template v-slot:loading>
                    <q-spinner v-if="isUploading" />
                    <q-spinner-gears v-if="isHashing" />
                  </template>
                </q-btn>
              </template>
            </q-file>
          </div>

          <q-item tag="label" v-ripple>
            <q-item-section avatar>
              <q-checkbox
                v-model="checkbox"
                keep-color
                :color="
                  $store.state.gallery.selectedAlbumId ? 'accent' : 'warning'
                "
                :disable="!$store.state.gallery.selectedAlbumId || isUploading"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{
                $store.state.gallery.selectedAlbumId
                  ? 'Upload to selected album'
                  : 'No album selected'
              }}</q-item-label>
              <q-item-label
                v-if="!$store.state.gallery.selectedAlbumId || !checkbox"
                caption
              >
                Photos will be added to Unsorted
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import EXIF from 'exif-js';
import SparkMD5 from 'spark-md5';
import Queue from 'queue-promise';

export default {
  name: 'PhotosUpload',
  data() {
    return {
      checkbox: true,
      files: [],
      fileDetails: [],
      isUploading: false,
      isHashing: false,
      percentage: 0,
      uploadIcon: 'cloud_upload',
      uploadColor: 'accent'
    };
  },
  computed: {
    photosUploadDialog: {
      get() {
        return this.$store.state.gallery.photosUploadDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setPhotosUploadDialog', visible);
      }
    },
    canUpload: {
      get: function() {
        const canUpload =
          this.fileDetails.length > 0 &&
          this.fileDetails.find(f => f.valid) &&
          !this.fileDetails.find(f => f.valid === null);
        return canUpload;
      }
    }
  },
  watch: {
    canUpload: function(val) {
      if (val && this.$store.state.account.autoUpload) {
        this.upload();
      }
    }
  },
  methods: {
    reset() {
      this.checkbox = true;
      this.files = [];
      this.fileDetails = [];
      this.isUploading = false;
      this.percentage = 0;
      this.uploadIcon = 'cloud_upload';
      this.uploadColor = 'accent';
    },
    counterLabelFn({ filesNumber }) {
      const validFiles = this.fileDetails.filter(f => f.valid).length;
      this.percentage = 100 * (1 - validFiles / filesNumber);
      return validFiles + ' of ' + filesNumber + ' files remaining';
    },

    handleFileError(index, error) {
      this.fileDetails[index].description = error;
      this.fileDetails[index].error = true;
      this.fileDetails[index].color = 'negative';
      this.fileDetails[index].percent = 1;
    },

    updateFileList(files) {
      this.percentage = 0;
      this.uploadIcon = 'cloud_upload';
      this.uploadColor = 'accent';

      const queue = new Queue({
        concurrent: this.$store.state.account.hashingThreads,
        interval: 0,
        start: true
      });

      queue.on('end', () => {
        this.isHashing = false;
      });

      this.files = files;
      this.fileDetails = (files || []).map(file => ({
        description: 'Calculating MD5 hash...',
        exifDateTime: null,
        hash: null,
        error: false,
        color: 'positive',
        percent: 0,
        icon: file.type.indexOf('image/') === 0 ? 'photo' : 'insert_drive_file',
        valid: null,
        url: null
      }));
      if (files.length > 0) {
        this.isHashing = true;
      }
      (files || []).forEach((f, i) => {
        this.getExif(f).then(exifDateTime => {
          this.fileDetails[i].exifDateTime = exifDateTime;
        });
        queue.enqueue(() => {
          return this.hashFile(f).then(hash => {
            this.fileDetails[i].hash = hash;
            this.fileDetails[i].description = 'MD5: ' + hash;
            this.$axios
              .put('/api/photos/preupload', { filename: f.name, hash: hash })
              .then(response => {
                this.fileDetails[i].valid = response.data.valid;
                this.fileDetails[i].url = response.data.presigned_put_url;
                if (!response.data.valid) {
                  this.handleFileError(i, response.data.description);
                }
              })
              .catch(error => {
                this.uploadColor = 'warning';
                this.handleFileError(i, error.response.data);
              });
          });
        });
      });
    },

    getExif(file) {
      return new Promise(resolve => {
        EXIF.getData(file, function() {
          resolve(EXIF.getTag(this, 'DateTimeOriginal'));
        });
      });
    },

    upload() {
      const queue = new Queue({
        concurrent: this.$store.state.account.uploadThreads,
        interval: 0,
        start: true
      });

      const queue2 = new Queue({
        concurrent: 2,
        interval: 0,
        start: true
      });

      queue.on('end', () => {
        this.isUploading = false;
        // this.canUpload = false;
        this.uploadIcon = 'cloud_done';
        const success = this.fileDetails.filter(f => f.error === false).length;
        if (success === 0) {
          this.uploadColor = 'negative';
        }
      });

      this.isUploading = true;

      this.files.forEach((f, i) => {
        if (this.fileDetails[i].url) {
          queue.enqueue(() => {
            return this.$axios
              .put(this.fileDetails[i].url, f, {
                onUploadProgress: progressEvent => {
                  this.fileDetails[i].percent =
                    progressEvent.loaded / progressEvent.total;
                }
              })
              .then(() => {
                this.fileDetails[i].percent = 1;
                this.fileDetails[i].valid = false;
                let album = null;
                if (this.checkbox) {
                  album = this.$store.state.gallery.selectedAlbumId;
                }

                queue2.enqueue(() => {
                  return this.$axios
                    .post('/api/photos', {
                      filename: f.name,
                      hash: this.fileDetails[i].hash,
                      exif_datetime: this.fileDetails[i].exifDateTime || null, // eslint-disable-line
                      album: album
                    })
                    .then(response => {
                      if (this.checkbox) {
                        this.$store.dispatch('gallery/addPhoto', response.data);
                      }
                    })
                    .catch(error => {
                      this.uploadColor = 'warning';
                      this.handleFileError(i, error.response.data);
                    });
                });
              })
              .catch(err => {
                let error = 'File upload failed.';
                if (err.response) {
                  error = err.response.data;
                }
                this.uploadColor = 'warning';
                this.handleFileError(i, error);
              });
          });
        }
      });
    },

    hashFile(file) {
      return new Promise((resolve, reject) => {
        const blobSlice =
          File.prototype.slice || // eslint-disable-line
          File.prototype.mozSlice ||
          File.prototype.webkitSlice;
        const chunkSize = 2097152;
        const chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();

        function loadNext() {
          const start = currentChunk * chunkSize;
          const end =
            start + chunkSize >= file.size ? file.size : start + chunkSize;

          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }

        fileReader.onload = function(e) {
          spark.append(e.target.result);
          currentChunk++;

          if (currentChunk < chunks) {
            loadNext();
          } else {
            const hash = spark.end();
            resolve(hash);
          }
        };

        fileReader.onerror = function() {
          reject(new Error('Error reading file.'));
        };

        loadNext();
      });
    }
  }
};
</script>
