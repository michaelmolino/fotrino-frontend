<template>
  <div>
    <q-splitter
      v-model="splitter"
      unit="px"
      :horizontal="$q.platform.is.mobile"
    >
      <template v-slot:before>
        <div>
          My Albums
          <q-tree
            ref="myAlbums"
            :nodes="albums"
            :no-nodes-label="isLoggedIn ? 'No albums.' : 'Please login.'"
            accordian
            labelKey="name"
            nodeKey="id"
            selected-color="accent"
            :selected.sync="selectedAlbumId"
          />
        </div>
      </template>
      <template v-slot:after>
        <q-tab-panel
          name="lightGallery"
          v-if="selectedAlbumId || isShared"
          class="q-pa-none"
        >
          <LightGallery />
        </q-tab-panel>
        <q-tab-panel name="selectAlbum" v-else>
          Please select an album.
        </q-tab-panel>
      </template>
    </q-splitter>

    <PhotosUpload />
    <AlbumCreate />

    <q-fab
      :disable="!isLoggedIn"
      color="primary"
      icon="keyboard_arrow_left"
      direction="left"
      class="fixed-bottom-right q-pb-lg q-pr-lg"
      square
    >
      <q-fab-action
        @click="$store.dispatch('gallery/setPhotosUploadDialog', true)"
        square
        color="primary"
        icon="add_a_photo"
      >
        <q-tooltip content-class="bg-info">
          Upload photos
        </q-tooltip>
      </q-fab-action>
      <q-fab-action
        @click="$store.dispatch('gallery/setAlbumCreateDialog', true)"
        square
        color="primary"
        icon="create_new_folder"
      >
        <q-tooltip content-class="bg-info">
          Create an album
        </q-tooltip>
      </q-fab-action>
    </q-fab>
    <q-ajax-bar ref="bar" position="bottom" color="primary" size="10px" />
  </div>
</template>

<script>
import PhotosUpload from '../components/dialogs/PhotosUpload.vue';
import AlbumCreate from '../components/dialogs/AlbumCreate.vue';
import LightGallery from '../components/LightGallery.vue';

export default {
  name: 'Gallery',
  components: {
    LightGallery,
    PhotosUpload,
    AlbumCreate
  },
  computed: {
    isLoggedIn: {
      get() {
        return this.$store.state.account.isLoggedIn;
      }
    },
    splitter: {
      get() {
        return this.$q.platform.is.mobile
          ? this.$store.state.account.mobileSplitter
          : this.$store.state.account.desktopSplitter;
      },
      set(value) {
        this.$q.platform.is.mobile
          ? this.$store.dispatch('account/setMobileSplitter', value)
          : this.$store.dispatch('account/setDesktopSplitter', value);
      }
    },
    desktopSplitter: {
      get() {
        return this.$store.state.account.desktopSplitter;
      },
      set(value) {
        this.$store.dispatch('account/setDesktopSplitter', value);
      }
    },
    mobileSplitter: {
      get() {
        return this.$store.state.account.mobileSplitter;
      },
      set(value) {
        this.$store.dispatch('account/setMobileSplitter', value);
      }
    },
    isShared: {
      get() {
        return this.$store.state.gallery.selectedAlbumIsShared;
      }
    },
    albumCreateDialog: {
      get() {
        return this.$store.state.gallery.albumCreateDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setAlbumCreateDialog', visible);
      }
    },
    photosUploadDialog: {
      get() {
        return this.$store.state.gallery.photosUploadDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setPhotosUploadDialog', visible);
      }
    },
    movePhotosDialog: {
      get() {
        return this.$store.state.gallery.movePhotosDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setMovePhotosDialog', visible);
      }
    },
    albums: {
      get() {
        return this.$store.state.gallery.albums.map(a =>
          Object.assign(a, a.shared ? { icon: 'link' } : {})
        );
      }
    },
    selectedAlbumId: {
      get() {
        return this.$store.state.gallery.selectedAlbumId;
      },
      set(albumId) {
        if (albumId) {
          this.$router.push({ path: '/gallery/' + albumId }).catch(() => {
            true;
          });
        } else {
          this.$router.push({ path: '/gallery' }).catch(() => {
            true;
          });
        }
      }
    }
  }
};
</script>
