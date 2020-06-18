<template>
  <q-dialog
    v-model="albumRenameDialog"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
    @before-hide="reset"
    @before-show="setPlaceholder"
  >
    <q-card class="fotrino-dialog">
      <q-bar class="bg-accent">
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-info">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pt-none">
        <div>
          <form @submit.prevent="submit">
            <q-input
              color="accent"
              v-model="text"
              clearable
              :error-message="errorMessage"
              :error="errorMessage !== null"
              label="New album name"
              autofocus
            >
              <template v-slot:prepend>
                <q-icon name="edit" />
              </template>
            </q-input>
            <q-btn
              color="accent"
              class="q-ma-sm"
              @click="submit"
              :disabled="!text"
              :loading="loading"
            >
              OK
            </q-btn>
          </form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'AlbumRename',
  data() {
    return {
      text: null,
      loading: false,
      errorMessage: null
    };
  },
  computed: {
    albumRenameDialog: {
      get() {
        return this.$store.state.gallery.albumRenameDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setAlbumRenameDialog', visible);
      }
    }
  },
  methods: {
    setPlaceholder() {
      this.text = this.$store.state.gallery.selectedAlbum.name;
    },
    submit() {
      this.loading = true;
      const album = this.$store.state.gallery.selectedAlbum;
      this.$axios
        .put('/api/albums', {
          id: album.id,
          owner: album.owner,
          name: this.text
        })
        .then(() => {
          this.reset();
          this.$store.dispatch('gallery/fetchAlbums');
          this.albumRenameDialog = false;
        })
        .catch(error => {
          this.reset();
          this.errorMessage = error.response.data;
        });
    },
    reset() {
      this.loading = false;
      this.text = null;
      this.errorMessage = null;
    }
  }
};
</script>
