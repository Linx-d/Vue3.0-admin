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
import { getCorpInfo } from "@/api/corporationApi"; // 获取企业地址
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
