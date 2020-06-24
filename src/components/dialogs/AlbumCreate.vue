<template>
  <q-dialog
    v-model="albumCreateDialog"
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

      <q-card-section class="q-pt-none">
        <div>
          <form @submit.prevent="submit">
            <q-input
              color="accent"
              v-model="text"
              clearable
              :loading="loading"
              :error-message="errorMessage"
              :error="errorMessage !== null"
              label="New album name"
              autofocus
            >
              <template v-slot:prepend>
                <q-icon name="folder" />
              </template>
            </q-input>
            <q-btn
              color="accent"
              class="q-ma-sm"
              @click="submit"
              :disabled="!text"
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
  name: 'AlbumCreate',
  data() {
    return {
      text: null,
      loading: false,
      errorMessage: null
    };
  },
  computed: {
    albumCreateDialog: {
      get() {
        return this.$store.state.gallery.albumCreateDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setAlbumCreateDialog', visible);
      }
    },
    selectedAlbumId: {
      get() {
        return this.$store.state.gallery.selectedAlbumId;
      },
      set(album) {
        this.$store.dispatch('gallery/setSelectedAlbumId', album);
        this.$store.dispatch('gallery/fetchPhotos', album);
      }
    }
  },
  methods: {
    submit() {
      this.loading = true;
      this.$axios
        .post('/api/albums', { name: this.text })
        .then(response => {
          this.reset();
          this.$store.dispatch('gallery/fetchAlbums').then(() => {
            this.$router
              .push({ path: '/gallery/' + response.data.id })
              .catch(() => {
              });
          });
          this.albumCreateDialog = false;
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
