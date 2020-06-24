<template>
  <q-dialog
    v-model="albumDeleteDialog"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
    @before-hide="reset"
  >
    <q-card class="fotrino-dialog">
      <q-bar class="bg-warning">
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-info">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pt-sm">
        <div class="text-center">
          No photos will be deleted; all photos in this album will be moved to
          Unsorted. This action cannot be undone.
          <p />
          <form @submit.prevent="submit">
            <q-btn
              color="warning"
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
export default {
  name: 'AlbumDelete',
  data() {
    return {
      loading: false
    };
  },
  computed: {
    albumDeleteDialog: {
      get() {
        return this.$store.state.gallery.albumDeleteDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setAlbumDeleteDialog', visible);
      }
    }
  },
  methods: {
    submit() {
      this.loading = true;
      this.$axios
        .delete('/api/albums/' + this.$store.state.gallery.selectedAlbumId)
        .then(() => {
          this.reset();
          this.$store.dispatch('gallery/fetchAlbums').then(() => {
            this.$router.push({ path: '/gallery' }).catch(() => {
            });
          });
          this.$store.dispatch('gallery/setPhotoSelection', []);
          this.albumDeleteDialog = false;
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
    }
  }
};
</script>
