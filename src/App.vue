<template>
  <div id="app" v-if="!loading">
    <Header v-if="full"></Header>
    <router-view />
    <Footer v-if="full"></Footer>
  </div>
</template>
<script>
import Header from "./views/Layout/Header";
import Footer from "./views/Layout/Footer";
import { computed, ref, watchEffect } from "@vue/composition-api";
export default {
  name: "App",
  components: { Header, Footer },
  setup(props, { root }) {
    const full = computed(() => {
      return root.$store.state.map.full;
    });
    const loading = ref(true);
    watchEffect(() => {
      let hasToken = sessionStorage.getItem("auth_token");
      loading.value =
        hasToken == null || hasToken == undefined || hasToken == "";
      if (location.href.indexOf("auth_token") != -1) {
        let start = location.href.indexOf("auth_token") - 1;
        let arr = location.href.split("");
        location.href = arr.splice(0, start).join("");
      } else if (
        location.href.indexOf("auth_token") != -1 &&
        location.href.indexOf("appid") != -1
      ) {
        let start = location.href.indexOf("auth_token") - 1;
        let end = location.href.indexOf("&", start) - 1;
        let arr = location.href.split('');
        arr.splice(start, end);
        location.href = arr.join('');
      }
    });
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
