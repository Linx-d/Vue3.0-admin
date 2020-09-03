<template>
  <main id="customer" class="frame_center">
    <el-drawer
      title="修改围栏"
      :visible.sync="modifyDrawer"
      :before-close="modifyHandleClose"
      :with-header="false"
      class="modifyRailModule"
      size="50%"
    >
      <div id="modifyMap"></div>

      <div id="r-result">
        <input type="text" id="suggestId" size="20" placeholder="请输入地址" style="width:150px;" />
      </div>
      <div
        id="searchResultPanel"
        style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"
      ></div>
      <el-form
        :model="modifyRailData"
        :rules="rules"
        ref="modifyRailData"
        label-width="100px"
        class="modify_ruleForm"
        style="margin-top: -52px;"
      >
        <el-form-item label="围栏地址" prop="railAddr" class="form-item" style="opacity: 0;">
          <el-input v-model="modifyRailData.railAddr"></el-input>
        </el-form-item>
        <el-form-item label="围栏名称" prop="railName" class="form-item">
          <el-input v-model="modifyRailData.railName"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="railAddr" class="form-item">
          <el-input v-model="modifyRailData.railAddr"></el-input>
        </el-form-item>
        <el-form-item label="围栏半径" prop="radius" class="form-item">
          <p>{{ modifyRailData.radius }}&nbsp;m</p>
        </el-form-item>
        <el-form-item class="railBtn">
          <el-button type="primary" @click="modifySubmitForm('modifyRailData')">修改围栏</el-button>
          <el-button @click="closeModifyDrawer">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-drawer
      title="新增围栏"
      :visible.sync="addDrawer"
      :before-close="addHandleClose"
      :with-header="false"
      class="addRailModule"
      size="50%"
    >
      <div id="addMap"></div>
      <el-form
        :model="addRailData"
        :rules="rules"
        ref="addRailData"
        label-width="100px"
        class="modify_ruleForm"
        style="margin-top: -52px;"
      >
        <el-form-item label="围栏地址" prop="railAddr" class="form-item" style="opacity: 0;">
          <el-input v-model="addRailData.railAddr"></el-input>
        </el-form-item>
        <el-form-item label="围栏名称" prop="railName" class="form-item">
          <el-input v-model="addRailData.railName"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="railAddr" class="form-item">
          <el-input v-model="addRailData.railAddr"></el-input>
        </el-form-item>
        <el-form-item label="围栏半径" prop="radius" class="form-item">
          <el-input v-model="addRailData.radius" disabled></el-input>
        </el-form-item>
        <el-form-item class="railBtn">
          <el-button type="primary" @click="addSubmitForm('addRailData')">增加围栏</el-button>
          <el-button @click="closeAddDrawer">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <div class="customer_main frame_center_main" v-loading="loading">
      <div class="chunk_cnt">
        <div class="cnt_top">
          <div class="cnt_top_l">
            <span>围栏名称</span>
            <span>&nbsp;共({{railData.total}})个围栏</span>
          </div>

          <div class="cnt_top_r">
            <a href="javascript:;"></a>
            <!--<span class="frame_operation_separator" v-if="currentDepart.id!==currentDepart.topId">|</span>-->
          </div>
        </div>
        <div class="cnt_bottom">
          <div class="has_depart" v-show="railData.status">
            <div class="cnt_tool">
              <a class="memberLink" href="javascript:;" @click="addRailFn">增加围栏</a>
            </div>
            <table class="memberTable mm_tabel">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>人数</th>
                  <th>温度异常人数</th>
                  <th>创建时间</th>
                  <th>修改时间</th>
                  <th>半径(m)</th>
                  <th>地址</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(rail, index) in railData.data"
                  :key="rail.id"
                  @click.stop="modifyRailFn(rail, index)"
                >
                  <td :title="rail.railName">{{ rail.railName }}</td>
                  <td :title="rail.personSum">{{ rail.personSum }}</td>
                  <td :title="rail.personSum" class="railTemperatrue">{{ rail.abnormalPerson }}</td>
                  <td :title="rail.gmtCreate">{{ rail.gmtCreate }}</td>
                  <td :title="rail.gmtModified">{{ rail.gmtModified }}</td>
                  <td :title="rail.radius">{{ rail.radius }}</td>
                  <td :title="rail.railAddr" class="railAddress">{{ rail.railAddr }}</td>
                  <td class="tdTool">
                    <a href="javascript:;" @click.stop="modifyRailFn(rail, index)">查看</a>
                    <a href="javascript:;" @click.stop="delRailFn(rail, index)">删除</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="cnt_tool">
              <a class="memberLink" href="javascript:;" @click="addRailFn">增加围栏</a>
            </div>
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="[15, 20, 30, 40]"
                :page-size="railListPaging.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="railData.total"
                class="pagingConfig"
              ></el-pagination>
            </div>
          </div>
          <div class="no_depart" v-show="!railData.status">
            <div class="no_depart_top">
              <svg-icon iconClass="rail" class="rail"></svg-icon>
              <p>暂无围栏</p>
            </div>
            <div class="no_depart_bottom">
              <a class="memberLink" @click="addRailFn">增加围栏</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {
  listRail,
  addRail,
  deleteRail,
  listUserInfoByRail,
  queryRailByName,
  updateRail,
} from "@/api/railApi";
import { reactive, ref, onMounted, watchEffect } from "@vue/composition-api";
import { Message } from "element-ui";
import { cloneArray, cloneObject } from "@/utils/common";
import { Map } from "@/map";
import onLineIcon from "./images/marker_online.png";
import unLineIcon from "./images/marker_unline.png";
import dangerIcon from "./images/marker_danger.png";
import pointAggre from "@/views/images/pointAggre.png"; // 点聚合
import railPosition from "@/views/images/railPosition.png"; // 围栏标注
import railPositionIcon from "@/views/images/railPositionIcon.png"; // 围栏标注
export default {
  name: "rail",
  setup(props, { root, refs }) {
    /**
     * data
     */
    const modifyDrawer = ref(false); // 切换修改围栏模块
    const addDrawer = ref(false); // 切换新增围栏模块
    // 指定围栏下的用户信息
    let listByRailData = reactive([]);
    // 当前围栏信息
    let currentRailData = reactive({
      index: null,
    });
    // 增加围栏 data
    let addRailData = reactive({
      latitude: "",
      longitude: "",
      radius: null,
      railName: "",
      railAddr: "",
    });
    const addRailFn = () => {
      railText = {
        latitude: "",
        longitude: "",
        radius: null,
        railName: "",
        railAddr: "",
      };
      addDrawer.value = true; // 显示新增围栏模块
      addBaiduMap();
    };
    // 修改围栏
    const modifyRailData = reactive({
      latitude: "",
      longitude: "",
      radius: null,
      railName: "",
      id: null,
      railAddr: "",
    });
    const modifyRailFn = (data, index) => {
      cloneObject(modifyRailData, data);
      cloneObject(railText, modifyRailData); // 判断是否有输入
      let id = data.id;
      modifyDrawer.value = true; // 显示修改围栏模块
      currentRailData.index = index; // 当前围栏的索引
      listUserInfoByRail(id)
        .then((res) => {
          let data = res.data.list ? res.data.list : res.data;
          // 深拷贝数组
          cloneArray(listByRailData, data);
          return res;
        })
        .then((res) => {
          modifyBaiduMap();
        });
    };
    const rules = reactive({
      railName: [
        { required: true, message: "请输入围栏名称", trigger: "blur" },
        { min: 3, max: 7, message: "长度在 3 到 7 个字符" },
      ],
      railAddr: [
        { required: true, message: "请设置围栏地址" },
        { min: 1, max: 50, message: "长度在 1 到 50 个字符" },
      ],
      radius: [{ required: true, message: "请在地图中选取设置围栏半径" }],
    });
    // 删除围栏
    const delData = reactive({
      latitude: "",
      longitude: "",
      radius: 0,
      railName: "",
      id: null,
    });
    const delRailFn = (data, index) => {
      cloneObject(delData, data);
      delOpen(index);
    };

    // 修改围栏提交
    const modifySubmitForm = (formName) => {
      refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          modifyOpen();
          return true;
        }
      });
    };
    // 增加围栏提交
    const addSubmitForm = (formName) => {
      refs[formName].validate((valid) => {
        if (!valid) {
          return false;
        } else {
          addOpen();
          return true;
        }
      });
    };
    // 重置
    const resetForm = (formName) => {
      refs[formName].resetFields();
    };
    // 修改围栏点击覆盖层触发事件
    let railText = reactive({
      latitude: "",
      longitude: "",
      radius: null,
      railName: "",
      id: null,
      railAddr: "",
    });
    const modifyHandleClose = (done) => {
      let status = true;
      for (let key in railText) {
        if (railText[key] != modifyRailData[key]) {
          status = false;
        }
      }
      if (status) {
        done();
        resetForm("modifyRailData");
      } else {
        root
          .$confirm("您已修改围栏信息,是否关闭窗口？")
          .then((_) => {
            done();
            resetForm("modifyRailData");
          })
          .catch((_) => {});
      }
    };
    // 增加围栏点击覆盖层触发事件
    const addHandleClose = (done) => {
      let status = true;
      for (let key in railText) {
        if (railText[key] != addRailData[key]) {
          status = false;
        }
      }
      if (status) {
        done();
        resetForm("addRailData");
      } else {
        root
          .$confirm("您已编辑围栏信息,是否关闭窗口？")
          .then((_) => {
            done();
            resetForm("addRailData");
          })
          .catch((_) => {});
      }
    };
    /**查询所有围栏信息 */
    let railListPaging = reactive({
      pageNum: 1,
      pageSize: 15,
    });
    // 围栏信息
    let railData = reactive({
      total: 10,
      lastPage: 2,
      data: [],
      status: true,
    });

    /**
     * 函数
     */

    // 查询所有围栏信息 selectRailList
    const selectRailList = (railListPaging) => {
      listRail(railListPaging).then((res) => {
        let data = res.data.list ? res.data.list : res.data;
        let size = res.data.size,
          hasPreviousPage = res.data.hasPreviousPage;
        let verify = res.data.total != 0 ? true : false;
        if (size === 0) {
          if (hasPreviousPage) {
            railListPaging.pageNum--;
            selectRailList(railListPaging);
          } else {
            railData.status = verify; // 有无围栏切换
          }
        } else {
          railData.status = verify; // 有无围栏切换
        }
        railData.total = res.data.total; // 总围栏数
        railData.lastPage = res.data.lastPage; // 最后一页的页码

        railData.data.splice(0, railData.data.length);
        data.forEach((item) => {
          listUserInfoByRail(item.id)
            .then((res) => {
              let abnormalPerson = 0;
              let data = res.data;
              data.forEach((item) => {
                let temperature = parseFloat(item.temperature);
                if (temperature > 37.3) {
                  abnormalPerson++;
                }
              });
              item.abnormalPerson = abnormalPerson;
              return item;
            })
            .then((data) => {
              railData.data.push(item);
              loading.value = false;
            });
        });
      });
    };
    selectRailList(railListPaging);

    /**当前页变动时候触发的事件 */
    const handleCurrentChange = (val) => {
      railListPaging.pageNum = val;
      selectRailList(railListPaging);
    };
    const handleSizeChange = (val) => {
      railListPaging.pageSize = val;
      selectRailList(railListPaging);
    };
    let modifyBaiduMap = () => {
      Map("EG4ercSC4ZmBIhIcBvyoj65q12m2fy00").then((BMap) => {
        // 百度地图API功能
        function G(id) {
          return document.getElementById(id);
        }
        let map = new BMap.Map("modifyMap");
        let point = new BMap.Point(
          modifyRailData.longitude,
          modifyRailData.latitude
        );

        let geoc = new BMap.Geocoder();
        let overlays = []; // 围栏
        let markers = []; // 点聚合
        map.centerAndZoom(point, 16);
        map.enableScrollWheelZoom();

        /**输入提示
         *
         */
        let ac = new BMap.Autocomplete({ input: "suggestId", location: map }); //建立一个自动完成的对象

        ac.addEventListener("onhighlight", function (e) {
          //鼠标放在下拉列表上的事件
          let str = "";
          let _value = e.fromitem.value;
          let value = "";
          if (e.fromitem.index > -1) {
            value =
              _value.province +
              _value.city +
              _value.district +
              _value.street +
              _value.business;
          }
          str =
            "FromItem<br />index = " +
            e.fromitem.index +
            "<br />value = " +
            value;

          value = "";
          if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value =
              _value.province +
              _value.city +
              _value.district +
              _value.street +
              _value.business;
          }
          str +=
            "<br />ToItem<br />index = " +
            e.toitem.index +
            "<br />value = " +
            value;
          G("searchResultPanel").innerHTML = str;
        });

        let myValue;
        ac.addEventListener("onconfirm", function (e) {
          //鼠标点击下拉列表后的事件
          let _value = e.item.value;
          myValue =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
          G("searchResultPanel").innerHTML =
            "onconfirm<br />index = " +
            e.item.index +
            "<br />myValue = " +
            myValue;

          setPlace();
        });

        function setPlace() {
          function myFun() {
            let pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
            let myIcon = new BMap.Icon(railPositionIcon, new BMap.Size(85, 48));
            let marker = new BMap.Marker(pp, { icon: myIcon });
            overlays.push(marker);
            map.centerAndZoom(pp, 18);
            map.addOverlay(marker); // 添加标注
          }
          let local = new BMap.LocalSearch(map, {
            //智能搜索
            onSearchComplete: myFun,
          });
          local.search(myValue);
        }

        /**围栏标注
         *
         */
        let railIcon = new BMap.Icon(railPosition, new BMap.Size(48, 48));
        let railMarker = new BMap.Marker(point, { icon: railIcon });
        let content = "围栏名称：" + modifyRailData.railName;
        map.addOverlay(railMarker);
        overlays.push(railMarker);
        addClickHandler(content, railMarker);

        /**点聚合
         *
         */
        // 窗口配置
        let opts = {
          width: 250,
          height: 80,
          title: "信息",
          enableMessage: true, //设置允许信息窗发送短息
        };
        // 状态统计
        let status = {
          personStatic: listByRailData.length,
          eletricStatic: 0,
          temperatureStatic: 0,
          onlineStatic: 0,
        };
        listByRailData.forEach((item) => {
          let gmtTime =
            new Date().getTime() - new Date(item.gmtCreate).getTime();
          let deviceOline = false;
          if (gmtTime < 300001) {
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
          let content = "姓名：" + item.userName;
          map.addOverlay(marker);
          addClickHandler(content, marker);
          markers.push(marker);
        });
        function addClickHandler(content, marker) {
          marker.addEventListener("click", function (e) {
            openInfo(content, e);
          });
        }
        function openInfo(content, e) {
          let p = e.target;
          let point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
          let infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
          map.openInfoWindow(infoWindow, point); //开启信息窗口
        }
        //map.setViewport(markers);
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

        let radius = modifyRailData.radius || 100;
        let circle = new BMap.Circle(point, radius, {
          strokeColor: "blue",
          strokeWeight: 1,
          strokeOpacity: 0.01,
          fillColor: "#53aeff",
          fillOpacity: 0.4,
        });
        map.addOverlay(circle);
        overlays.push(circle);
        let overlaycomplete = function (e) {
          clearAll();
          let point = e.overlay.point;
          /**围栏标注
           *
           */
          let railIcon = new BMap.Icon(railPosition, new BMap.Size(48, 48));
          let railMarker = new BMap.Marker(point, { icon: railIcon });
          let content = "围栏名称：" + modifyRailData.railName;
          map.addOverlay(railMarker);
          overlays.push(railMarker);
          addClickHandler(content, railMarker);
          let radius = parseInt(e.overlay.Da),
            longitude = e.overlay.point.lng,
            latitude = e.overlay.point.lat;
          modifyRailData.radius = radius;
          modifyRailData.longitude = longitude;
          modifyRailData.latitude = latitude;
          geoc.getLocation(point, function (rs) {
            let addComp = rs.addressComponents;
            modifyRailData.railAddr =
              addComp.province +
              addComp.city +
              addComp.district +
              addComp.street +
              addComp.streetNumber;
          });
          overlays.push(e.overlay);
        };
        let styleOptions = {
          strokeColor: "blue", //边线颜色。
          fillColor: "#53aeff", //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 1, //边线的宽度，以像素为单位。
          strokeOpacity: 0.01, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.4, //填充的透明度，取值范围0 - 1。
          //strokeStyle: "solid" //边线的样式，solid或dashed。
        };
        //实例化鼠标绘制工具
        let drawingManager = new BMapLib.DrawingManager(map, {
          isOpen: false, //是否开启绘制模式
          enableDrawingTool: true, //是否显示工具栏
          drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            drawingModes: [BMAP_DRAWING_CIRCLE],
          },
          circleOptions: styleOptions, //圆的样式
          polylineOptions: styleOptions, //线的样式
          polygonOptions: styleOptions, //多边形的样式
          rectangleOptions: styleOptions, //矩形的样式
        });
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener("overlaycomplete", overlaycomplete);
        const clearAll = () => {
          for (let i = 0; i < overlays.length; i++) {
            map.removeOverlay(overlays[i]);
          }
          overlays.length = 0;
        };
        console.log(document.getElementsByClassName("BMapLib_circle"),'modify title');
        
        document.getElementsByClassName("BMapLib_circle").forEach(item => {
          item.title = "绘制围栏";
        });
      });
    };

    let addBaiduMap = () => {
      Map("EG4ercSC4ZmBIhIcBvyoj65q12m2fy00").then((BMap) => {
        // 百度地图API功能
        let map = new BMap.Map("addMap");
        let point = new BMap.Point(106.520406, 29.825615);
        let geoc = new BMap.Geocoder();
        let overlays = []; // 围栏
        map.centerAndZoom(point, 16);
        map.enableScrollWheelZoom();
        let overlaycomplete = function (e) {
          clearAll();
          let point = e.overlay.point;
          /**围栏标注
           *
           */
          let railIcon = new BMap.Icon(railPosition, new BMap.Size(48, 48));
          let railMarker = new BMap.Marker(point, { icon: railIcon });
          map.addOverlay(railMarker);
          overlays.push(railMarker);
          let radius = parseInt(e.overlay.Da);
          addRailData.radius = radius;
          addRailData.longitude = point.lng;
          addRailData.latitude = point.lat;
          geoc.getLocation(point, function (rs) {
            let addComp = rs.addressComponents;
            addRailData.railAddr =
              addComp.province +
              addComp.city +
              addComp.district +
              addComp.street +
              addComp.streetNumber;
          });
          overlays.push(e.overlay);
        };
        let styleOptions = {
          strokeColor: "blue", //边线颜色。
          fillColor: "#53aeff", //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 1, //边线的宽度，以像素为单位。
          strokeOpacity: 0.01, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.4, //填充的透明度，取值范围0 - 1。
          //strokeStyle: "solid" //边线的样式，solid或dashed。
        };
        //实例化鼠标绘制工具
        let drawingManager = new BMapLib.DrawingManager(map, {
          isOpen: false, //是否开启绘制模式
          enableDrawingTool: true, //是否显示工具栏
          drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            drawingModes: [BMAP_DRAWING_CIRCLE],
          },
          circleOptions: styleOptions, //圆的样式
          polylineOptions: styleOptions, //线的样式
          polygonOptions: styleOptions, //多边形的样式
          rectangleOptions: styleOptions, //矩形的样式
        });
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener("overlaycomplete", overlaycomplete);
        const clearAll = () => {
          for (let i = 0; i < overlays.length; i++) {
            map.removeOverlay(overlays[i]);
          }
          overlays.length = 0;
        };
        document.getElementsByClassName("BMapLib_circle").forEach(item => {
          item.title = "绘制围栏";
        });
      });
    };

    /**
     * 弹出框
     */
    // 修改围栏确认框
    const modifyOpen = () => {
      const h = root.$createElement;
      root
        .$msgbox({
          title: "修改围栏",
          message: h("p", null, [
            h("span", null, "修改围栏信息"),
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
          updateRail(modifyRailData).then((res) => {
            let code = res.code;
            if (code === 0) {
              selectRailList(railListPaging);
              root.$message({
                type: "success",
                message: "修改成功",
              });
            } else {
              root.$message({
                type: "error",
                message: res.msg,
              });
            }
          });
        })
        .catch(() => {
          root.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    };

    // 删除围栏确认框
    const delOpen = (index) => {
      const h = root.$createElement;
      root
        .$msgbox({
          title: "删除围栏",
          message: h("p", null, [
            h("span", null, `删除"${delData.railName}"围栏信息`),
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
          deleteRail(delData).then((res) => {
            let code = res.code;
            if (code === 0) {
              root.$message({
                type: "success",
                message: "删除成功",
              });
              railData.data.splice(index, 1);
              selectRailList(railListPaging);
            } else {
              root.$message({
                type: "error",
                message: res.msg,
              });
            }
          });
        })
        .catch(() => {
          root.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    };

    // 增加围栏确认框
    const addOpen = (index) => {
      const h = root.$createElement;
      root
        .$msgbox({
          title: "增加围栏",
          message: h("p", null, [
            h("span", null, `增加"${addRailData.railName}"围栏信息`),
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
          addRail(addRailData).then((res) => {
            let code = res.code;
            if (code === 0) {
              selectRailList(railListPaging);
              root.$message({
                type: "success",
                message: "增加成功",
              });
            } else {
              root.$message({
                type: "error",
                message: res.msg,
              });
            }
          });
        })
        .catch(() => {
          root.$message({
            type: "info",
            message: "已取消增加",
          });
        });
    };
    const closeModifyDrawer = () => {
      resetForm("modifyRailData");
      modifyDrawer.value = false;
    };
    const closeAddDrawer = () => {
      resetForm("addRailData");
      addDrawer.value = false;
    };
    const loading = ref(true);
    const addressInput = ref("");
    onMounted(() => {});
    return {
      railData, // 围栏信息
      modifyRailFn, // 修改围栏
      addRailData,
      delRailFn, // 删除围栏
      addRailFn, // 增加围栏
      handleCurrentChange, // 当前页变动时候触发的事件
      handleSizeChange, // 每页条数
      railListPaging, // 分页配置
      addDrawer, // 切换新增围栏模块
      modifyDrawer, // 切换修改围栏模块
      modifyRailData, // 修改围栏信息
      listByRailData, // 指定围栏下的用户信息
      currentRailData, // 当前围栏信息
      rules, // 校验规则
      modifySubmitForm, // 提交表单
      addSubmitForm,
      resetForm, // 重置表单
      modifyHandleClose, // 修改围栏点击覆盖层触发事件
      addHandleClose, // 增加围栏点击覆盖层触发事件
      modifyOpen,
      closeModifyDrawer,
      closeAddDrawer,
      loading,
      addressInput,
    };
  },
};
</script>

<style lang="scss" scoped>
$customerHeight: 648px;
.customer_main {
}
.modifyRailModule {
  .el-drawer__container {
    .el-drawer {
      width: 50%;
    }
  }
}
.chunk_title {
  height: $customerHeight;
}
.chunk_cnt {
  height: $customerHeight;
  padding-bottom: 45px !important;
  position: relative;
  .cnt_top {
    font-weight: 700;
    overflow: hidden;
    padding-bottom: 10px;
    line-height: 28px;
    border-bottom: 1px solid #e4e6e9;
    .cnt_top_l {
      font-size: 18px;
      float: left;
      color: #000;
      span:last-child {
        font-size: 14px;
        color: #787878;
      }
    }
    .cnt_top_r {
      font-size: 14px;
      span {
        color: #0c4c7f;
      }
      a {
        color: #0c4c7f;
      }
      float: right;
    }
  }
  .cnt_bottom {
    .has_depart {
      .cnt_tool {
        height: 38px;
        width: 100%;
        background: #dfe9f5;
        padding: 6px 10px;
        border-bottom: 1px solid #bdc9d6;
        box-sizing: border-box;
      }
      .memberTable {
        width: 100%;
        text-align: left;
        tbody {
          input {
            cursor: pointer;
          }
          tr:hover {
            background: #f5f5f5;
          }
          tr:hover .tdTool {
          }
          .tdTool {
            a {
              text-decoration: underline;
              margin-right: 5px;
              color: #466b96;
            }
          }
          .tdTool {
            a:hover {
              color: $tabNav_color;
            }
          }
        }
      }
    }
    .no_depart {
      .no_depart_top {
        padding-top: 150px;
        text-align: center;
        .svg-icon {
          width: 100px;
          height: 100px;
        }
        p {
          font-size: 14px;
          margin-top: 20px;
          color: #787878;
        }
      }
      .no_depart_bottom {
        text-align: center;
        margin-top: 20px;
      }
    }
  }
}

/**Icon menu_right */
.tdmenu_right {
  color: #0c4c7f;
}
.rail {
  color: #ddd;
}
.mm_tabel th {
  padding-top: 4px;
}
.mm_tabel th:last-child:before {
  width: 1px;
}

#addMap {
  height: 70%;
  width: 100%;
}
#modifyMap {
  height: 70%;
  width: 100%;
}
// modify form表单

// 围栏地址宽度限制
.railAddress {
  width: 220px;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.railTemperatrue {
  text-align: center;
}

// 地图输入提示
#r-result {
  width: 200px;
  position: absolute;
  left: 40px;
  top: 18px;
  input {
    width: 200px !important;
    height: 25px;
    border-radius: 3px;
    padding: 5px 14px;
  }
}
</style>