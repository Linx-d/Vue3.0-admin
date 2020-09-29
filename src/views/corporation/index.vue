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
import { getLoginEmployee } from "@/api/employeeApi";
export default {
  name: "corporation",
  components: { titleTab },
  setup() {
    const tabNavs = reactive([
      {
        name: "企业信息",
        path: "/corporation/corporation_info",
        current: false,
      },
      {
        name: "权限管理",
        path: "/corporation/corporation_authority",
        current: false,
      },
      {
        name: "个人信息",
        path: "/corporation/corporation_set",
        current: false,
      },
    ]);
    getLoginEmployee().then((res) => {
      if (res.code == 0) {
        if (res.data.role.id == 1) {
          let params = {
            name: "设置",
            path: "/corporation/corporation_config",
            current: false,
          };
          tabNavs.push(params);
        }
      }
    });
    return { tabNavs };
  },
};
</script>

<style lang="scss" scoped>
$corporationHeight: 655px;
#corporation {
  max-height: $scrollHeight_corporation;
  overflow: hidden;
  .corporation_main {
    .chunk_title {
      height: $corporationHeight;
      padding-top: 12px;
      min-width: 175px;
      max-height: $scrollHeight_corporation;
    }
    .tabNav_item_curr {
      background: $tabNav_color;
      a {
        color: #fff;
      }
    }
    .chunk_cnt {
      padding: 0;
      max-height: $scrollHeight_corporation;
    }
  }
}
</style>