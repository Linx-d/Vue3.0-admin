<template>
  <div class="chunk_cnt">
    <div class="info_title">
      <span>成员详情</span>
    </div>
    <div class="cnt_tool" v-if="showMemberInfo_drawer.status.info">
      <a class="memberLink" href="javascript:;" @click="memberInfoBack(showMemberInfo_drawer)">
        <svg-icon iconClass="double_headed" class="double_headed"></svg-icon>返回
      </a>
      <a class="memberLink" href="javascript:;" @click="modifyMemberInfo">编辑</a>
      <!--
      <a class="memberLink" href="javascript:;">编辑</a>
      <a class="memberLink" href="javascript:;">移除</a>
      -->
    </div>
    <div class="cnt_tool" v-if="showMemberInfo_drawer.status.map">
      <a class="memberLink" href="javascript:;" @click="memberInfoBack(showMemberInfo_drawer)">
        <svg-icon iconClass="double_headed" class="double_headed"></svg-icon>关闭
      </a>
    </div>
    <div class="info_main">
      <div class="info_head">
        <div class="info_head_l">
          <!-- <svg-icon iconClass="info" class="info_svg"></svg-icon> -->
          <el-image
            style="height: 70px; width: 70px;"
            :src="currentMemberInfo.photo"
            fit="cover"
            class="info_svg"
          ></el-image>
          <!-- <img :src="currentMemberInfo.photo" style="height: 70px; width: 70px;" class="info_svg"> -->
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
              <svg-icon iconClass="online1" class="online my_icon online_icon"></svg-icon>在线
            </span>
            <span v-if="!currentMemberInfo.online">
              <svg-icon iconClass="unline" class="unline online_icon"></svg-icon>离线
            </span>
            <div v-if="currentMemberInfo.online">
              <span>
                <svg-icon
                  iconClass="electric0"
                  class="electric my_icon online_icon"
                  v-if="currentMemberInfo.electric==='0'"
                ></svg-icon>
              </span>
              <span>
                <svg-icon
                  iconClass="electric1"
                  class="electric my_icon online_icon"
                  v-if="currentMemberInfo.electric==='1'"
                ></svg-icon>
              </span>
              <span>
                <svg-icon
                  iconClass="electric2"
                  class="electric my_icon online_icon"
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

          <el-tooltip class="item" effect="light" content="最新位置" placement="bottom">
            <p>
              <span>{{ currentMemberInfo.location }}</span>
              <a class="info_position" href="#temperature_box" @click="newPosition">
                <svg-icon iconClass="quick_position" class="quick_position"></svg-icon>
              </a>
            </p>
          </el-tooltip>
        </div>
        <el-tooltip class="item" effect="light" content="最新温度" placement="top">
          <div
            :class="['info_head_main', { normal: currentMemberInfo.temperature<37.3, danger: currentMemberInfo.temperature>=37.3 }]"
          >
            {{ currentMemberInfo.temperature }}
            <span
              v-show="currentMemberInfo.temperature!='暂无数据'"
            >°C</span>
          </div>
        </el-tooltip>
      </div>
      <div id="info_personal" class="info_module">
        <ul>
          <li>
            <span>年龄：</span>
            <i>{{ currentMemberInfo.age }}&nbsp;岁</i>
          </li>
          <li>
            <span>性别：</span>
            <i>{{ currentMemberInfo.sex }}</i>
          </li>
          <li>
            <span>电话：</span>
            <i>{{ currentMemberInfo.tel }}</i>
          </li>
          <li>
            <span>备注：</span>
            <i v-if="currentMemberInfo.remarks!=null">{{ currentMemberInfo.remarks }}</i>
            <i v-else>暂无数据</i>
          </li>
          <li>
            <span>住址：</span>
            <i>{{ currentMemberInfo.address }}</i>
            <a class="info_position" href="#temperature_box" @click="new_address">
              <svg-icon iconClass="address_info" class="quick_position"></svg-icon>
            </a>
          </li>
          <li>
            <span>围栏：</span>
            <i v-if="tmpHistory.railName" class="railText">{{ tmpHistory.railName }}</i>
            <strong v-if="!tmpHistory.railName" class="modifyInfoBtn" @click="addRail">添加</strong>
            <strong v-else class="modifyInfoBtn" @click="unBindOpen">解绑围栏</strong>
          </li>
          <li class="departManagersBoxAll">
            <span>部门：</span>
            <div class="departManagers" v-if="currentMemberInfo.listDepart!=null&&currentMemberInfo.listDepart.length!=0">
              <div
                v-for="depart in currentMemberInfo.listDepart"
                :key="depart.id"
                class="departContent"
              >
                <div class="depart_item item_margin-bottom" :title="depart">
                  <svg-icon iconClass="depart" class="departSvg"></svg-icon>
                  <span>{{ depart }}</span>
                </div>
              </div>
            </div>

            <span v-else>暂无</span>
          </li>
          <li>
            <el-tooltip class="item" effect="light" :content="content.tmp.txt" placement="left">
              <a href="javascript:;" @click="toggleAbnormal">
                <span>体温告警：</span>
                <i>
                  {{ currentMemberInfo.tnumber }}&nbsp;
                  <span
                    v-show="currentMemberInfo.tnumber!='暂无数据'"
                  >次</span>
                </i>
              </a>
            </el-tooltip>
          </li>
          <li>
            <el-tooltip
              class="item"
              effect="light"
              :content="content.position.txt"
              placement="left"
            >
              <a href="javascript:;" @click="positionHandle('position')">
                <span>位置告警：</span>
                <i>
                  {{ currentMemberInfo.pnumber }}&nbsp;
                  <span
                    v-show="currentMemberInfo.pnumber!='暂无数据'"
                  >次</span>
                </i>
              </a>
            </el-tooltip>
          </li>
        </ul>
      </div>
      <div id="temperature_box">
        <div id="info_temperature" class="info_module" v-show="temperature"></div>
        <div id="info_table" v-show="!temperature">
          <el-table
            :data="paging.data"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            height="430"
          >
            <el-table-column
              prop="temperature"
              label="温度"
              width="130"
              show-overflow-tooltip
              sortable
            ></el-table-column>
            <el-table-column prop="address" label="地址" width="340" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="time" label="上传数据时间" width="250" show-overflow-tooltip sortable></el-table-column>
          </el-table>
        </div>
        <el-tooltip class="item" effect="light" :content="content.table.txt" placement="right">
          <div class="table_svg" @click="toggleTable">
            <svg-icon iconClass="table_menu" class="table_menu" v-if="temperature"></svg-icon>
            <svg-icon iconClass="line_chart" class="line_chart" v-else></svg-icon>
          </div>
        </el-tooltip>
        <el-pagination
          background
          @current-change="handleCurrentChange_tmp"
          layout="prev, pager, next"
          :total="paging.total"
          :page-size="paging.pageSize"
          v-if="!temperature"
        ></el-pagination>
      </div>
      <div class="info_module mapBox" v-loading="loading">
        <div id="memberMapShow"></div>
      </div>

      <!-- 围栏列表 -->
      <el-dialog
        title="围栏列表"
        :visible.sync="dialogRailVisible.status"
        class="railTable"
        id="memberRailList"
        :close-on-click-modal="false"
      >
        <el-table :data="railList.data" style="width: 100%" max-height="400">
          <el-table-column
            fixed
            prop="gmtCreate"
            label="日期"
            width="220"
            show-overflow-tooltip
            sortable
          ></el-table-column>
          <el-table-column prop="railName" label="围栏名称" width="120" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="personSum" label="人数" width="120" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="radius" label="半径" width="120" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="railAddr" label="地址" width="300" show-overflow-tooltip sortable></el-table-column>
          <el-table-column fixed="right" label="操作" show-overflow-tooltip width="120">
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

      <!-- 位置异常统计 -->
      <el-dialog
        :title="database.position.title"
        :visible.sync="database.position.visible"
        :close-on-click-modal="false"
        class="position_dialog"
      >
        <el-table
          :data="database.position.show"
          style="width: 100%"
          max-height="500"
          height="500"
          v-loading="database.position.loading"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="userName" label="姓名" width="100" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="temperature" label="体温" width="100" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="tel" label="联系方式" width="150" show-overflow-tooltip sortable></el-table-column>
          <el-table-column prop="address" label="当前所在地址" width="300" show-overflow-tooltip sortable></el-table-column>
          <el-table-column
            prop="gmtCreate"
            label="最新上传数据时间"
            width="250"
            show-overflow-tooltip
            sortable
          ></el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="database.position.pageNum"
            :page-sizes="database.position.pageSizes"
            :page-size="database.position.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="database.position.total"
          ></el-pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { Map } from "@/map"; // 导入map.js文件
