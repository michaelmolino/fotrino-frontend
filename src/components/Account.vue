<template>
  <div class="row no-wrap q-pa-md">
    <div class="column items-center">
      <div class="text-h6 q-mb-md text-center">Account</div>
      <q-avatar rounded size="72px">
        <q-img :src="profile.profile_pic">
          <template v-slot:error>
            <q-skeleton
              type="QAvatar"
              class="absolute-full flex flex-center bg-info text-white"
            />
          </template>
        </q-img>
      </q-avatar>

      <div class="text-subtitle1 q-mt-md q-mb-xs">
        <q-chip>
          <q-avatar>
            <q-img
              :src="'/oauth/' + profile.identity_provider + '.png'"
            />
          </q-avatar>
          {{ profile.name }}
        </q-chip>
      </div>

      <q-toggle
        v-model="darkMode"
        unchecked-icon="wb_sunny"
        checked-icon="nights_stay"
        label="Dark Mode"
        color="info"
        keep-color
      />

      <a href="/api/account/logout">
        <q-btn
          color="white"
          label="Logout"
          flat
          no-caps
          class="bg-secondary"
          size="sm"
          v-close-popup
        />
      </a>
    </div>

    <q-separator vertical inset class="q-mx-lg" v-if="!$q.platform.is.mobile" />

    <div class="column" v-if="!$q.platform.is.mobile">
      <div class="text-h6 q-mb-md text-center">Settings</div>
      <q-toggle
        v-model="autoUpload"
        label="Auto Start Uploads"
        color="info"
        keep-color
      />
      <q-slider
        v-model="uploadThreads"
        :min="1"
        :max="8"
        color="info"
        snap
        label-always
        markers
        dense
        class="q-mt-xl"
      />
      <div class="text-center">
        Concurrent Uploads
      </div>
      <q-slider
        v-model="hashingThreads"
        :min="1"
        :max="8"
        color="info"
        snap
        label-always
        markers
        dense
        class="q-mt-xl"
      />
      <div class="text-center">
        Hashing Threads
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Account',
  props: {
    isLoggedIn: Boolean,
    profile: Object
  },
  computed: {
    darkMode: {
      get() {
        return this.$store.state.account.darkMode;
      },
      set(value) {
        this.$store.dispatch('account/setDarkMode', value);
      }
    },
    autoUpload: {
      get() {
        return this.$store.state.account.autoUpload;
      },
      set(value) {
        this.$store.dispatch('account/setAutoUpload', value);
      }
    },
    uploadThreads: {
      get() {
        return this.$store.state.account.uploadThreads;
      },
      set(value) {
        this.$store.dispatch('account/setUploadThreads', value);
      }
    },
    hashingThreads: {
      get() {
        return this.$store.state.account.hashingThreads;
      },
      set(value) {
        this.$store.dispatch('account/setHashingThreads', value);
      }
    }
  }
};
</script>
