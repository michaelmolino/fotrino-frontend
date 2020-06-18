<template>
  <q-toolbar class="bg-primary text-white q-mb-lg">
    <q-toolbar-title>
      <q-btn
        :to="isLoggedIn ? '/gallery' : '/welcome'"
        icon="camera"
        :label="!$q.platform.is.mobile ? 'Fotrino' : ''"
        flat
        no-caps
        size="lg"
      />
    </q-toolbar-title>
    <q-btn
      to="/about"
      icon="info"
      :label="!$q.platform.is.mobile ? 'About' : ''"
      flat
      no-caps
      size="lg"
    />
    <q-btn
      to="/help"
      icon="help"
      :label="!$q.platform.is.mobile ? 'Help' : ''"
      flat
      no-caps
      size="lg"
    />
    <q-btn-dropdown
      v-if="isLoggedIn"
      :icon="'img:' + this.profile.profile_pic"
      :label="!$q.platform.is.mobile ? 'Account' : ''"
      flat
      no-caps
      size="lg"
    >
      <Account :isLoggedIn="isLoggedIn" :profile="profile" />
    </q-btn-dropdown>
    <q-btn-dropdown
      v-if="!isLoggedIn"
      icon="account_box"
      :label="!$q.platform.is.mobile ? 'Login' : ''"
      flat
      no-caps
      size="lg"
      :loading="oauthProviders.length === 0"
    >
      <q-list dense class="text-white">
        <a
          v-for="provider in oauthProviders"
          :key="provider"
          :href="'/api/account/login/' + provider.toLowerCase()"
        >
          <q-item clickable v-close-popup class="bg-white">
            <q-item-section>
              <q-chip class="bg-white text-black">
                <q-avatar>
                  <q-img
                    :src="'/statics/oauth/' + provider.toLowerCase() + '.png'"
                  />
                </q-avatar>
                {{ provider }}
              </q-chip>
            </q-item-section>
          </q-item>
        </a>
      </q-list>
    </q-btn-dropdown>
  </q-toolbar>
</template>

<script>
import Account from './Account.vue';

export default {
  name: 'NavBar',
  components: {
    Account
  },
  props: {
    oauthProviders: Array
  },
  computed: {
    profile: {
      get() {
        return this.$store.state.account.profile;
      }
    },
    isLoggedIn: {
      get() {
        return this.$store.state.account.isLoggedIn;
      }
    }
  }
};
</script>
