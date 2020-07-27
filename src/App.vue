<template>
  <div id="app">
    <Header v-if="full"></Header>

    <router-view v-loading="loading" />

    <Footer v-if="full"></Footer>
  </div>
</template>
<script>
import Header from "./views/Layout/Header";
import Footer from "./views/Layout/Footer";
import { computed, ref } from "@vue/composition-api";
export default {
  name: "App",
  components: { Header, Footer },
  setup(props, { root }) {
    const full = computed(() => {
      return root.$store.state.map.full;
    });
    const loading = ref(true);
    let hasToken = sessionStorage.getItem("auth_token");
    let verify = hasToken == null || hasToken == undefined || hasToken == "";
    if (!verify) {
      loading.value = false;
    }
    return { full, loading };
  },
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100vh;
  background: #e9eaeb;
}
</style>
