<template>
  <footer class="frame_bottom">
    <nav class="frame_bottom_nav">
      <div v-for="link in links" :key="link.id" class="footer_link">
        <a :href="link.path" target="_blank">{{ link.text }}</a>
        <span class="frame_operation_dep">|</span>
      </div>
    </nav>
    <p class="version">© 2009&nbsp;-&nbsp;2020&nbsp;Utech Inc. All Rights Reserved</p>
  </footer>
</template>
<script>
import { reactive } from "@vue/composition-api";
export default {
  name: "documents",
  setup() {
    const links = reactive([
      { name: "utech", path: "http://www.chinautech.com/", text: "关于如泰" },
      { name: "userAgreement", path: "#/userAgreement", text: "用户协议" },
      {
        name: "manual",
        path: "#/manual",
        text: "使用手册",
      },
      {
        name: "privacy",
        path: "#/privacy",
        text: "隐私政策",
      },
      {
        name: "updateLog",
        path: "#/updateLog",
        text: "更新日志",
      },
    ]);
    return { links };
  },
};
</script>
<style lang="scss" scoped>
.frame_bottom {
  padding-bottom: 23px;
  text-align: center;
  font-size: 12px;
  margin-top: 24px;
  min-width: 1080px;
  .frame_bottom_nav {
    margin-bottom: 2px;
    height: 24px;
    a {
      color: #9e9e9e;
      line-height: 1.5;
    }
    a:hover {
      text-decoration: underline;
    }
    .frame_operation_dep {
      color: #9e9e9e;
      height: 10px;
      width: 8px;
      padding: 0 6px;
    }
    .footer_link {
      display: inline-block;
    }
    .footer_link:last-child {
      .frame_operation_dep {
        display: none;
      }
    }
  }
}
</style>