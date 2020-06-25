<template>
  <div v-if="help">
    <q-expansion-item
      v-for="faq in help.data"
      :key="faq.question"
      expand-separator
      :label="faq.question"
      header-class="question"
    >
      <q-card>
        <q-card-section>
          <span v-html="faq.answer"></span>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<style>
.question {
  text-transform: uppercase;
  font-weight: bold;
}
</style>

<script>
export default {
  name: 'Help',
  data() {
    return {
      help: null
    };
  },
  created() {
    this.$q.loading.show();
    this.$axios
      .get('/json/help.json')
      .then(response => {
        this.help = response.data;
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
};
</script>
