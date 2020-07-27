<template>
  <div class="chunk_cnt">
    <div class="info_title">
      <span>成员详情</span>
    </div>
    <div class="cnt_tool">
      <a class="memberLink" href="javascript:;" @click="memberInfoBack">
        <svg-icon iconClass="double_headed" class="double_headed"></svg-icon>返回
      </a>
      <!--
      <a class="memberLink" href="javascript:;">编辑</a>
      <a class="memberLink" href="javascript:;">移除</a>
      -->
    </div>
    <div class="info_main">
      <div class="info_head">
        <div class="info_head_l">
          <svg-icon iconClass="info" class="info_svg"></svg-icon>
        </div>
        <div class="info_head_r">
          <p>
            {{ currentMemberInfo.name }}
            <span>
              <svg-icon iconClass="info_small" class="info_small"></svg-icon>
            </span>
          </p>
          <div class="info_status">
            <span v-if="currentMemberInfo.online">
              <svg-icon iconClass="online1" class="online my_icon"></svg-icon>
            </span>
            <span v-if="!currentMemberInfo.online">
              <svg-icon iconClass="unline" class="unline"></svg-icon>
            </span>
            <span>
              <svg-icon
                iconClass="electric0"
                class="electric my_icon"
                v-if="currentMemberInfo.electric==='0'"
              ></svg-icon>
            </span>
            <span>
              <svg-icon
                iconClass="electric1"
                class="electric my_icon"
                v-if="currentMemberInfo.electric==='1'"
              ></svg-icon>
            </span>
            <span>
              <svg-icon
                iconClass="electric2"
                class="electric my_icon"
                v-if="currentMemberInfo.electric==='2'"
              ></svg-icon>
            </span>
            <span>
              <svg-icon
                iconClass="electric3"
                class="electric my_icon"
                v-if="currentMemberInfo.electric==='3'"
              ></svg-icon>
            </span>
          </div>
        </div>
      </div>
      <div id="info_personal" class="info_module">
        <ul>
          <li>
            <span>年龄：</span>
            <i>{{ currentMemberInfo.age }}</i>
          </li>
          <li>
            <span>电话：</span>
            <i>{{ currentMemberInfo.tel }}</i>
          </li>
          <li>
            <span>地址：</span>
            <i>{{ currentMemberInfo.address }}</i>
          </li>
          <li>
            <span>围栏：</span>
            <i v-if="tmpHistory.railName" class="railText">{{ tmpHistory.railName }}</i>
            <strong v-if="!tmpHistory.railName" class="modifyInfoBtn" @click="addRail">添加</strong>
            <strong v-else class="modifyInfoBtn" @click="unBindOpen">解绑围栏</strong>
          </li>
          <li>
            <span>体温告警：</span>
            <i>{{ currentMemberInfo.tnumber }}</i>
          </li>
          <li>
            <span>位置告警：</span>
            <i>{{ currentMemberInfo.pnumber }}</i>
          </li>
        </ul>
      </div>
      <div id="info_temperature" class="info_module"></div>
      <div class="info_module mapBox">
        <div id="mapShow"></div>
      </div>
      <el-dialog
        title="围栏列表"
        :visible.sync="dialogRailVisible.status"
        class="railTable"
        id="memberRailList"
      >
        <el-table :data="railList.data" style="width: 100%" max-height="400">
          <el-table-column fixed prop="gmtCreate" label="日期" width="220"></el-table-column>
          <el-table-column prop="railName" label="围栏名称" width="120"></el-table-column>
          <el-table-column prop="personSum" label="人数" width="120"></el-table-column>
          <el-table-column prop="radius" label="半径" width="120"></el-table-column>
          <el-table-column prop="railAddr" label="地址" width="300"></el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="selectRow(scope.$index, railList.data)"
                type="text"
                size="small"
              >选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { Map } from "@/map"; // 导入map.js文件
