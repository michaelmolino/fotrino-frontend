<template>
  <q-dialog
    v-model="photosMoveDialog"
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

      <q-card-section class="q-pt-sm">
        <div>
          <q-select
            outlined
            color="accent"
            v-model="album"
            :options="options"
            options-dense
            v-if="options.length > 0"
            autofocus
          >
            <template v-slot:append>
              <q-avatar>
                <q-icon name="folder" />
              </q-avatar>
            </template>
          </q-select>
          <q-btn
            color="accent"
            class="q-ma-sm"
            @click="submit"
            :disabled="!album"
            :loading="loading"
          >
            OK
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'PhotosMove',
  data() {
    return {
      album: null,
      loading: false,
      error: false
    };
  },
  computed: {
    options: {
      get() {
        return this.$store.state.gallery.albums.map(f => ({
          label: f.name,
          value: f.id,
          disable: f.id === this.$store.state.gallery.selectedAlbumId
        }));
      }
    },
    photosMoveDialog: {
      get() {
        return this.$store.state.gallery.photosMoveDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setPhotosMoveDialog', visible);
      }
    }
  },
  methods: {
    submit() {
      this.loading = true;
      const photos = [];
      this.$store.state.gallery.photoSelection.forEach(i => {
        const photo = this.$store.state.gallery.photos.find(j => j.id === i);
        if (photo) {
          const newPhoto = Object.assign({}, photo);
          newPhoto.album = this.album.value;
          photos.push(newPhoto);
        }
      });
      this.$axios
        .put('/api/photos', photos)
        .then(() => {
          this.reset();
          this.$store.dispatch(
            'gallery/fetchPhotos',
            this.$store.state.gallery.selectedAlbumId
          );
          this.$store.dispatch('gallery/setPhotoSelection', []);
          this.photosMoveDialog = false;
        })
        .catch(error => {
          this.reset();
          this.$q.notify({
            type: 'negative',
            message: error.response.data,
            icon: 'warning',
            multiLine: true
          });
        });
    },
    reset() {
      this.loading = false;
      this.album = null;
      this.error = false;
    }
  }
};
</script>