import { onMounted, watchEffect, reactive, ref } from "@vue/composition-api";
import { switchModule, cloneArray } from "@/utils/common";
import {
  batchDeleteRailUser,
  listDeviceAlarmInfoByUserId,
  batchUpdateUser,
} from "@/api/contactsApi";
import { listRail } from "@/api/railApi";
import personTravel from "@/views/images/personTravel.png";
import address_location from "@/views/images/address_location.png";
import address_position from "@/views/images/address_position.png";
export default {
  name: "memberList",
  props: {
    currentMemberInfo: {
      type: Object,
      default: () => {},
    },
    contactsModule: {
      type: Object,
      default: () => [],
    },
    tmpHistory: {
      type: Object,
      default: () => {},
    },
    showMemberInfo_drawer: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { root }) {
    /**加载动画
     *
     */
    const loading = ref(true);
    // 分页配置
    const paging = reactive({
      pageNum: 1,
      pageSize: 15,
      data: [],
      total: 0,
    });

    /** 位置异常统计
     *
     */
    const database = reactive({
      position: {
        title: "",
        visible: false,
        loading: true,
        data: [],
        show: [],
        total: 0,
        pageSizes: [15, 20, 30, 40],
        pageNum: 1,
        pageSize: 15,
      },
      positionContent: [],
    });
    const handleSizeChange = (val) => {
      let choose = "",
        position = database.position.visible;
      if (position) {
        choose = "position";
      }
      database[choose].pageSize = val;
      let start = database[choose].pageSize * (database[choose].pageNum - 1);
      let end = database[choose].pageSize * database[choose].pageNum;
      database[choose].show = database[choose].data.slice(start, end);
    };
    const handleCurrentChange = (val) => {
      let choose = "",
        position = database.position.visible;
      if (position) {
        choose = "position";
      }
      database[choose].pageNum = val;
      let start = database[choose].pageSize * (database[choose].pageNum - 1);
      let end = database[choose].pageSize * database[choose].pageNum;
      database[choose].show = database[choose].data.slice(start, end);
    };
    const positionHandle = (val) => {
      return;
      database.position.visible = true;
      database.position.pageNum = 1;
      database.position.pageSize = 15;
      let len = database.position.data.length;
      database.position.data.splice(0, len);
      if (val == "position") {
        database.position.title = "位置异常统计";
        database.positionContent.forEach((item) => {
          //
        });
        database.position.data = database.positionContent;
      }
      database.position.total = database.position.data.length;
      database.position.show = database.position.data.slice(
        0,
        database.position.pageSize
      );
      database.position.loading = false;
    };

    const handleCurrentChange_tmp = (val) => {
      paging.pageNum = val;
      if (abnormal.value) {
        paging.data.splice(0, paging.data.length);
        let start = paging.pageSize * (paging.pageNum - 1);
        let end = paging.pageSize * paging.pageNum;
        paging.data = props.tmpHistory.error_tableData.slice(start, end);
        paging.total = props.tmpHistory.error_tableData.length;
      } else {
        paging.data.splice(0, paging.data.length);
        let start = paging.pageSize * (paging.pageNum - 1);
        let end = paging.pageSize * paging.pageNum;
        paging.data = props.tmpHistory.tableData.slice(start, end);
        paging.total = props.tmpHistory.tableData.length;
      }
    };

    let contactsModule = props.contactsModule; // contacts 模块
    const dialogRailVisible = reactive({
      status: false,
    });
    const content = reactive({
      tmp: {
        txt: "切换异常温度图表",
      },
      position: {
        txt: "显示异常位置图表",
      },
      table: {
        txt: "数据表格",
      },
    });
    /**
     * 查询围栏列表
     */
    let railList = reactive({
      pageNum: 1,
      pageSize: 15,
      value: false,
      data: [],
    });
    const addRail = () => {
      dialogRailVisible.status = true;
      listRail().then((res) => {
        railList.data = res.data.list;
        railList.data.forEach((item) => {
          item.radius = parseInt(item.radius);
        });
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
            ),
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
          },
        })
        .then((action) => {
          let data = {
            railId: railId,
            userId: [props.currentMemberInfo.userId],
          };
          batchUpdateUser(data).then((res) => {
            let code = res.code;
            if (code === 0) {
              root.$message({
                type: "success",
                message: "绑定成功",
              });
              props.tmpHistory.railName = railName;
              dialogRailVisible.status = false;
            } else {
              root.$message({
                type: "error",
                message: "绑定失败",
              });
            }
          });
        })
        .catch(() => {
          root.$message({
            type: "info",
            message: "已取消绑定",
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
            ),
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
          },
        })
        .then((action) => {
          unBindRail();
        })
        .catch(() => {
          root.$message({
            type: "info",
            message: "已取消解绑",
          });
        });
    };

    const unBindRail = () => {
      let userId = [props.currentMemberInfo.userId];
      batchDeleteRailUser(userId).then((res) => {
        let code = res.code;
        if (code === 0) {
          props.tmpHistory.railName = null;
          root.$message({
            type: "success",
            message: "解绑成功",
          });
        } else {
          root.$message({
            type: "error",
            message: "解绑失败",
          });
        }
      });
    };

    /**
     * 切换异常体温显示
     */
    let abnormal = ref(false);
    const toggleAbnormal = () => {
      abnormal.value = !abnormal.value;
      temperature.value = true;
      if (abnormal.value) {
        content.tmp.txt = "切换正常温度图表";
      } else {
        content.tmp.txt = "切换异常温度图表";
      }
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
        let newArr_time, newArr_tmp;
        if (abnormal.value) {
          newArr_time = tmpHistory.error_time;
          newArr_tmp = tmpHistory.error_tmp;
        } else {
          newArr_time = tmpHistory.newArr_time;
          newArr_tmp = tmpHistory.newArr_tmp;
        }
        // 指定图表的配置项和数据
        let option = {
          title: {
            text: "体温变化",
            subtext: "疫情防控",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["最高温度"], //定义曲线具体数据
          },
          toolbox: {
            show: true,
            feature: {},
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: newArr_time,
            axisLabel: {
              rotate: 285,
            },
          },
          grid: {
            bottom: "40%",
          },
          yAxis: {
            type: "value",
            min: 35,
            max: 43,
            interval: 1,
            axisLabel: {
              formatter: "{value}°C", //Y坐标
            },
          },
          dataZoom: [
            {
              type: "inside",
              start: 90,
              end: 100,
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
                shadowOffsetY: 2,
              },
            },
          ],
          visualMap: {
            show: false,
            dimension: 1,
            pieces: [
              {
                gte: 37.3,
                lte: 9999,
                color: "rgb(194, 53, 49)",
              },
            ], //pieces的值由动态数据决定
            outOfRange: {
              color: "green",
            },
          },
          series: [
            {
              name: "",
              type: "line",
              data: newArr_tmp,
              markPoint: {
                data: [
                  { type: "max", name: "最大值" },
                  { type: "min", name: "最小值" },
                ],
              },
              markLine: {
                data: [
                  //{type: 'average', name: '平均值'}设置标线类型
                  { yAxis: 37.3 },
                ],
              },
            },
          ],
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
    // 返回
    const memberInfoBack = (data) => {
      let map = data.status.map;
      let info = data.status.info;
      if (info) {
        switchModule(contactsModule, "memberList");
      } else if (map) {
        data.visible = false;
      }
    };
    // 编辑
    const modifyMemberInfo = () => {
      switchModule(contactsModule, "memberModify");
    };
    const temperature = ref(true);
    const tableData = reactive([]);
    const toggleTable = () => {
      temperature.value = !temperature.value;
      if (abnormal.value) {
        paging.data.splice(0, paging.data.length);
        let start = paging.pageSize * (paging.pageNum - 1);
        let end = paging.pageSize * paging.pageNum;
        paging.data = props.tmpHistory.error_tableData.slice(start, end);
        paging.total = props.tmpHistory.error_tableData.length;
      } else {
        paging.data.splice(0, paging.data.length);
        let start = paging.pageSize * (paging.pageNum - 1);
        let end = paging.pageSize * paging.pageNum;
        paging.data = props.tmpHistory.tableData.slice(start, end);
        paging.total = props.tmpHistory.tableData.length;
      }

      if (temperature.value) {
        content.table.txt = "数据表格";
      } else {
        content.table.txt = "数据趋势图";
      }
    };
    const tableRowClassName = ({ row, rowIndex }) => {
      let temperature = parseFloat(row.temperature);
      if (temperature >= 37.3) {
        return "warning-row";
      }
      return "";
    };
    /**
     * 百度地图方法
     */
    let map = null;
    ((window) => {
      watchEffect(() => {
        // 成员坐标
        let location = {
          lng: props.currentMemberInfo.userLongitude, // 注意经纬度的对应 userLongitude
          lat: props.currentMemberInfo.userLatitude, // 注意经纬度的对应 userLatitude
        };
        // 围栏信息
        let railInfo = {
          lng: props.currentMemberInfo.railLongitude,
          lat: props.currentMemberInfo.railLatitude,
          radius: props.currentMemberInfo.radius,
        };
        Map("ak").then((BMap) => {
          map = new BMap.Map("memberMapShow"); // 创建Map实例
          window.map = map;
          let pointArray = [];
          let point = new BMap.Point(location.lng, location.lat); // 创建点坐标
          map.centerAndZoom(point, 13); // 将个人作为地图中心点
          pointArray.push(point);
          let mIcon = new BMap.Icon(address_location, new BMap.Size(85, 48));
          let marker = new BMap.Marker(point, { icon: mIcon });
          map.addOverlay(marker); //添加一个标注
          map.enableScrollWheelZoom(); //开启鼠标滚轮缩放功能。仅对PC上有效
          map.enableContinuousZoom(); //启用连续缩放效果，默认禁用

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
          let circle = new BMap.Circle(railPoint, railInfo.radius, {
            strokeColor: "blue",
            strokeWeight: 1,
            strokeOpacity: 0.01,
            fillColor: "#53aeff",
            fillOpacity: 0.4,
          });
          map.addOverlay(circle);
        });
      });
    })(window);
    const newPosition = () => {
      let lng = props.currentMemberInfo.userLongitude;
      let lat = props.currentMemberInfo.userLatitude;
      map.centerAndZoom(new BMap.Point(lng, lat), 19);
    };
    const new_address = () => {
      let lng = props.currentMemberInfo.addressLongitude,
        lat = props.currentMemberInfo.addressLatitude;
      let point = new BMap.Point(lng, lat);
      let myIcon = new BMap.Icon(address_position, new BMap.Size(48, 48)); //address_location, address_position
      map.addOverlay(new BMap.Marker(point, { icon: myIcon }));
      map.centerAndZoom(point, 19);
    };
    onMounted(() => {
      memberInfoEcharts();
      loading.value = false;
    });
    watchEffect(() => {
      if (props.contactsModule.memberInfo) {
        // if (!temperature) {
        // 温度异常逆解析地址
        let tmp_len = props.tmpHistory.newArr_position.length;
        if (tmp_len != 0) {
          props.tmpHistory.newArr_position.forEach((item, index) => {
            // 地址逆解析
            let lng = item.lng,
              lat = item.lat;
            let pt = new BMap.Point(lng, lat);
            let geoc = new BMap.Geocoder();
            geoc.getLocation(pt, function (rs) {
              if (rs.addressComponents != null) {
                let addComp = rs.addressComponents;
                if (props.tmpHistory.error_tableData[index] != undefined) {
                  // 异常
                  props.tmpHistory.error_tableData[index].address =
                    addComp.province +
                    addComp.city +
                    addComp.district +
                    addComp.street +
                    addComp.streetNumber;
                }

                if (props.tmpHistory.tableData[index] != undefined) {
                  // 正常
                  props.tmpHistory.tableData[index].address =
                    addComp.province +
                    addComp.city +
                    addComp.district +
                    addComp.street +
                    addComp.streetNumber;
                }
              }
            });
          });
        }
        // }

        // 位置异常逆解析地址 database.position.visible temperature
        if (database.position.visible) {
          let position_len = props.tmpHistory.data.length;
          if (position_len != 0) {
            props.tmpHistory.data.forEach((item) => {
              database.positionContent.push(item);
            });
          }
        }
      }

      // 切换个人信息温度表格
      if (!contactsModule.memberInfo) {
        temperature.value = true; // 显示趋势图
        abnormal.value = false;
      }
    });
    return {
      loading,
      paging,
      database,
      handleCurrentChange,
      handleCurrentChange_tmp,
      handleSizeChange,
      positionHandle,
      memberInfoBack,
      modifyMemberInfo,
      bindOpen,
      unBindOpen,
      addRail,
      selectRow,
      railList,
      dialogRailVisible,
      unBindRail,
      temperature,
      toggleTable,
      tableData,
      tableRowClassName,
      toggleAbnormal,
      content,
      newPosition,
      new_address,
    };
  },
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
    position: relative;
    @include webkit("box-sizing", border-box);
    .info_head_l {
      float: left;
      .info_svg {
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
        .online_icon {
          vertical-align: middle;
          margin-right: 5px;
        }
        span:first-child {
          color: #787878;
          margin-right: 5px;
        }
        span:last-child {
          color: #787878;
        }
        margin-bottom: 10px;
      }
    }
    .info_head_main {
      position: absolute;
      right: 150px;
      top: 35px;
      font-size: 42px;
    }
    .danger {
      color: #bf4739;
    }
    .normal {
      color: green;
    }
  }
  .info_module {
    padding: 35px 25px 25px 25px;
    border-top: 1px dashed #e4e6e9;
    @include webkit("box-sizing", border-box);
    .departManagersBoxAll {
      overflow: auto;
      line-height: 32px;
      margin-bottom: 0 !important;
      .departManagers {
        width: 92%;
        float: right;
        .depart_item {
          margin-right: 15px;
        }
      }
    }
  }

  .info_position {
    position: relative;
    .quick_position {
      width: 1.9em;
      height: 1.9em;
      position: absolute;
      top: -3px;
      left: 3px;
      cursor: pointer;
    }
  }
  #info_personal {
    ul {
      li {
        font-size: 14px;
        a {
          color: #000;
        }
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
  #temperature_box {
    position: relative;
    #info_temperature {
      height: 500px;
    }
    #info_table {
      height: 500px;
      padding: 35px 25px 25px 25px;
      border-top: 1px dashed #e4e6e9;
      @include webkit("box-sizing", border-box);
    }
    .table_svg {
      position: absolute;
      right: 100px;
      top: 50px;
      cursor: pointer;
    }
  }
  .mapBox {
    padding-top: 0;
    border-top: none;
  }
  #memberMapShow {
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