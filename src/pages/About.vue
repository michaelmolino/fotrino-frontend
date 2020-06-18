<template>
  <div class="row justify-center" v-if="!loading">
    <q-markup-table
      class="q-ma-md about"
      v-for="(section, index) in [about, techstack]"
      :key="section.title"
      wrap-cells
    >
      <thead>
        <th colspan="2">
          <h5 class="q-my-none">{{ section.title }}</h5>
        </th>
      </thead>
      <tbody>
        <tr v-for="row in section.data" :key="row.key">
          <td>
            {{ row.key }}
          </td>
          <td>
            <div v-for="value in row.value" :key="value.name">
              <span v-if="value.link">
                <a :href="value.link" class="fotrino">
                  {{ value.name }}
                </a>
              </span>
              <span v-else>
                {{ value.name }}
              </span>
            </div>
          </td>
        </tr>
        <tr v-if="index === 0">
          <td colspan="2">
            Etymology
            <p />
            <a class="fotrino" href="https://www.fotrino.com/">Fotrino</a>:
            <ul>
              <li>The root of Fotrino comes from foto as in photograph.</li>
              <li>It sounds like a subatomic particle and I like physics.</li>
              <li>It rhymes with my surname.</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<style>
.about {
  max-width: 500px;
  min-width: 300px;
}
</style>

<script>
export default {
  name: 'About',
  data() {
    return {
      about: null,
      techstack: null
    };
  },
  computed: {
    loading: {
      get() {
        return !this.about || !this.techstack;
      }
    }
  },
  watch: {
    loading: function(value) {
      if (!value) {
        this.$q.loading.hide();
      }
    }
  },
  created() {
    this.$q.loading.show();
    this.$axios
      .get('/statics/json/about.json')
      .then(response => {
        this.about = response.data;
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
    this.$axios
      .get('/statics/json/techstack.json')
      .then(response => {
        this.techstack = response.data;
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
