<template>
  <main
    id="map"
    :class="{cutFullClass: full}"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(11, 21, 50, 0.8)"
  >
    <div id="mapShow" :class="['map_main', 'frame_center']"></div>
    <div :class="['tool', { tool_top: full }]">
      <ul>
        <li @click="cutFull">
          <svg-icon iconClass="full_screen" class="mapMenu"></svg-icon>
          <i>全屏</i>
        </li>
      </ul>
    </div>
    <!-- alanysis 数据分析模块 login -->
    <div :class="['alanysis']">
      <!-- <div
      :class="['alanysis', {'alanysisToggle': alanysisStatus.status}]"
      >-->
      <div class="case_header">
        <h1>疫情防控中心</h1>
      </div>
      <div class="alanysis_top">
        <div class="case_top_right"></div>
        <div class="case_top_left"></div>
        <div class="case_bottom_left"></div>
        <div class="case_bottom_right"></div>
        <div id="online" class="alanysis_top_a echartsIndivi"></div>
      </div>
      <div class="alanysis_bottom">
        <div class="alanysis_bottom_L echartsIndivi">
          <div class="case_top_right"></div>
          <div class="case_top_left"></div>
          <div class="case_bottom_left"></div>
          <div class="case_bottom_right"></div>
          <a href="javascript:;" id="grandTotal">
            <h1
              style="color: #fff; font-weight: 500; font-size: 18px; margin-left: 15px; margin-top: 20px;margin-bottom: 20px;"
            >
              警告统计
              <span
                style="color: #cfcfcf; font-size: 12px; text-align: center; display: inline-block;"
              >
                更新时间
                <i
                  style="color: #cfcfcf; font-size: 12px; font-style: normal;"
                >{{ alarmData.date }}</i>
              </span>
            </h1>

            <table>
              <tr>
                <td style="color: #bf4739; font-size: 26px;">{{ alarmData.alarmSum }}</td>
                <td style="color: #cd6212; font-size: 26px;">{{ alarmData.personSum }}</td>
                <td style="color: #1089e7; font-size: 26px;">{{ alarmData.tsum }}</td>
                <td style="color: #35cbbf; font-size: 26px;">{{ alarmData.psum }}</td>
              </tr>
              <tr style="height: 30px; font-weight: 700; color: #2d2d2d; font-size: 13px;">
                <td class="tdBgc">累计告警</td>
                <td class="tdBgc">累计人数</td>
                <td class="tdBgc">温度告警</td>
                <td class="tdBgc">位置告警</td>
              </tr>
              <tr style="font-weight: 700; height: 35px;">
                <td style="color: #b2b2b2; font-size: 13px;">
                  <span>新增</span>
                  <span style="color: #bf4739;">+{{ alarmData.newSum }}</span>
                </td>
                <td style="color: #b2b2b2; font-size: 13px;">
                  <span>新增</span>
                  <span style="color: #cd6212;">+{{ alarmData.newPersonSum }}</span>
                </td>
                <td style="color: #b2b2b2; font-size: 13px;">
                  <span>新增</span>
                  <span style="color: #1089e7;">+{{ alarmData.newTSum }}</span>
                </td>
                <td style="color: #b2b2b2; font-size: 13px;">
                  <span>新增</span>
                  <span style="color: #35cbbf;">+{{ alarmData.newPSum }}</span>
                </td>
              </tr>
            </table>
          </a>
        </div>
        <div :class="['alanysis_bottom_R echartsIndivi']">
          <div class="case_top_right"></div>
          <div class="case_top_left"></div>
          <div class="case_bottom_left"></div>
          <div class="case_bottom_right"></div>
          <div id="history"></div>
        </div>
      </div>
      <div class="alanysis_right">
        <div class="case_top_right"></div>
        <div class="case_top_left"></div>
        <div class="case_bottom_left"></div>
        <div class="case_bottom_right"></div>
        <div id="system" class="alanysis_right_content echartsIndivi"></div>
      </div>
    </div>
    <!-- alanysis 数据分析模块 end -->
  </main>
</template>

