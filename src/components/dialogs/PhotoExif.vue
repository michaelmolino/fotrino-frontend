<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="photoExifDialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-table
        v-if="!loading"
        title="Exif Data"
        :columns="columns"
        :data="exif"
        class="fotrino-dialog"
        :pagination="{ rowsPerPage: 0 }"
        dense
        flat
      />
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'PhotoExif',
  data() {
    return {
      columns: [
        {
          name: 'Key',
          required: true,
          field: 'key',
          align: 'left'
        },
        {
          name: 'Value',
          required: true,
          field: 'value',
          align: 'left'
        }
      ],
      exif: null
    };
  },
  computed: {
    loading: function() {
      if (this.exif) {
        this.$q.loading.hide();
        return false;
      }
      return true;
    },
    photoExifDialog: {
      get() {
        return this.$store.state.gallery.photoExifDialog;
      },
      set(visible) {
        this.$store.dispatch('gallery/setPhotoExifDialog', visible);
      }
    },
    photoExifPhotoId: {
      get() {
        return this.$store.state.gallery.photoExifPhotoId;
      }
    }
  },
  watch: {
    photoExifPhotoId: function(value) {
      if (value) {
        this.$q.loading.show();
        this.$axios
          .get('/api/photos/exif/' + this.photoExifPhotoId)
          .then(response => {
            this.exif = response.data;
          })
          .catch(error => {
            this.$q.loading.hide();
            this.$q.notify({
              type: 'negative',
              message: error.response.data,
              icon: 'warning',
              multiLine: true
            });
          });
      }
    }
  }
};
</script>
