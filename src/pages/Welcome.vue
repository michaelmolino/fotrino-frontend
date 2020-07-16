<template>
  <div>
    <h2>Welcome to Fotrino</h2>
    <h4 class="q-my-none">The transparent photo host.</h4>
    <h6>Read our <a href="/privacy.txt" class="fotrino">Privacy Policy</a>.</h6>
  </div>
</template>

<script>
export default {
  name: 'Welcome',
  mounted() {
    this.$q.notify({
      type: 'warning',
      message:
        'This is a demo site for Fotrino which is under active development.  You should expect photos to be regularly deleted.',
      icon: 'warning',
      multiLine: true,
      timeout: 0,
      badgeStyle: 'visibility: hidden;',
      actions: [
        {
          label: 'Dismiss',
          color: 'black'
        }
      ]
    });
  }
};
</script>