<script>
import { Map } from "@/map";
import {
  onMounted,
  computed,
  reactive,
  watchEffect,
  ref,
} from "@vue/composition-api";
import {
  listAlarmView,
  getAlarmView,
  listUserLocation,
  add,
} from "@/api/mapApi";
import { listRail, selectRailList, listUserInfoByRail } from "@/api/railApi";
import individuaction from "./custom_map_config/custom_map_config.json"; // 个性化地图 所用样式文件
import { adaptionEchartsV2 } from "@/utils/common"; // 图表自适应
import alarmOption from "./options/alarmOption.js"; // 告警模块
import deviceOption from "./options/deviceOption.js"; // 设备模块
import historyOption from "./options/historyOption.js"; // 历史告警模块
import onlineOption from "./options/onlineOption.js"; // 在线统计模块
import systemOption from "./options/systemOption.js"; // 系统统计模块
import onLineIcon from "@/views/images/marker_online.png";
import unLineIcon from "@/views/images/marker_unline.png";
import dangerIcon from "@/views/images/marker_danger.png";
import pointAggre from "@/views/images/pointAggre.png"; // 点聚合
import case_top_right from "@/views/images/case_top_right.png";
import custom_map_config from "./custom_map_config/custom_map_config2.json";
import "./custom_echarts_config/dark.js"; // dark echarts
export default {
  name: "mapModule",
  setup(props, { root }) {
    /**
     * 图表框
     */
    const echartsBorder = reactive({
      top_right: case_top_right,
    });
    const cutFull = () => {
      adaptionEchartsV2(systemChart);
      adaptionEchartsV2(onlineChart);
      adaptionEchartsV2(historyChart);
      // systemChart.resize();
      // onlineChart.resize();
      alanysisStatus.status = !alanysisStatus.status;
      // 切换
      root.$store.commit("SET_FULL"); // commit 不用指向 map模块
    };
    // window.onresize = function() {
    //   systemChart.resize();
    //   onlineChart.resize();
    //   historyChart.resize();
    //   //myChart1.resize();    //若有多个图表变动，可多写
    // };
    const full = computed(() => {
      return root.$store.state.map.full;
    });
    // 隐藏图表
    const alanysisStatus = reactive({
      status: false,
    });
    /**
     * 百度地图方法
     */
    let baiduMap = () => {
      Map("EG4ercSC4ZmBIhIcBvyoj65q12m2fy00").then((BMap) => {
        let map = new BMap.Map("mapShow"); // 创建Map实例
        //添加地图类型控件
        // map.addControl(
        //   new BMap.MapTypeControl({
        //     mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
        //   })
        // );
        listUserLocation().then((res) => {
          let code = res.code;
          let data = res.data;
          let len = data.length;
          let zoomLevel = null;
          if (len < 50) {
            zoomLevel = 19;
          } else if (len < 100) {
            zoomLevel = 17;
          } else if (len < 300) {
            zoomLevel = 15;
          } else if (len < 500) {
            zoomLevel = 12;
          } else {
            zoomLevel = 10;
          }
          map.centerAndZoom(new BMap.Point(107.26569, 28.676057), zoomLevel); // 初始化地图,设置中心点坐标和地图级别
          map.setCurrentCity("重庆"); // 设置地图显示的城市 此项是必须设置的
          map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
          map.setMapStyleV2({ styleJson: custom_map_config });
          let markers = [];
          let pointArray = [];
          let opts = {
            width: 250,
            height: 80,
            title: "个人信息",
            enableMessage: true, //设置允许信息窗发送短息
          };
          // 状态统计
          let status = {
            personStatic: data.length,
            eletricStatic: 0,
            temperatureStatic: 0,
            onlineStatic: 0,
          };
          data.forEach((item) => {
            let gmtTime =
              new Date().getTime() - new Date(item.gmtCreate).getTime();
            let deviceOline = false;
            if (gmtTime < 1800001) {
              deviceOline = true;
            }
            let temperature = parseFloat(item.temperature);
            let electric = item.electric;
            let myIcon = new BMap.Icon(unLineIcon, new BMap.Size(32, 32));
            if (temperature > 37.3) {
              status.temperatureStatic++;
              myIcon = new BMap.Icon(dangerIcon, new BMap.Size(32, 32));
            }
            if (deviceOline) {
              status.onlineStatic++;
              myIcon = new BMap.Icon(onLineIcon, new BMap.Size(32, 32));
            }
            if (electric < 2) {
              status.eletricStatic++;
            }
            let point = new BMap.Point(item.longitude, item.latitude);
            let marker = new BMap.Marker(point, { icon: myIcon });
            // marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            // let marker = new BMap.Marker(point);
            let content = `姓名: ${item.userName} \n温度: ${item.temperature}`;
            addClickHandler(content, marker);
            markers.push(marker);
            pointArray.push(point);
          });
          online(status); // 统计表 比例
          loading.value = false;
          function addClickHandler(content, marker) {
            marker.addEventListener("click", function (e) {
              openInfo(content, e);
            });
          }
          function openInfo(content, e) {
            let p = e.target;
            let point = new BMap.Point(
              p.getPosition().lng,
              p.getPosition().lat
            );
            let infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
            map.openInfoWindow(infoWindow, point); //开启信息窗口
          }
          //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
          map.setViewport(pointArray);
          let markerClusterer = new BMapLib.MarkerClusterer(map, {
            markers: markers,
            minClusterSize: 2, //最小的聚合数量，小于该数量的不能成为一个聚合，默认为2
            styles: [
              {
                url: pointAggre,
                size: new BMap.Size(48, 48),
              },
            ],
          });
        });
      });
    };
    /**
     * 在线率 online
     */
    let onlineChart = null;
    const online = (status) => {
      let onlineChart = root.$echarts.init(
        document.getElementById("online"),
        "dark"
      );
      adaptionEchartsV2(onlineChart);
      let option = onlineOption;
      onlineOption.series[0].data[0].value = status.temperatureStatic;
      onlineOption.series[0].data[1].value = status.personStatic;
      onlineOption.series[0].data[2].value = status.onlineStatic;
      onlineOption.series[0].data[3].value = status.eletricStatic;
      // 使用刚指定的配置项和数据显示图表。
      onlineChart.setOption(option);
    };

    /**
     * 告警总量 alarm
     */
    const alarmData = reactive({
      newPSum: "",
      newPersonSum: "",
      newSum: "",
      newTSum: "",
      alarmSum: "",
      personSum: "",
      psum: "",
      tsum: "",
      date: "",
    });
    const alarm = () => {
      getView();
    };
    setInterval(getView, 6000000);
    function getView() {
      // let randomObj = reactive({
      //   imei: "ut1000001000000",
      //   temperature: "39.8",
      //   latitude: "29.490295",
      //   type: "0",
      //   longitude: "106.486654",
      //   electric: "2"
      // });
      // add(randomObj).then(res => {
      //   console.log(res);
      // });
      getAlarmView().then((res) => {
        let data = res.data;
        // time
        alarmData.date = data.date;
        // new
        alarmData.newPSum = data.newPSum;
        alarmData.newPersonSum = data.newPersonSum;
        alarmData.newSum = data.newSum;
        alarmData.newTSum = data.newTSum;
        // static
        alarmData.alarmSum = data.alarmSum;
        alarmData.personSum = data.personSum;
        alarmData.psum = data.psum;
        alarmData.tsum = data.tsum;
      });
    }
    /**
     * 告警历史 history
     */
    let historyChart = null;
    const history = () => {
      listAlarmView()
        .then((res) => {
          return res.data;
        })
        .then((data) => {
          // let darkEcharts = JSON.parse(dark);
          // echarts.registerTheme('dark', darkEcharts);
          historyChart = root.$echarts.init(
            document.getElementById("history"),
            "dark"
          );

          let alarmSum = [];
          let personSum = [];
          let psum = [];
          let tsum = [];
          let gmtCreate = [];
          data.forEach((item) => {
            gmtCreate.push(item.gmtCreate);
            alarmSum.push(item.alarmSum);
            personSum.push(item.personSum);
            psum.push(item.psum);
            tsum.push(item.tsum);
          });

          adaptionEchartsV2(historyChart);
          // 使用刚指定的配置项和数据显示图表。
          let option = historyOption;
          option.xAxis.data = gmtCreate;
          option.series[0].data = alarmSum;
          option.series[1].data = personSum;
          option.series[2].data = psum;
          option.series[3].data = tsum;
          historyChart.setOption(option);
        });
    };

    /**
     * 统计 system
     */
    let systemChart = null;
    const system = () => {
      systemChart = root.$echarts.init(
        document.getElementById("system"),
        "dark"
      );
      adaptionEchartsV2(systemChart);
      let option = systemOption;
      systemChart.setOption(option);
    };
    watchEffect(() => {
      adaptionEchartsV2(systemChart);
      adaptionEchartsV2(historyChart);
      adaptionEchartsV2(onlineChart);
    });
    const loading = ref(true);
    /**
     * 生命周期函数 onMounted
     */
    onMounted(() => {
      alarm(); // 告警图表
      history(); // 历史图表
      system(); // 历史图表
      online({
        personStatic: 0,
        eletricStatic: 0,
        temperatureStatic: 0,
        onlineStatic: 0,
      });
      baiduMap(); // 百度地图
    });
    return { cutFull, full, alarmData, alanysisStatus, echartsBorder, loading };
  },
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

// echarts CSS
$echartsMargin: 15px;
$echartsBorder: 1px solid #146ede;

#map {
  height: 100vh;
  min-height: 757px;
  min-width: $layout-min-width;
  position: relative;
  background-color: #fff;
  .map_main {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
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
  z-index: 999;
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
.alanysisToggle {
  display: none;
}
.alanysisToggleShow {
  display: block;
}
.tool_top {
  top: 16px;
}

// 数据分析 alanysis 模块
.alanysis {
  height: 100%;
  overflow: hidden;
  padding-top: 80px;
  min-width: $layout-min-width;
  @include webkit("box-sizing", border-box);
  .alanysis_top {
    height: 52%;
    width: 20%;
    position: relative;
    top: 15px;
    left: 15px;
    background-color: #0b1532;
    .alanysis_top_a {
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      border: $echartsBorder;
    }
  }
  .alanysis_bottom {
    height: 41%;
    width: 100%;
    position: relative;
    bottom: -36px;
    .alanysis_bottom_L {
      width: 20%;
      height: 100%;
      float: $echartsMargin;
      left: $echartsMargin;
      bottom: 0;
      background: #0b1532;
      border: $echartsBorder;
    }
    .alanysis_bottom_R {
      width: 77.2%;
      height: 100%;
      float: right;
      right: $echartsMargin;
      bottom: 0;
      @include webkit("box-sizing", border-box);
      background: #0b1532;
      #history {
        height: 100%;
        width: 100%;
        border: $echartsBorder;
        float: right;
      }
    }
  }
  .alanysis_right {
    height: 47%;
    width: 20%;
    position: absolute;
    right: $echartsMargin;
    top: 95px;
    border: $echartsBorder;
    background-color: #0b1532;
    .alanysis_right_content {
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
.echartsIndivi {
  background: #fff;
  position: absolute;
  @include webkit("box-sizing", boder-box);
}

/**echartsBorder */

.case_top_left {
  width: 15px;
  height: 14px;
  background-image: url("../images/case_top_left.png");
  position: absolute;
  left: -8px;
  top: -8px;
}
.case_top_right {
  width: 15px;
  height: 14px;
  background-image: url("../images/case_top_right.png");
  position: absolute;
  top: -7px;
  right: -8px;
}
.case_bottom_left {
  width: 15px;
  height: 14px;
  background-image: url("../images/case_bottom_left.png");
  position: absolute;
  left: -7px;
  bottom: -7px;
}
.case_bottom_right {
  width: 15px;
  height: 14px;
  background-image: url("../images/case_bottom_right.png");
  position: absolute;
  right: -9px;
  bottom: -7px;
}
.case_header {
  height: 116px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-image: url("../images/case_header.png");
  h1 {
    text-align: center;
    color: #fff;
    line-height: 116px;
    font-weight: 700;
    letter-spacing: 3px;
  }
}

/*---------------------table login-----------------------*/
.tdBgc {
  background-color: #273e84;
  border-radius: 5px;
  min-width: 72px;
  color: #fff;
}

.tdcolor {
}

#grandTotal {
  display: block;
  width: 94%;
  background-color: #0b1532;
  margin-top: 10px;
  border: 1px solid #0b1532;
  margin: 9.2px auto;
  @include webkit("box-shadow", rgba(0, 0, 0, 0.1) 0 0 8px);
  min-height: 168.5px;
  min-width: 303px;
  height: 90%;
  padding-top: 8%;
  box-sizing: border-box;
  table {
    color: #000;
    padding: 0;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    padding-bottom: 0;
    line-height: 59px;
    background: #0b1532;
  }
}
/*---------------------table end-----------------------*/
</style>