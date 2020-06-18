<template>
  <div>
    <div>
      <div id="lightgallery" class="alwaysontop"></div>
      <ActionBar v-if="!isShared" />
      <div v-if="photos.length == 0" class="q-ma-xl">
        No photos to display.
        <span v-if="this.filter !== null">Try clearing your filters.</span>
      </div>
      <div class="row" v-else>
        <q-intersection
          transition="scale"
          v-for="(photo, index) in photos"
          :key="photo.id"
          :class="
            !isShared
              ? 'q-ma-xs q-pa-none fotrino-tn-wrapper'
              : 'q-ma-xs q-pa-none fotrino-tn'
          "
        >
          <q-card
            square
            flat
            :class="
              !isShared
                ? 'q-ma-xs q-pa-none fotrino-tn-wrapper'
                : 'q-ma-xs q-pa-none fotrino-tn'
            "
          >
            <q-img
              :id="index"
              :src="photo.thumbnail_url"
              @click="renderGallery($event)"
              :class="getTnClassList(photo.flag)"
              contain
              spinner-color="accent"
              @error="retryThumbnail(photo.id)"
              :key="retry['id_' + photo.id] || 0"
            >
              <template v-slot:error>
                <q-skeleton
                  v-if="(retry['id_' + photo.id] || 0) < 8"
                  type="rect"
                  class="absolute-full bg-warning"
                />
                <div
                  v-if="(retry['id_' + photo.id] || 0) >= 8"
                  class="absolute-full flex flex-center bg-negative text-black text-center"
                >
                  Thumbnail Failed<br />
                </div>
              </template>
            </q-img>
            <q-card-actions class="q-pa-none" v-if="!isShared">
              <span style="width: 40px">
                <q-checkbox
                  color="info"
                  v-model="photoSelection"
                  :val="photo.id"
                  size="xs"
                />
              </span>
              <span style="width: 40px">
                <q-btn
                  flat
                  round
                  icon="check_circle_outline"
                  size="sm"
                  :color="photo.flag == 'P' ? 'positive' : ''"
                  @click="
                    $store.dispatch('gallery/setPhotoFlag', {
                      photos: [photo],
                      flag: 'P'
                    })
                  "
                >
                  <q-tooltip content-class="bg-info">
                    Pick
                  </q-tooltip>
                </q-btn>
              </span>
              <span style="width: 40px">
                <q-btn
                  flat
                  round
                  icon="highlight_off"
                  size="sm"
                  :color="photo.flag == 'R' ? 'negative' : ''"
                  @click="
                    $store.dispatch('gallery/setPhotoFlag', {
                      photos: [photo],
                      flag: 'R'
                    })
                  "
                >
                  <q-tooltip content-class="bg-info">
                    Reject
                  </q-tooltip>
                </q-btn>
              </span>
              <span style="width: 40px">
                <q-btn
                  flat
                  round
                  icon="details"
                  size="sm"
                  @click="
                    $store.dispatch('gallery/setPhotoExifDialog', {
                      visible: true,
                      photo: photo.id
                    })
                  "
                >
                  <q-tooltip content-class="bg-info">
                    Exif Data
                  </q-tooltip>
                </q-btn>
              </span>
              <span style="width: 40px">
                <a :href="photo.original_url">
                  <q-btn flat round icon="cloud_download" size="sm">
                    <q-tooltip content-class="bg-info">
                      Download Original
                    </q-tooltip>
                  </q-btn>
                </a>
              </span>
            </q-card-actions>
          </q-card>
        </q-intersection>
      </div>
    </div>

    <PhotoExif />
  </div>
</template>

<script>
import Vue from 'vue';

import 'lightgallery.js/dist/js/lightgallery.js';
import 'lightgallery.js/dist/css/lightgallery.css';

import ActionBar from '../components/ActionBar.vue';
import PhotoExif from './dialogs/PhotoExif.vue';

export default {
  name: 'LightGallery',
  components: {
    ActionBar,
    PhotoExif
  },
  data() {
    return {
      retry: []
    };
  },
  computed: {
    isShared: {
      get() {
        return this.$store.state.gallery.selectedAlbumIsShared;
      }
    },
    photos: {
      get() {
        switch (this.$store.state.gallery.filter) {
          case 'similar':
            return this.$store.state.gallery.duplicates;
          case 'picked':
            return this.$store.state.gallery.photos.filter(p => p.flag == 'P');
          case 'unreviewed':
            return this.$store.state.gallery.photos.filter(p => p.flag == null);
          case 'rejected':
            return this.$store.state.gallery.photos.filter(p => p.flag == 'R');
        }
        return this.$store.state.gallery.photos;
      }
    },
    filter: {
      get() {
        return this.$store.state.gallery.filter;
      }
    },
    elements: function() {
      return this.photos.map(p => {
        return { src: p.fullsize_url };
      });
    },
    photoSelection: {
      get() {
        return this.$store.state.gallery.photoSelection;
      },
      set(selection) {
        this.$store.dispatch('gallery/setPhotoSelection', selection);
      }
    },
    photoExifDialog: {
      get() {
        return this.$store.state.gallery.photoExifDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setPhotoExifDialog', visible);
      }
    }
  },
  methods: {
    getTnClassList(flag) {
      let classes =
        flag == 'R'
          ? 'fotrino-tn cursor-pointer rejected'
          : 'fotrino-tn cursor-pointer';
      if (this.$q.dark.isActive) {
        classes += ' fotrino-tn-dark';
      }
      return classes;
    },
    renderGallery(ref) {
      const slide = ref.srcElement.parentElement.id;
      const lg = document.getElementById('lightgallery');

      lg.addEventListener(
        'onCloseAfter',
        function() {
          window.lgData[lg.getAttribute('lg-uid')].destroy(true);
        },
        {
          once: true
        }
      );

      lg.addEventListener(
        'onAfterOpen',
        function() {
          window.lgData[lg.getAttribute('lg-uid')].slide(Number(slide));
          window.lgData[lg.getAttribute('lg-uid')].index = Number(slide);
        },
        {
          once: true
        }
      );

      window.lightGallery(lg, {
        mode: 'lg-slide',
        loop: false,
        preload: 5,
        download: true,
        thumbnail: false,
        dynamic: true,
        dynamicEl: this.elements
      });
    },
    retryThumbnail(id) {
      const retry = this.retry['id_' + id] || 0;
      if (retry < 8) {
        setTimeout(() => {
          Vue.set(this.retry, 'id_' + id, retry + 1);
        }, 1000 * Math.pow(2, retry + 1));
      }
    }
  }
};
</script>
