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
    <!-- alanysis 数据分析模块 login -->
    <div class="alanysis">
      <div class="alanysis_top">
        <div id="online" class="alanysis_top_a"></div>
        <div id="alarm" class="alanysis_top_b"></div>
      </div>
      <div class="alanysis_bottom">
        <div id="device" class="alanysis_bottom_L"></div>
        <div id="history" :class="['alanysis_bottom_R']"></div>
      </div>
    </div>
    <!-- alanysis 数据分析模块 end -->
  </main>
</template>

<script>
import { Map } from "@/map"
import { onMounted, computed } from "@vue/composition-api"
import individuaction from "./custom_map_config/custom_map_config.json" // 个性化地图 所用样式文件
import { adaptionEchartsV2 } from "@/utils/common" // 图表自适应
import alarmOption from "./options/alarmOption.js" // 告警模块
import deviceOption from "./options/deviceOption.js" // 设备模块
import historyOption from "./options/historyOption.js" // 历史告警模块
import onlineOption from "./options/onlineOption.js"  // 在线统计模块
export default {
  name: "mapModule",
  setup(props, { root }) {
    const cutFull = () => {
      // 切换
      root.$store.commit("SET_FULL"); // commit 不用指向 map模块
    };
    const full = computed(() => {
      return root.$store.state.map.full;
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
        map.setMapStyleV2({ styleJson: individuaction }); // 个性化地图
      });
    };
    /**
     * 在线率 online
     */
    const online = () => {
      let myChart = root.$echarts.init(document.getElementById("online"));
      adaptionEchartsV2(myChart);
      let option = onlineOption;
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    };

    /**
     * 告警总量 alarm
     */
    const alarm = () => {
      let myChart = root.$echarts.init(document.getElementById("alarm"));
      adaptionEchartsV2(myChart);
      let option = alarmOption;
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    };
    /**
     * 设备统计 divice
     */
    const device = () => {
      let myChart = root.$echarts.init(document.getElementById("device")); 
      adaptionEchartsV2(myChart);
      let option = deviceOption;

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    };
    /**
     * 告警历史 history
     */
    const history = () => {
      let myChart = root.$echarts.init(document.getElementById("history"));
      adaptionEchartsV2(myChart);
      // 使用刚指定的配置项和数据显示图表。
      let option = historyOption;
      myChart.on("updateAxisPointer", function(event) {
        var xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          var dimension = xAxisInfo.value + 1;
          myChart.setOption({
            series: {
              id: "pie",
              label: {
                formatter: "{b}: {@[" + dimension + "]} ({d}%)"
              },
              encode: {
                value: dimension,
                tooltip: dimension
              }
            }
          });
        }
      });
      myChart.setOption(option);
    };
    /**
     * 生命周期函数 onMounted
     */
    onMounted(() => {
      baiduMap(); // 百度地图
      online(); // 在线图表
      alarm(); // 在线图表
      device(); // 在线图表
      history(); // 在线图表
    });
    return { cutFull, full };
  }
};
</script>

<style lang="scss" scoped>
$mapHeight: 81%; // main的自适应高度

// 地图height、width的min，max 设置
$mapMinWidth: 1532px;
$mapMinHeight: 454px;

// alanysis 顶部模块 height、width的min，max 设置
$alanysisMinWidth_Top: 383px;
$alanysisMinHeight_Top: 454px;

// alanysis 底部模块 height、width的min，max 设置
$alanysisMinWidth_Bottom: 1915px;
$alanysisMinHeight_Bottom: 227px;

#map {
  height: 100vh;
  min-height: 757px;
  position: relative;
  background-color: #fff;
  .map_main {
    position: absolute;
    top: 0;
    right: 0;
    width: 80%;
    height: 60%;
    @include webkit("transition", all 0.5s);
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
  @include webkit("box-shadow", 0 1px 2px 0 rgba(0, 0, 0, 0.7));
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

// 数据分析 alanysis 模块
.alanysis {
  height: 100%;
  .alanysis_top {
    height: 60%;
    width: 20%;
    .alanysis_top_a {
      width: 100%;
      height: 50%;
    }
    .alanysis_top_b {
      width: 100%;
      height: 50%;
    }
  }
  .alanysis_bottom {
    height: 40%;
    width: 100%;
    .alanysis_bottom_L {
      width: 20%;
      height: 100%;
      float: left;
    }
    .alanysis_bottom_R {
      width: 80%;
      height: 100%;
      float: right;
    }
  }
}
</style>