<template>
  <main id="profile" class="frame_center">
    <div class="profile_main frame_center_main">
      <div class="chunk_title">
        <titleTab :father="tabNavs"></titleTab>
      </div>
      <div class="chunk_cnt">
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script>
import { reactive } from "@vue/composition-api";
import titleTab from "../../components/common";
export default {
  name: "profile",
  components: { titleTab },
  setup() {
    const tabNavs = reactive([
      {
        name: "企业信息",
        path: "#/profile/profile_info",
        current: false
      },
      {
        name: "权限管理",
        path: "#/profile/profile_juris",
        current: false
      },
      {
        name: "设置",
        path: "#/profile/profile_set",
        current: false
      }
    ]);
    return { tabNavs };
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