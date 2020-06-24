<template>
  <ul>
    <li
      v-for="tabNav in tabNavs"
      :key="tabNav.id"
      :class="['tabNav_item', { 'tabNav_item_curr': tabNav.current}]"
      @click="changeTab(tabNav)"
    >
      <router-link :to="{ path: tabNav.path }" :id="tabNav.id" class="tabNav_item_Link">{{ tabNav.name }}</router-link>
    </li>
  </ul>
</template>
<script>
import { reactive } from "@vue/composition-api";
export default {
  name: "titleTab",
  props: ["father"],
  components: {},
  setup(props, { root }) {
    /**
     * 数据
     */
    const tabNavs = reactive(props.father);
    /**
     * 函数
     */
    const changeTab = data => {
      tabNavs.forEach(value => {
        value.current = false;
      });
      data.current = true;
    };
    const profileRoute = root.$route.path;
    tabNavs.forEach((item) => {
      if(item.path.indexOf(profileRoute) !== -1) {
        item.current = true;
      }
    });
    return { tabNavs, changeTab };
  }
};
</script>
<style lang="scss" scoped>
.tabNav_item_curr {
  background: $tabNav_color;
  a {
    color: #fff;
  }
}
</style>