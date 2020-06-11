<template>
  <div id="app">
    <Header></Header>

    <router-view />

    <Footer></Footer>
  </div>
</template>
<script>
import Header from "./views/Layout/Header";
import Footer from "./views/Layout/Footer";
export default {
  name: "App",
  components: {Header, Footer}
}
</script>

<style lang="scss">
#app {
  width: 100%;
  background: #e9eaeb;
}
</style>
