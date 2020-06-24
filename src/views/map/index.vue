<template>
  <main id="map" :class="{cutFullClass: full}">
    <div id="mapShow" :class="['map_main', 'frame_center']"></div>
    <div :class="['tool', { tool_top: full }]">
      <ul>
        <li @click="cutFull">
          <svg-icon iconClass="menu" class="mapMenu"></svg-icon>
          <i>菜单</i>
        </li>
      </ul>
    </div>
  </main>
</template>

<script>
import { Map } from "../../map";
import { onMounted, computed } from "@vue/composition-api";
export default {
  name: "mapTmp",
  setup(props, { root }) {
    const cutFull = () => { // 切换
      root.$store.commit("SET_FULL"); // commit 不用指向 map模块
    }
    const full = computed(() => {
      return root.$store.state.map.full;
    });
    /**
     * 生命周期函数 onMounted
     */
    onMounted(() => {
      baiduMap();
    });
    /**
     * 百度地图方法
     */
    let baiduMap = () => {
      Map("EG4ercSC4ZmBIhIcBvyoj65q12m2fy00").then(BMap => {
        let map = new BMap.Map("mapShow"); // 创建Map实例
        let point = new BMap.Point(114.065537, 22.553321); // 创建点坐标
        let marker = new BMap.Marker(point);
        map.addOverlay(marker); //添加一个标注
        map.centerAndZoom(point, 13); // 添加初始化中心点及地图层级
        map.enableScrollWheelZoom(); // 开启鼠标滚轮缩放功能。仅对PC上有效
        map.enableContinuousZoom(); // 启用连续缩放效果，默认禁用
      });
    };
    return { cutFull, full };
  }
};
</script>

<style lang="scss" scoped>
$mapHeight: 81%;
#map {
  height: 100vh;
  position: relative;
  .map_main {
  height: 100%;
  @include webkit('transition', all .5s);
}
}
.tool {
  position: absolute;
  right: 16px;
  top: 108px;
  background: #fff;
  border-radius: 5px;
  width: 40px;
  height: 54px;
  cursor: pointer;
  @include webkit('box-shadow', 0 1px 2px 0 rgba(0, 0, 0, 0.7));
  li {
    text-align: center;
    .mapMenu {
      display: block;
      margin: 5px auto;
      height: 25px;
      width: 25px;
    }
    i {
      font-size: 14px;
      font-style: normal;
      color: #4d4d4d;
    }
  }
}
.cutFullClass {
  height: $mapHeight !important;
}
.tool_top {
  top: 16px;
}
</style>