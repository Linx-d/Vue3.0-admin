<template>
  <main id="customer" class="frame_center">
    <el-drawer
      title="修改围栏"
      :visible.sync="modifyDrawer"
      :before-close="handleClose"
      :with-header="false"
      class="modifyRailModule"
      size="50%"
    >
      <div id="modifyMap"></div>
      <el-form
        :model="modifyData"
        :rules="rules"
        ref="modifyData"
        label-width="100px"
        class="modify_ruleForm"
      >
        <el-form-item label="围栏名称" prop="railName" class="form-item">
          <el-input v-model="modifyData.railName"></el-input>
        </el-form-item>
        <el-form-item label="围栏地址" prop="railAddr" class="form-item">
          <el-input v-model="modifyData.railAddr" disabled></el-input>
        </el-form-item>
        <el-form-item label="围栏半径" prop="radius" class="form-item">
          <el-input v-model="modifyData.radius" disabled></el-input>
        </el-form-item>
        <el-form-item class="modifyBtn">
          <el-button type="primary" @click="submitForm('modifyData')">修改围栏</el-button>
          <el-button @click="resetForm('modifyData')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <el-drawer
      title="新增围栏"
      :visible.sync="addDrawer"
      :with-header="false"
      class="addRailModule"
      size="50%"
    >
      <div id="addMap"></div>
    </el-drawer>
    <div class="customer_main frame_center_main">
      <div class="chunk_cnt">
        <div class="cnt_top">
          <div class="cnt_top_l">
            <span>围栏名称</span>
            <span>&nbsp;共({{railData.total}})个围栏</span>
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
                  <th>创建时间</th>
                  <th>修改时间</th>
                  <th>半径(m)</th>
                  <th>中心坐标</th>
                  <th>地址</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(rail, index) in railData.data" :key="rail.id">
                  <td :title="rail.railName">{{ rail.railName }}</td>
                  <td :title="rail.personSum">{{ rail.personSum }}</td>
                  <td :title="rail.gmtCreate">{{ rail.gmtCreate }}</td>
                  <td :title="rail.gmtModified">{{ rail.gmtModified }}</td>
                  <td :title="rail.radius">{{ rail.radius }}</td>
                  <td :title="rail.latitude">({{ rail.longitude }},{{ rail.latitude }})</td>
                  <td :title="rail.railAddr">{{ rail.railAddr }}</td>
                  <td class="tdTool">
                    <a href="javascript:;" @click.stop="modifyRailFn(rail, index)">修改</a>
                    <a href="javascript:;" @click.stop="delRailFn(rail.id, index)">删除</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="cnt_tool">
              <a class="memberLink" href="javascript:;" @click="addRailFn">增加围栏</a>
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
          <p>{{ railData.data[currentRailData.index] }}</p>
          <p>{{ listByRailData }}</p>
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
  listUserInfoByRail
} from "@/api/railApi";
import { reactive, ref, onMounted, watchEffect } from "@vue/composition-api";
import { Message } from "element-ui";
import { cloneArray, cloneObject } from "@/utils/common";
import { Map } from "@/map";
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
      index: null
    });
    // 增加围栏 data
    const addRailData = reactive({
      latitude: "29.490295",
      longitude: "106.48665",
      radius: "200",
      railName: "围栏6",
      railAddr: "万寿福居"
    });
    const addRailFn = () => {
      addDrawer.value = true; // 显示新增围栏模块
      addBaiduMap();
      let num = Math.random() * 10;
      num = num.toFixed(1);
      addRailData.railName = `围栏${num}`;
      addRail(addRailData).then(response => {
        let code = response.code;
        if (code === 0) {
          //railData.data.push(addRailData);
          selectRailList(railListPaging);
          Message.success("增加成功");
        } else {
          Message.error(response.msg);
        }
      });
    };
    // 修改围栏
    const modifyData = reactive({
      latitude: "",
      longitude: "",
      radius: "",
      railName: "",
      id: null,
      railAddr: ""
    });
    const modifyRailFn = (data, index) => {
      cloneObject(modifyData, data);
      modifyBaiduMap();
      let id = data.id;
      modifyDrawer.value = true; // 显示修改围栏模块
      currentRailData.index = index; // 当前围栏的索引
      listUserInfoByRail(id).then(res => {
        let data = res.data.list ? res.data.list : res.data;
        // 深拷贝数组
        cloneArray(listByRailData, data);
      });
    };
    const rules = reactive({
      railName: [
        { required: true, message: "请输入围栏名称", trigger: "blur" },
        { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
      ],
      railAddr: [{ required: true }],
      radius: [{ required: true }]
    });
    // 删除围栏
    const delRailFn = (id, index) => {
      let params = {
        id
      };
      deleteRail(params).then(response => {
        let code = response.code;
        if (code === 0) {
          railData.data.splice(index, 1);
          selectRailList(railListPaging);
          Message.success("删除成功");
        } else {
          Message.error(response.msg);
        }
      });
    };

    // 提交
    const submitForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          console.log(modifyData);
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    // 重置
    const resetForm = formName => {
      refs[formName].resetFields();
    };
    // 点击覆盖层触发事件
    const handleClose = done => {
      root
        .$confirm("确认关闭？")
        .then(_ => {
          done();
          resetForm("modifyData");
        })
        .catch(_ => {});
    };
    /**查询所有围栏信息 */
    let railListPaging = reactive({
      pageNum: 1,
      pageSize: 15
    });
    // 围栏信息
    let railData = reactive({
      total: 10,
      lastPage: 2,
      data: [],
      status: true
    });

    /**
     * 函数
     */

    // 查询所有围栏信息 selectRailList
    const selectRailList = railListPaging => {
      listRail(railListPaging).then(response => {
        let data = response.data.list ? response.data.list : response.data;
        let len = data.length;
        railData.status = len != 0 ? true : false; // 有无围栏切换
        railData.total = response.data.total; // 总围栏数
        railData.lastPage = response.data.lastPage; // 最后一页的页码

        railData.data.splice(0, railData.data.length);
        data.forEach(item => {
          railData.data.push(item);
        });
      });
    };
    selectRailList(railListPaging);

    /**当前页变动时候触发的事件 */
    const handleCurrentChange = val => {
      railListPaging.pageNum = val;
      selectRailList(railListPaging);
    };
    const handleSizeChange = val => {
      railListPaging.pageSize = val;
      selectRailList(railListPaging);
    };

    let modifyBaiduMap = () => {
      Map("EG4ercSC4ZmBIhIcBvyoj65q12m2fy00").then(BMap => {
        return BMap;
      }).then((BMap) => {
        /*let map = new BMap.Map("modifyMap"); // 创建Map实例
        let point = new BMap.Point(modifyData.longitude, modifyData.latitude); // 创建点坐标
        let marker = new BMap.Marker(point);
        map.addOverlay(marker); //添加一个标注
        map.centerAndZoom(point, 18); //添加初始化中心点及地图层级
        map.enableScrollWheelZoom(); //开启鼠标滚轮缩放功能。仅对PC上有效
        map.enableContinuousZoom(); //启用连续缩放效果，默认禁用*/

        // 百度地图API功能
        let map = new BMap.Map("modifyMap");
        let poi = new BMap.Point(modifyData.longitude, modifyData.latitude);
        map.centerAndZoom(poi, 16);
        map.enableScrollWheelZoom();
        let overlays = [];
        let overlaycomplete = function(e) {
          overlays.push(e.overlay);
        };
        let styleOptions = {
          strokeColor: "red", //边线颜色。
          fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 3, //边线的宽度，以像素为单位。
          strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
          fillOpacity: 0.6, //填充的透明度，取值范围0 - 1。
          strokeStyle: "solid" //边线的样式，solid或dashed。
        };
        //实例化鼠标绘制工具
        let drawingManager = new BMapLib.DrawingManager(map, {
          isOpen: false, //是否开启绘制模式
          enableDrawingTool: true, //是否显示工具栏
          drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5) //偏离值
          },
          circleOptions: styleOptions, //圆的样式
          polylineOptions: styleOptions, //线的样式
          polygonOptions: styleOptions, //多边形的样式
          rectangleOptions: styleOptions //矩形的样式
        });
        //添加鼠标绘制工具监听事件，用于获取绘制结果
        drawingManager.addEventListener("overlaycomplete", overlaycomplete);
        function clearAll() {
          for (let i = 0; i < overlays.length; i++) {
            map.removeOverlay(overlays[i]);
          }
          overlays.length = 0;
        }
      });
    };

    let addBaiduMap = () => {
      Map("EG4ercSC4ZmBIhIcBvyoj65q12m2fy00").then(BMap => {
        let map = new BMap.Map("addMap"); // 创建Map实例
        let point = new BMap.Point(114.065537, 22.553321); // 创建点坐标
        let marker = new BMap.Marker(point);
        map.addOverlay(marker); //添加一个标注
        map.centerAndZoom(point, 13); //添加初始化中心点及地图层级
        map.enableScrollWheelZoom(); //开启鼠标滚轮缩放功能。仅对PC上有效
        map.enableContinuousZoom(); //启用连续缩放效果，默认禁用
      });
    };

    onMounted(() => {});
    return {
      railData, // 围栏信息
      modifyRailFn, // 修改围栏
      delRailFn, // 删除围栏
      addRailFn, // 增加围栏
      handleCurrentChange, // 当前页变动时候触发的事件
      handleSizeChange, // 每页条数
      railListPaging, // 分页配置
      addDrawer, // 切换新增围栏模块
      modifyDrawer, // 切换修改围栏模块
      modifyData, // 修改围栏信息
      listByRailData, // 指定围栏下的用户信息
      currentRailData, // 当前围栏信息
      rules, // 校验规则
      submitForm, // 提交表单
      resetForm, // 重置表单
      handleClose // 点击覆盖层触发事件
    };
  }
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
  width: 1080px;
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

//* pagingConfig 分页配置
.pagingConfig {
  position: absolute;
  right: 10px;
  top: 20px;
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
</style>