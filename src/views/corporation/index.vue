<template>
  <main id="corporation" class="frame_center">
    <div class="corporation_main frame_center_main">
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
import titleTab from "@/components/common";
export default {
  name: "corporation",
  components: { titleTab },
  setup() {
    const tabNavs = reactive([
      {
        name: "企业信息",
        path: "/corporation/corporation_info",
        current: false
      },
      {
        name: "权限管理",
        path: "/corporation/corporation_authority",
        current: false
      },
      {
        name: "个人信息",
        path: "/corporation/corporation_set",
        current: false
      }
    ]);
    return { tabNavs };
  }
};
</script>

<style lang="scss" scoped>
$corporationHeight: 655px;
.corporation_main {
  .chunk_title {
    height: $corporationHeight;
    padding-top: 12px;
    min-width: 165px;
  }
  .tabNav_item_curr {
    background: $tabNav_color;
    a {
      color: #fff;
    }
  }
}
.chunk_cnt {
  padding: 0;
}
</style>