<template>
  <main id="manual" class="frame_center document_fix">
    <div>
      <div class="manual_main frame_center_main frame_cnt">
        <p class="MsoNormal">
          <span>
            <b>一、登录注册</b>
          </span>
        </p>
        <p class="MsoNormal">
          <span>1.注册：首先下载企业微信移动端安装并注册，其次在如泰官网</span>
        </p>
        <p class="MsoNormal">
          <span>
            <a href="http://www.chinautech.com/cn/">底部联系如泰申请如泰疫情防控中心服务。</a>
          </span>
        </p>
        <img :src="urlList[0].about" alt="关于我们">
        <p class="MsoNormal">
          <span>1.注册：首先下载企业微信移动端安装并注册，其次在如泰官网</span>
        </p>
        <img :src="urlList[1].case_bottom_left" alt="left">
      </div>
      <p class="version">© 2009&nbsp;-&nbsp;2020&nbsp;Utech Inc. All Rights Reserved</p>
    </div>
  </main>
</template>
<script>
import about from "../images/about.jpg";
import case_bottom_left from "../images/case_bottom_left.png";
import { reactive, ref } from "@vue/composition-api";
export default {
  name: "manual",
  setup() {
    const urlList = reactive([
      {about},
      {case_bottom_left},
    ]);
    return {urlList};
  },
};
</script>
<style lang="scss" scoped>
#manual {
  height: 1600px;
  .version {
    margin-top: 24px;
  }
}
</style>