<template>
  <div>
    <div class="row">
      <div class="col-xs-12 col-md-4">
        <q-toolbar>
          <q-icon name="filter_alt" size="md" color="primary">
            <q-tooltip content-class="bg-primary">
              Filters
            </q-tooltip>
          </q-icon>
          <q-btn-toggle
            clearable
            dense
            flat
            v-model="filter"
            round
            toggle-color="accent"
            :options="[
              { value: 'similar', slot: 'similar' },
              { value: 'picked', slot: 'picked' },
              { value: 'unreviewed', slot: 'unreviewed' },
              { value: 'rejected', slot: 'rejected' }
            ]"
          >
            <template v-slot:similar>
              <q-icon name="burst_mode">
                <q-tooltip content-class="bg-info">
                  Similar Photos
                </q-tooltip>
              </q-icon>
            </template>
            <template v-slot:picked>
              <q-icon name="check_circle_outline">
                <q-tooltip content-class="bg-info">
                  Picked
                </q-tooltip>
              </q-icon>
            </template>
            <template v-slot:unreviewed>
              <q-icon name="radio_button_unchecked">
                <q-tooltip content-class="bg-info">
                  Unreviewed
                </q-tooltip>
              </q-icon>
            </template>
            <template v-slot:rejected>
              <q-icon name="highlight_off">
                <q-tooltip content-class="bg-info">
                  Rejected
                </q-tooltip>
              </q-icon>
            </template>
          </q-btn-toggle>
        </q-toolbar>
      </div>
      <div class="col-xs-12 col-md-4">
        <q-toolbar>
          <q-icon name="collections" size="md" color="primary">
            <q-tooltip content-class="bg-primary">
              Album Actions
            </q-tooltip>
          </q-icon>
          <q-btn
            flat
            :icon="shareIcon"
            :color="shareIconColor"
            @click="$store.dispatch('gallery/setAlbumShareDialog', true)"
          >
            <q-tooltip content-class="bg-info">
              Link Sharing:
              {{ shared ? 'On' : 'Off' }}
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="edit"
            color="info"
            @click="$store.dispatch('gallery/setAlbumRenameDialog', true)"
          >
            <q-tooltip content-class="bg-info">
              Rename
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="delete"
            color="warning"
            @click="$store.dispatch('gallery/setAlbumDeleteDialog', true)"
          >
            <q-tooltip content-class="bg-info">
              Delete
            </q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
      <div class="col-xs-12 col-md-4">
        <q-toolbar>
          <q-icon name="image" size="md" color="primary">
            <q-tooltip content-class="bg-primary">
              Photo Actions
            </q-tooltip>
          </q-icon>
          <q-checkbox
            v-model="checkbox"
            color="info"
            :disabled="$store.state.gallery.photos.length === 0"
          />
          <q-btn
            flat
            round
            icon="folder"
            color="info"
            :disabled="$store.state.gallery.photoSelection.length === 0"
            @click="$store.dispatch('gallery/setPhotosMoveDialog', true)"
          >
            <q-tooltip content-class="bg-info">
              Move
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="delete"
            color="warning"
            :disabled="$store.state.gallery.photoSelection.length === 0"
            @click="$store.dispatch('gallery/setPhotosDeleteDialog', true)"
          >
            <q-tooltip content-class="bg-info">
              Delete
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="check_circle_outline"
            color="positive"
            :disabled="$store.state.gallery.photoSelection.length === 0"
            @click="changeFlag('P')"
          >
            <q-tooltip content-class="bg-info">
              Pick
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="radio_button_unchecked"
            :disabled="$store.state.gallery.photoSelection.length === 0"
            @click="changeFlag(null)"
          >
            <q-tooltip content-class="bg-info">
              Clear Pick/Reject
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="highlight_off"
            color="negative"
            :disabled="$store.state.gallery.photoSelection.length === 0"
            @click="changeFlag('R')"
          >
            <q-tooltip content-class="bg-info">
              Reject
            </q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
    </div>

    <AlbumShare />
    <AlbumRename />
    <AlbumDelete />
    <PhotosMove />
    <PhotosDelete />
  </div>
</template>

<script>
import AlbumShare from './dialogs/AlbumShare.vue';
import AlbumRename from './dialogs/AlbumRename.vue';
import AlbumDelete from './dialogs/AlbumDelete.vue';
import PhotosMove from './dialogs/PhotosMove.vue';
import PhotosDelete from './dialogs/PhotosDelete.vue';

export default {
  name: 'ActionBar',
  components: {
    AlbumShare,
    AlbumRename,
    AlbumDelete,
    PhotosMove,
    PhotosDelete
  },
  computed: {
    shared: {
      get() {
        const album = this.$store.state.gallery.selectedAlbum;
        if (album) {
          return album.shared;
        }
        return null;
      }
    },
    shareIcon: {
      get() {
        const album = this.$store.state.gallery.selectedAlbum;
        if (album) {
          return album.shared ? 'link' : 'link_off';
        }
        return null;
      }
    },
    shareIconColor: {
      get() {
        const album = this.$store.state.gallery.selectedAlbum;
        if (album) {
          return album.shared ? 'positive' : null;
        }
        return null;
      }
    },
    disableSimilarFilter: {
      get() {
        return this.$store.state.gallery.photos.length <= 2;
      }
    },
    filter: {
      get() {
        return this.$store.state.gallery.filter;
      },
      set(value) {
        if (value == 'similar') {
          this.$store.dispatch(
            'gallery/fetchDuplicates',
            this.$store.state.gallery.selectedAlbumId
          );
        }
        this.$store.dispatch('gallery/setFilter', value);
      }
    },
    albumDeleteDialog: {
      get() {
        return this.$store.state.gallery.albumDeleteDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setAlbumDeleteDialog', visible);
      }
    },
    albumRenameDialog: {
      get() {
        return this.$store.state.gallery.albumRenameDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setAlbumRenameDialog', visible);
      }
    },
    photosDeleteDialog: {
      get() {
        return this.$store.state.gallery.photosDeleteDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setPhotosDeleteDialog', visible);
      }
    },
    checkbox: {
      get() {
        return (
          this.$store.state.gallery.photoSelection.length ===
            this.$store.state.gallery.photos.length &&
          this.$store.state.gallery.photos.length > 0
        );
      },
      set(value) {
        this.$store.dispatch('gallery/setPhotoSelectionAll', value);
      }
    }
  },
  methods: {
    changeFlag(flag) {
      const photos = [];
      this.$store.state.gallery.photoSelection.forEach(i => {
        const photo = this.$store.state.gallery.photos.find(j => j.id === i);
        if (photo) {
          const newPhoto = Object.assign({}, photo);
          photos.push(newPhoto);
        }
      });
      this.$store.dispatch('gallery/setPhotoFlag', {
        photos: photos,
        flag: flag
      });
    }
  }
};
</script>
