<template>
  <q-dialog
    v-model="albumShareDialog"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
    @before-show="init"
  >
    <q-card class="fotrino-dialog vertical-bottom">
      <q-bar class="bg-accent">
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-info">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pt-sm">
        <div class="text-center">
          <div v-if="!shared">
            This album is currently private. If you share it,
            <strong>
              anyone with the link will be able to see your photos without
              signing in.
            </strong>
            Only picked photos will be shared.
          </div>
          <div v-if="shared">
            This album is currently public. Copy the URL below to share it with
            friends and family. Only picked photos will be shared.
          </div>
          <q-input
            class="q-mt-lg"
            label-color="accent"
            outlined
            v-model="text"
            :disable="!shared"
            readonly
          >
            <template v-slot:append>
              <q-btn
                icon="file_copy"
                color="accent"
                class="cursor-pointer"
                @click="copyLink"
                flat
              >
                <q-tooltip content-class="bg-info">Copy to clipboard</q-tooltip>
              </q-btn>
            </template>
          </q-input>
          <q-toggle
            v-model="shared"
            size="xl"
            unchecked-icon="lock"
            checked-icon="public"
            color="positive"
            :label="shared ? 'Public' : 'Private'"
            @input="toggleShare"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { copyToClipboard } from 'quasar';

export default {
  name: 'AlbumShare',
  data() {
    return {
      shared: false,
      text: null
    };
  },
  computed: {
    album: {
      get() {
        return this.$store.state.gallery.selectedAlbum;
      }
    },
    albumShareDialog: {
      get() {
        return this.$store.state.gallery.albumShareDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setAlbumShareDialog', visible);
      }
    }
  },
  methods: {
    init() {
      const album = this.album;
      this.shared = album.shared || false;
      this.text = album.album_uuid
        ? window.location.protocol +
          '//' +
          window.location.host +
          '/public/' +
          album.album_uuid
        : null;
    },
    toggleShare(value) {
      this.$axios
        .put('/api/albums/share/' + this.$store.state.gallery.selectedAlbumId, {
          shared: value
        })
        .then(response => {
          this.$store.dispatch('gallery/fetchAlbums');
          this.shared = response.data.shared;
          if (response.data.album_uuid) {
            this.text =
              window.location.protocol +
              '//' +
              window.location.host +
              '/public/' +
              response.data.album_uuid;
          } else {
            this.text = null;
          }
        })
        .catch(error => {
          this.shared = !value;
          this.$q.notify({
            type: 'negative',
            message: error.response.data,
            icon: 'warning',
            multiLine: true
          });
        });
    },
    copyLink() {
      copyToClipboard(this.text)
        .then(() => {
          this.$q.notify({
            type: 'info',
            message: 'URL copied to clipboard.',
            icon: 'file_copy',
            multiLine: true,
            timeout: 500
          });
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Failed to copy URL.',
            icon: 'warning',
            multiLine: true
          });
        });
    }
  }
};
</script>
