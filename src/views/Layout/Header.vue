<template>
  <header class="frame_head qui_clear">
    <div class="frame_head_top">
      <a class="frame_logo" href="javascript:;">
        <h1>企业微信</h1>
      </a>
      <aside class="frame_operation">
        <a href="javascript:;">文档</a>
        <span class="frame_operation_separator">|</span>
        <span>联系客服</span>
        <span class="frame_operation_separator">|</span>
        <a href="javascript:;">退出</a>
      </aside>
    </div>
    <div class="frame_head_bottom">
      <div class="frame_head_bottom_stage">
        <nav>
          <a
            v-for="(nav, index) in navList"
            :href="nav.target"
            :id="nav.targetId"
            :key="nav.id"
            :class="['frame_nav', {frame_nav_Curr: nav.current}]"
            @click="navTrigger(nav, index)"
          >{{ nav.name }}</a>
        </nav>
        <div id="topNavLine" :style="stepStyle"></div>
      </div>
    </div>
  </header>
</template>

<script>
import { getSms } from "@/api/loginApi.js";
import { reactive, ref, onMounted, computed } from "@vue/composition-api";
export default {
  name: "frame",
  props: ["header"],
  setup() {
    const navList = reactive([
      {
        index: 0,
        name: "首页",
        targetId: "index",
        target: "#/index",
        current: true
      },
      {
        index: 1,
        name: "部门",
        targetId: "contacts",
        target: "#/contacts",
        current: false
      },
      {
        index: 2,
        name: "地图",
        targetId: "map",
        target: "#/map",
        current: false
      },
      {
        index: 3,
        name: "围栏",
        targetId: "rail",
        target: "#/rail",
        current: false
      },
      {
        index: 4,
        name: "企业",
        targetId: "profile",
        target: "#/profile",
        current: false
      }
    ]);
    const step = ref(63);
    const clickStr = ref("translateX(" + step.value + "px)");
    const urlStr = ref("");
    /**
     * computed
     */
    const stepStyle = computed({
      get: () => {
        if (urlStr.value !== "") {
          return urlStr.value;
        }
        step.value = 63;
        let url = window.location.href;
        navList.forEach(value => {
          let target = value.target;
          if (url.indexOf(target) !== -1) {
            step.value += 216 * value.index;
            clickStr.value = "translateX(" + step.value + "px)";
          }
        });
        return "transform:" + clickStr.value;
      },
      set: val => {
        urlStr.value = val;
      }
    });

    /**
     * 生命周期函数 onMounted
     */
    onMounted(() => {
      getSms(1);
    });

    /***
     * 声明函数
     */
    const navTrigger = (data, index) => {
      navList.forEach(value => {
        value.current = false;
      });
      step.value = 63;
      let stepMove = 216;
      step.value += stepMove * index;
      clickStr.value = "translateX(" + step.value + "px)";
      stepStyle.value = "transform:" + clickStr.value;
      data.current = true;
    };
    return {
      navList,
      step,
      stepStyle,
      navTrigger
    };
  }
};
</script>

<style lang="scss" scoped>
.frame_head {
  width: 100%;
  height: 72px;
  background: #335883;
  margin-bottom: 20px;
  .frame_head_top {
    height: 32px;
    width: 1080px;
    color: #fff;
    margin: 0 auto;
    background: #335883;
    .frame_logo {
      cursor: pointer;
      float: left;
      h1 {
        color: #fff;
        font-size: 16px;
        margin-top: 8px;
        display: block;
        font-family: "Gill Sans", sans-serif;
      }
    }
    .frame_operation {
      float: right;
      cursor: pointer;
      font-size: 12px;
      line-height: 32px;
      a {
        color: #fff;
        display: inline-block;
      }
      a:hover {
        text-decoration: underline;
      }
      .frame_operation_separator {
        color: #fff;
        height: 10px;
        width: 8px;
        color: #8298b4;
        padding: 0 6px;
      }
    }
  }
  .frame_head_bottom {
    height: 40px;
    width: 100%;
    background: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    .frame_head_bottom_stage {
      height: 100%;
      width: 1080px;
      margin: 0 auto;
      position: relative;
      nav {
        height: 100%;
        width: 1080px;
        margin: 0 auto;
        background: #fff;
        .frame_nav {
          display: inline-block;
          width: 216px;
          color: $tab-text;
          text-align: center;
          font-size: 14px;
          line-height: 40px;
        }
        .frame_nav_Curr {
          color: #3a6291;
        }
        .frame_nav:hover {
          color: #3a6291;
        }
      }
      #topNavLine {
        width: 90px;
        height: 3px;
        background: #2c5480;
        position: absolute;
        bottom: 0px;
        -webkit-transition: all 0.5s;
        -o-transition: all 0.5s;
        transition: all 0.5s;
      }
    }
  }
}
</style>