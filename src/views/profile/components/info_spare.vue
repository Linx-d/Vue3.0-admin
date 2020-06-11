<template>
  <div class="profile_main frame_center_main">
    <div class="chunk_title">
      <titleTab :father="tabNavs"></titleTab>
    </div>
    <div class="chunk_cnt">
      <div class="tab_cnt">
        info
      </div> 
    </div>
  </div>
</template>
<script>
import titleTab from "../../../components/common";
import { reactive } from "@vue/composition-api";
export default {
  name: "info",
  commponents: { titleTab },
  setup() {
    const tabNavs = reactive([
      {
        name: "企业信息",
        path: "#/profile/profile_info",
        current: true
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
    return {tabNavs};
  }
};
</script>
<style lang="scss" scoped>
</style>