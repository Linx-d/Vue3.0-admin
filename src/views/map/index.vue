<template>
  <main id="map" :class="{cutFullClass: full}">
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
    <div class="alanysis">
      <div class="alanysis_top">
        <div id="online" class="alanysis_top_a echartsIndivi"></div>
        <div id="device" class="alanysis_top_b echartsIndivi"></div>
      </div>
      <div class="alanysis_bottom">
        <div class="alanysis_bottom_L echartsIndivi">
          <a href="javascript:;" id="grandTotal">
            <h1
              style="color: #222; font-weight: 500; font-size: 18px; margin-left: 15px; margin-top: 20px;margin-bottom: 20px;"
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
                <td style="color: #153147; font-size: 26px;">{{ alarmData.tsum }}</td>
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
                  <span style="color: #153147;">+{{ alarmData.newTSum }}</span>
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
          <div id="history"></div>
        </div>
      </div>
      <div class="alanysis_right">
        <div id="system" class="alanysis_right_content echartsIndivi"></div>
      </div>
    </div>
    <!-- alanysis 数据分析模块 end -->
  </main>
</template>

<script>
import { Map } from "@/map";
import { onMounted, computed, reactive } from "@vue/composition-api";
import {
  listAlarmView,
  getAlarmView,
  listUserLocation,
  add
} from "@/api/mapApi";
import { listRail, selectRailList, listUserInfoByRail } from "@/api/railApi";
import individuaction from "./custom_map_config/custom_map_config.json"; // 个性化地图 所用样式文件
import { adaptionEchartsV2 } from "@/utils/common"; // 图表自适应
import alarmOption from "./options/alarmOption.js"; // 告警模块
import deviceOption from "./options/deviceOption.js"; // 设备模块
import historyOption from "./options/historyOption.js"; // 历史告警模块
import onlineOption from "./options/onlineOption.js"; // 在线统计模块
import systemOption from "./options/systemOption.js"; // 系统统计模块
import onLineIcon from "./images/marker_online.png";
import unLineIcon from "./images/marker_unline.png";
import dangerIcon from "./images/marker_danger.png";
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
        //添加地图类型控件
        map.addControl(
          new BMap.MapTypeControl({
            mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
          })
        );
        map.centerAndZoom(new BMap.Point(107.26569, 28.676057), 17); // 初始化地图,设置中心点坐标和地图级别
        map.setCurrentCity("重庆"); // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        listUserLocation()
          .then(res => {
            let code = res.code;
            let data = res.data;
            let markers = [];
            let pointArray = [];
            let opts = {
              width: 250,
              height: 80,
              title: "个人信息",
              enableMessage: true //设置允许信息窗发送短息
            };
            // 状态统计
            let status = {
              personStatic: data.length,
              eletricStatic: 0,
              temperatureStatic: 0,
              onlineStatic: 0
            };
            data.forEach(item => {
              let gmtTime = new Date().getTime() - new Date(item.gmtCreate).getTime();
              let deviceOline = false;
              if(gmtTime<300001) {
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
              // let marker = new BMap.Marker(point);
              let content = `姓名: ${item.userName} \n温度: ${item.temperature}`;
              addClickHandler(content, marker);
              markers.push(marker);
              pointArray.push(point);
            });
            online(status); // 统计表 比例
            function addClickHandler(content, marker) {
              marker.addEventListener("click", function(e) {
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
              markers: markers
            });
          });
      });
    };
    /**
     * 在线率 online
     */
    const online = status => {
      let myChart = root.$echarts.init(document.getElementById("online"));
      adaptionEchartsV2(myChart);
      let option = onlineOption;
      onlineOption.series[0].data[0].value = status.temperatureStatic;
      onlineOption.series[0].data[1].value = status.personStatic;
      onlineOption.series[0].data[2].value = status.onlineStatic;
      onlineOption.series[0].data[3].value = status.eletricStatic;
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
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
      date: ""
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
      getAlarmView().then(res => {
        // console.log(res);
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
     * 围栏统计 rail
     */
    const device = () => {
      let myChart = root.$echarts.init(document.getElementById("device"));
      adaptionEchartsV2(myChart);
      let option = deviceOption;
      let railListPaging = reactive({
        pageNum: 1,
        pageSize: 5
      });
      // 查询所有围栏信息 selectRailList
      const selectRailList = railListPaging => {
        listRail(railListPaging).then(res => {
          let data = res.data.list ? res.data.list : res.data;
          let size = res.data.size,
            hasPreviousPage = res.data.hasPreviousPage;
          let statistics = {
            normalArr: [],
            abnormalArr: [],
            railNameArr: []
          }
          let normalArr = [];
          let abnormalArr = [];
          let railNameArr = [];
          data.forEach(item => {
            // console.log(item)
            listUserInfoByRail(item.id).then(res => {
              let abnormalPerson = 0;
              let data = res.data;
              data.forEach(item => {
                let temperature = parseFloat(item.temperature);
                if (temperature > 37.3) {
                  abnormalPerson++;
                }
              });
              item.abnormalPerson = abnormalPerson;
              statistics.railNameArr.push(item.railName);
              statistics.normalArr.push(item.personSum);
              statistics.abnormalArr.push(item.abnormalPerson);
            });
          });
          return statistics;
        }).then(data => {
          // option.yAxis.data = data.railNameArr;
          // option.series[0].data = data.normalArr;
          // option.series[1].data = data.abnormalArr;
          // console.log(option);
          myChart.setOption(option);
        });
      };
      selectRailList();
    };
    /**
     * 告警历史 history
     */
    const history = () => {
      listAlarmView()
        .then(res => {
          return res.data;
        })
        .then(data => {
          let myChart = root.$echarts.init(document.getElementById("history"));

          let alarmSum = [];
          let personSum = [];
          let psum = [];
          let tsum = [];
          let gmtCreate = [];
          data.forEach(item => {
            gmtCreate.push(item.gmtCreate);
            alarmSum.push(item.alarmSum);
            personSum.push(item.personSum);
            psum.push(item.psum);
            tsum.push(item.tsum);
          });

          adaptionEchartsV2(myChart);
          // 使用刚指定的配置项和数据显示图表。
          let option = historyOption;
          option.xAxis.data = gmtCreate;
          option.series[0].data = alarmSum;
          option.series[1].data = personSum;
          option.series[2].data = psum;
          option.series[3].data = tsum;
          myChart.setOption(option);
        });
    };

    /**
     * 统计 system
     */
    const system = () => {
      let myChart = root.$echarts.init(document.getElementById("system"));
      adaptionEchartsV2(myChart);
      let option = systemOption;
      myChart.setOption(option);
    };

    /**
     * 生命周期函数 onMounted
     */
    onMounted(() => {
      alarm(); // 告警图表
      device(); // 设备图表
      history(); // 历史图表
      system(); // 历史图表
      baiduMap(); // 百度地图
    });
    return { cutFull, full, alarmData };
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
.tool_top {
  top: 16px;
}

// 数据分析 alanysis 模块
.alanysis {
  height: 100%;
  .alanysis_top {
    height: 60%;
    width: 20%;
    position: relative;
    .alanysis_top_a {
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
    }
    .alanysis_top_b {
      width: 100%;
      height: 0%;
      right: 0;
      bottom: 0;
    }
  }
  .alanysis_bottom {
    height: 40%;
    width: 100%;
    position: relative;
    .alanysis_bottom_L {
      width: 20%;
      height: 100%;
      float: left;
      left: 0;
      bottom: 0;
    }
    .alanysis_bottom_R {
      width: 80%;
      height: 100%;
      float: right;
      right: 0;
      bottom: 0;
      padding-top: 20px;
      @include webkit("box-sizing", border-box);
      #history {
        height: 100%;
        width: 100%;
      }
    }
  }
  .alanysis_right {
    height: 60%;
    width: 20%;
    position: absolute;
    right: 0;
    top: 0;
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

/*---------------------table login-----------------------*/
.tdBgc {
  background-color: #f4f4f4;
  border-radius: 5px;
  min-width: 72px;
}

.tdcolor {
}

#grandTotal {
  display: block;
  width: 94%;
  background-color: #fff;
  margin-top: 10px;
  border: 1px solid #fff;
  margin: 9.2px auto;
  @include webkit("box-shadow", rgba(0, 0, 0, 0.1) 0 0 8px);
  min-height: 168.5px;
  min-width: 303px;
  height: 90%;
  padding-top: 30px;
  box-sizing: border-box;
  table {
    color: #000;
    padding: 0;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    padding-bottom: 0;
    line-height: 47px;
  }
}
/*---------------------table end-----------------------*/
</style>