import { onMounted, watchEffect, reactive } from "@vue/composition-api";
import { switchModule, cloneArray } from "@/utils/common";
import {
  batchDeleteRailUser,
  listDeviceAlarmInfoByUserId,
  batchUpdateUser
} from "@/api/contactsApi";
import { listRail } from "@/api/railApi";
import personTravel from "@/views/images/personTravel.png";
export default {
  name: "memberList",
  props: {
    currentDepart: {
      // 不用在setup中重新声明一次变量
      type: Object,
      default: () => {} // default值 需要使用箭头函数回调
    },
    currentMemberInfo: {
      type: Object,
      default: () => {}
    },
    contactsModule: {
      type: Object,
      default: () => []
    },
    tmpHistory: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root }) {
    let contactsModule = props.contactsModule; // contacts 模块
    const dialogRailVisible = reactive({
      status: false
    });
    /**
     * 查询围栏列表
     */
    let railList = reactive({
      pageNum: 1,
      pageSize: 15,
      value: false,
      data: []
    });
    const addRail = () => {
      dialogRailVisible.status = true;
      listRail().then(res => {
        cloneArray(railList.data, res.data.list);
      });
    };
    const selectRow = (index, rows) => {
      let railId = rows[index].id;
      let railName = rows[index].railName;
      bindOpen(railId, railName);
    };
    // 绑定围栏确认框
    const bindOpen = (railId, railName) => {
      const h = root.$createElement;
      root
        .$msgbox({
          title: "绑定围栏",
          message: h("p", null, [
            h(
              "span",
              null,
              `将 ${props.currentMemberInfo.name} 绑定到${railName}`
            )
            //h("i", { style: "color: teal" }, "VNode")
          ]),
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "执行中...";
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 1000);
            } else {
              done();
            }
          }
        })
        .then(action => {
          let data = {
            railId: railId,
            userId: [props.currentMemberInfo.userId]
          };
          batchUpdateUser(data).then(res => {
            let code = res.code;
            if (code === 0) {
              root.$message({
                type: "success",
                message: "绑定成功"
              });
              props.tmpHistory.railName = railName;
              dialogRailVisible.status = false;
            } else {
              root.$message({
                type: "error",
                message: "绑定失败"
              });
            }
          });
        })
        .catch(() => {
          root.$message({
            type: "info",
            message: "已取消绑定"
          });
        });
    };

    // 解绑围栏确认框
    const unBindOpen = () => {
      const h = root.$createElement;
      root
        .$msgbox({
          title: "解绑围栏",
          message: h("p", null, [
            h(
              "span",
              null,
              `将 ${props.currentMemberInfo.name} 从 “${props.tmpHistory.railName}” 中解绑`
            )
            //h("i", { style: "color: teal" }, "VNode")
          ]),
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "执行中...";
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 1000);
            } else {
              done();
            }
          }
        })
        .then(action => {
          unBindRail();
        })
        .catch(() => {
          root.$message({
            type: "info",
            message: "已取消解绑"
          });
        });
    };

    const unBindRail = () => {
      let userId = [props.currentMemberInfo.userId];
      batchDeleteRailUser(userId).then(res => {
        let code = res.code;
        if (code === 0) {
          props.tmpHistory.railName = null;
          root.$message({
            type: "success",
            message: "解绑成功"
          });
        } else {
          root.$message({
            type: "error",
            message: "解绑失败"
          });
        }
      });
    };
    /**
     *  成员个人信息温度变化图表
     */
    const memberInfoEcharts = () => {
      let tmpHistory = props.tmpHistory; 
      watchEffect(() => {
        // 基于准备好的dom，初始化echarts实例
        let myChart = root.$echarts.init(
          document.getElementById("info_temperature")
        ); // root.$echarts
        let newArr_time = tmpHistory.newArr_time;
        let newArr_tmp = tmpHistory.newArr_tmp;
        // 指定图表的配置项和数据
        let option = {
          title: {
            text: "体温变化",
            subtext: "疫情防控"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["最高温度"] //定义曲线具体数据
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: "none"
              },
              dataView: {
                readOnly: true,
                optionToContent: function(opt) {
                  let axisData = opt.xAxis[0].data;
                  let table =
                    '<table style="width:70%;text-align:left;line-height: 28px;" class="tmp_table"><tbody><tr>' +
                    "<td>时间</td>" +
                    "<td>温度</td>" +
                    //+ '<td>' + series[1].name + '</td>'
                    "</tr>";
                  for (let len = newArr_time.length, i = len - 1; i >= 0; i--) {
                    if (newArr_tmp[i] >= 37.3) {
                      table += '<tr style="color: red;">';
                    } else {
                      table += "<tr>";
                    }
                    table +=
                      "<td>" +
                      newArr_time[i] +
                      "</td>" +
                      "<td>" +
                      newArr_tmp[i] +
                      "</td>" +
                      //+ '<td>' + series[1].data[i] + '</td>'
                      "</tr>";
                  }
                  table += "</tbody></table>";
                  return table;
                },
                contentToOption: function(opts) {
                  //this.optionToContent();
                }
              },
              //magicType: {type: ['line', 'bar']}, // 柱状图
              //restore: {}
              saveAsImage: {}
            }
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: newArr_time,
            axisLabel: {
              rotate: 285
            }
          },
          grid: {
            bottom: "40%"
          },
          yAxis: {
            type: "value",
            min: 24,
            max: 40,
            interval: 2,
            axisLabel: {
              formatter: "{value}°C" //Y坐标
            }
          },
          dataZoom: [
            {
              type: "inside",
              start: 0,
              end: 10
            },
            {
              start: 0,
              end: 10,
              handleIcon:
                "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
              handleSize: "80%",
              handleStyle: {
                color: "#fff",
                shadowBlur: 3,
                shadowColor: "rgba(0, 0, 0, 0.6)",
                shadowOffsetX: 2,
                shadowOffsetY: 2
              }
            }
          ],
          visualMap: {
            show: false,
            dimension: 1,
            pieces: [
              {
                gte: 37.3,
                lte: 9999,
                color: "rgb(194, 53, 49)"
              }
            ], //pieces的值由动态数据决定
            outOfRange: {
              color: "green"
            }
          },
          series: [
            {
              name: "",
              type: "line",
              data: newArr_tmp,
              markPoint: {
                data: [
                  { type: "max", name: "最大值" },
                  { type: "min", name: "最小值" }
                ]
              },
              markLine: {
                data: [
                  //{type: 'average', name: '平均值'}设置标线类型
                  { yAxis: 37.3 }
                ]
              }
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。

        myChart.resize(); // 使 echarts 图表随页面大小变化而变化
        myChart.setOption(option);
        /*window.onresize = function() {
          myChart.resize();
          //myChart1.resize();    //若有多个图表变动，可多写
        };*/
      });
    };
    const memberInfoBack = () => {
      switchModule(contactsModule, "memberList");
    };
    /**
     * 百度地图方法
     */
    const baiduMap = () => {
      watchEffect(() => {
        // 成员坐标
        let location = {
          lng: props.currentMemberInfo.userLongitude, // 注意经纬度的对应 userLongitude
          lat: props.currentMemberInfo.userLatitude // 注意经纬度的对应 userLatitude
        };
        // 围栏信息
        let railInfo = {
          lng: props.currentMemberInfo.railLongitude,
          lat: props.currentMemberInfo.railLatitude,
          radius: props.currentMemberInfo.radius
        };
        Map("ak").then(BMap => {
          let map = new BMap.Map("mapShow"); // 创建Map实例
          let pointArray = [];
          let point = new BMap.Point(location.lng, location.lat); // 创建点坐标
          pointArray.push(point);
          let marker = new BMap.Marker(point);
          map.addOverlay(marker); //添加一个标注
          map.enableScrollWheelZoom(); //开启鼠标滚轮缩放功能。仅对PC上有效
          map.enableContinuousZoom(); //启用连续缩放效果，默认禁用
          let lushu;
          // 实例化一个驾车导航用来生成路线
          let drv = new BMap.DrivingRoute("北京", {
            onSearchComplete: function(res) {
              if (drv.getStatus() == BMAP_STATUS_SUCCESS) {
                let plan = res.getPlan(0);
                let arrPois = [];
                for (let j = 0; j < plan.getNumRoutes(); j++) {
                  let route = plan.getRoute(j);
                  arrPois = arrPois.concat(route.getPath());
                }
                map.addOverlay(
                  new BMap.Polyline(arrPois, { strokeColor: "#111" })
                );
                map.setViewport(arrPois);
                lushu = new BMapLib.LuShu(map, arrPois, {
                  defaultContent: "从出发地到目的地", //"从天安门到百度大厦"
                  autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
                  icon: new BMap.Icon(personTravel, new BMap.Size(48, 48), {
                    anchor: new BMap.Size(20, 35)
                  }),
                  speed: 10000,
                  enableRotation: false, //是否设置marker随着道路的走向进行旋转props.tmpHistory.newArr_position
                  landmarkPois: props.tmpHistory.newArr_position
                });
              }
            }
          });
          let start = new BMap.Point(
            props.tmpHistory.newArr_position[0].lng,
            props.tmpHistory.newArr_position[0].lat
          );
          let end = new BMap.Point(
            props.tmpHistory.newArr_position[
              props.tmpHistory.newArr_position.length - 1
            ].lng,
            props.tmpHistory.newArr_position[
              props.tmpHistory.newArr_position.length - 1
            ].lat
          );
          // let start = new BMap.Point(
          //   28.63764140625861,
          //   108.37516062460054
          // );
          // let end = new BMap.Point(
          //   28.63764140625811,
          //   108.37516062460064
          // );
          drv.search(start, end);
          //绑定事件
          $("run").onclick = function() {
            lushu.start();
          };
          $("stop").onclick = function() {
            lushu.stop();
          };
          $("pause").onclick = function() {
            lushu.pause();
          };
          $("hide").onclick = function() {
            lushu.hideInfoWindow();
          };
          $("show").onclick = function() {
            lushu.showInfoWindow();
          };
          function $(element) {
            return document.getElementById(element);
          }
          //添加圆
          let railPoint = new BMap.Point(railInfo.lng, railInfo.lat); //圆的中心坐标
          let verify =
            railInfo.lng == null ||
            railInfo.lat == null ||
            railInfo.radius == null; // 验证是否绑定围栏 true为未绑定围栏
          // if (verify) {
          //   Message.warning("用户没有设置围栏");
          //   map.centerAndZoom(point, 16); // 将个人作为地图中心点
          // } else {
          //   map.centerAndZoom(railPoint, 16); // 将围栏作为地图中心点
          // }
          map.centerAndZoom(point, 13); // 将个人作为地图中心点
          let circle = new BMap.Circle(railPoint, railInfo.radius, {
            strokeColor: "blue",
            strokeWeight: 1,
            strokeOpacity: 0.01,
            fillColor: "#53aeff",
            fillOpacity: 0.4
          });
          map.addOverlay(circle);
        });
      });
    };
    onMounted(() => {
      baiduMap();
      memberInfoEcharts();
    });
    return {
      memberInfoBack,
      bindOpen,
      unBindOpen,
      addRail,
      selectRow,
      railList,
      dialogRailVisible,
      unBindRail
    };
  }
};
</script>
<style lang="scss" scoped>
$contactsHeight: 592px;
.chunk_cnt {
  height: $contactsHeight;
  .info_title {
    font-size: 18px;
    font-weight: 700;
    height: 28px;
    font-weight: 700;
    overflow: hidden;
    padding-bottom: 10px;
    line-height: 28px;
    border-bottom: 1px solid #e4e6e9;
  }
}
.cnt_tool {
  height: 38px;
  width: 100%;
  background: #dfe9f5;
  padding: 6px 10px;
  border-bottom: 1px solid #bdc9d6;
  box-sizing: border-box;
  .double_headed {
    vertical-align: middle;
    margin-top: -2px;
    margin-right: 2px;
  }
}
.info_main {
  padding: 0 10px;
  .info_head {
    height: 110px;
    padding: 20px 0 20px;
    @include webkit("box-sizing", border-box);
    .info_head_l {
      float: left;
      .info_svg {
        height: 70px;
        width: 70px;
        margin-right: 20px;
        vertical-align: middle;
      }
    }
    .info_head_r {
      float: left;
      p {
        font-size: 16px;
        margin-bottom: 10px;
        .info_small {
          margin-left: 5px;
          vertical-align: top;
        }
      }
      .info_status {
        span:first-child {
          color: #787878;
          margin-right: 8px;
        }
        span:last-child {
          color: #5090f1;
        }
        margin-bottom: 10px;
      }
    }
  }
  .info_module {
    padding: 35px 25px 25px 25px;
    border-top: 1px dashed #e4e6e9;
    @include webkit("box-sizing", border-box);
  }
  #info_personal {
    ul {
      li {
        font-size: 14px;
        span {
          color: #787878;
          margin-right: 15px;
        }
        i {
          font-style: normal;
        }
        margin-bottom: 15px;
        .railText {
          margin-right: 10px;
        }
      }
    }
  }
  #info_temperature {
    height: 500px;
  }
  .mapBox {
    padding-top: 0;
    border-top: none;
  }
  #mapShow {
    height: 500px;
  }
}

/**baidu echarts */
.weui-grids .weui-grid {
  background-color: #fff;
}
.BMap_cpyCtrl {
  display: none;
}
.weui-cell_access .weui-cell__ft:after {
  content: "";
  border-style: none;
  right: -10px;
}
.weui-cell_access .weui-cell__ft {
  padding-right: 0;
}
.tmp_table {
  width: 70%;
  text-align: left;
}
.my_icon {
  width: 1.2em;
  height: 1.2em;
}
</style>