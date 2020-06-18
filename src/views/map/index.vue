<template>
  <main id="map">
    <div id="mapShow" class="map_main frame_center"></div>
  </main>
</template>

<script>
import { Map } from "../../map";
import { onMounted } from "@vue/composition-api";
export default {
  name: "mapTmp",
  setup() {
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
        map.centerAndZoom(point, 13); //添加初始化中心点及地图层级
        map.enableScrollWheelZoom(); //开启鼠标滚轮缩放功能。仅对PC上有效
        map.enableContinuousZoom(); //启用连续缩放效果，默认禁用
      });
    };
  }
};
</script>

<style lang="scss" scoped>
$mapHeight: 759px;
.map_main {
  height: $mapHeight;
}
</style>