<template>
  <div id="q-app">
    <router-view :oauthProviders="oauthProviders" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      oauthProviders: []
    };
  },
  computed: {
    isLoggedIn: {
      get() {
        return this.$store.state.account.isLoggedIn;
      }
    }
  },
  created() {
    this.$q.loading.show();
    this.$store.dispatch('account/fetchProfile').then(() => {
      if (this.$store.state.account.isLoggedIn) {
        this.$store.dispatch('gallery/fetchAlbums').then(() => {
          this.$q.loading.hide();
          if (this.$route.path == '/welcome' && this.isLoggedIn) {
            this.$router.push({ path: '/gallery' });
          }
        });
      } else {
        this.$axios
          .get('/api/account/providers')
          .then(response => {
            this.oauthProviders = response.data;
            this.$q.loading.hide();
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
    });
    this.$store.dispatch(
      'account/setDarkMode',
      this.$q.localStorage.getItem('darkMode') || false
    );
    const savedAutoUpload = this.$q.localStorage.getItem('autoUpload');
    this.$store.dispatch(
      'account/setAutoUpload',
      savedAutoUpload === null ? true : savedAutoUpload
    );
    this.$store.dispatch(
      'account/setUploadThreads',
      this.$q.localStorage.getItem('uploadThreads') || 4
    );
    this.$store.dispatch(
      'account/setHashingThreads',
      this.$q.localStorage.getItem('hashingThreads') || 2
    );
    this.$store.dispatch(
      'account/setDesktopSplitter',
      this.$q.localStorage.getItem('desktopSplitter') || 150
    );
    this.$store.dispatch(
      'account/setMobileSplitter',
      this.$q.localStorage.getItem('mobileSplitter') || 150
    );

    // Disable right-click.  This is just to make the UI cleaner and _more_ user
    // friendly but is probably a controversial choice.  This is an opensource
    // project so obviously I'm not trying to obfuscate anything.  I want people
    // to share photos easily, and sometimes right click is just confusing - I
    // always have people sending me thumbnails they've saved instead of the
    // full image.  Disabling right click and providing a download button makes
    // it easier.
    document.addEventListener('contextmenu', event => event.preventDefault());
  },
  watch: {
    $route: function(value) {
      if (value.path == '/welcome' && this.isLoggedIn) {
        this.$router.push({ path: '/gallery' });
      }
      if (value.params.albumId) {
        this.$store.dispatch('gallery/setSelectedAlbumIsShared', false);
        this.$store
          .dispatch('gallery/setSelectedAlbumId', Number(value.params.albumId))
          .then(() => {
            this.$store.dispatch(
              'gallery/fetchPhotos',
              Number(value.params.albumId)
            );
          });
      } else if (value.params.albumUuid) {
        this.$store.dispatch('gallery/setSelectedAlbumIsShared', true);
        this.$store.dispatch('gallery/setSelectedAlbumId', null);
        this.$store.dispatch(
          'gallery/fetchSharedPhotos',
          value.params.albumUuid
        );
      } else {
        this.$store.dispatch('gallery/setSelectedAlbumIsShared', false);
        this.$store.dispatch('gallery/setSelectedAlbumId', null);
      }
    }
  }
};
</script>
