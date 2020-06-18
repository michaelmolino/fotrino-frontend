<template>
  <q-layout view="hHh lpR fFf">
    <NavBar :oauthProviders="oauthProviders" />
    <q-page-container>
      <q-page class="q-px-lg">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import NavBar from '../components/NavBar.vue';

export default {
  name: 'Home',
  components: {
    NavBar
  },
  props: {
    oauthProviders: Array
  }
};
</script>
