<template>
  <q-dialog
    v-model="photosDeleteDialog"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
    @before-hide="reset"
  >
    <q-card class="fotrino-dialog">
      <q-bar class="bg-negative">
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-info">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pt-sm">
        <div class="text-center">
          Photos can still be recovered from disk.
          <p />
          <form @submit.prevent="submit">
            <q-btn
              color="negative"
              class="q-ma-sm"
              @click="submit"
              :loading="loading"
              autofocus
            >
              Delete
            </q-btn>
          </form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import Queue from 'queue-promise';

export default {
  name: 'PhotosDelete',
  data() {
    return {
      loading: false,
      error: false
    };
  },
  computed: {
    photosDeleteDialog: {
      get() {
        return this.$store.state.gallery.photosDeleteDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setPhotosDeleteDialog', visible);
      }
    }
  },
  methods: {
    submit() {
      this.loading = true;

      const queue = new Queue({
        concurrent: 8,
        interval: 0,
        start: true
      });

      queue.on('end', () => {
        this.reset();
        this.$store.dispatch('gallery/setPhotoSelection', []);
        this.$store.dispatch(
          'gallery/fetchPhotos',
          this.$store.state.gallery.selectedAlbumId
        );
        if (this.$store.state.gallery.browseMode) {
          this.$store.dispatch(
            'gallery/fetchDuplicates',
            this.$store.state.gallery.selectedAlbumId
          );
        }
        if (!this.error) {
          this.photosDeleteDialog = false;
        }
      });

      this.$store.state.gallery.photoSelection.forEach(f => {
        queue.enqueue(() => {
          return this.$axios.delete('/api/photos/' + f).catch(error => {
            this.error = true;
            this.$q.notify({
              type: 'negative',
              message: error.response.data,
              icon: 'warning',
              multiLine: true
            });
          });
        });
      });
    },
    reset() {
      this.loading = false;
      this.error = false;
    }
  }
};
</script>
