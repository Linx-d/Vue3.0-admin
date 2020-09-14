<template>
  <div class="chunk_cnt">
    <div class="cnt_top">
      <div class="cnt_top_l">
        <span>{{ currentDepart.label }}</span>
        <!-- <span>({{ memberData.total }}人)</span> -->
      </div>
      <div class="cnt_top_r">
        <a href="javascript:;"></a>
        <!--<span class="frame_operation_separator" v-if="currentDepart.id!==currentDepart.topId">|</span>-->
      </div>
    </div>
    <div class="cnt_bottom">
      <div class="has_member" v-show="changeModule.status">
        <div class="cnt_tool">
          <a class="memberLink" href="javascript:;" @click="addMemberBtn" v-if="memberListPaging.id!=-1">添加成员</a>
          <a class="memberLink" href="javascript:;" @click="delMemberBtn" v-if="memberListPaging.id!=-1">移除成员</a>
          <!-- <a
            class="memberLink"
            href="javascript:;"
            @click="screenAbnormal(currentDepart.id, 'abnormal')"
          >{{ screen.content.abnormal }}</a>
          <a
            class="memberLink"
            href="javascript:;"
            @click="screenAbnormal(currentDepart.id, 'normal')"
          >{{ screen.content.normal }}</a>-->
        </div>

        <el-table
          v-if="!screen.visible"
          ref="multipleTable_remove"
          :data="memberData.data"
          :row-class-name="tableRowClassName"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange_remove"
          :row-style="{'font-size': '13px','height': '37px', 'font-family': 'Microsoft YaHei'}"
          :header-row-style="{'font-size': '13px', 'padding': 0, 'font-family': 'Microsoft YaHei'}"
          :cell-style="{'padding': 0, 'font-family': 'Microsoft YaHei'}"
        >
          <el-table-column type="selection" width="45" v-if="memberListPaging.id!=-1"></el-table-column>
          <el-table-column prop="name" label="姓名" sortable show-overflow-tooltip width="80"></el-table-column>
          <el-table-column prop="sex" label="性别" sortable show-overflow-tooltip width="70"></el-table-column>
          <el-table-column prop="age" label="年龄" sortable show-overflow-tooltip width="70"></el-table-column>
          <el-table-column prop="temperature" label="温度" sortable show-overflow-tooltip width="70"></el-table-column>
          <el-table-column prop="tel" label="电话" sortable show-overflow-tooltip width="110"></el-table-column>
          <el-table-column prop="address" label="住址" sortable show-overflow-tooltip width="170" v-if="memberListPaging.id!=-1"></el-table-column>
          <el-table-column prop="address" label="住址" sortable show-overflow-tooltip width="205" v-else></el-table-column>
          <el-table-column prop="status" label="状态" sortable show-overflow-tooltip width="75"></el-table-column>
          <el-table-column label="操作" show-overflow-tooltip width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="compileTool(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="delMember(scope.row.userId,scope.row)" v-if="memberListPaging.id!=-1">移除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          v-if="screen.visible"
          ref="multipleTable_remove"
          :data="screen.show"
          :row-class-name="tableRowClassName"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange_remove"
          :row-style="{'font-size': '13px','height': '37px', 'font-family': 'Microsoft YaHei'}"
          :header-row-style="{'font-size': '13px', 'padding': 0, 'font-family': 'Microsoft YaHei'}"
          :cell-style="{'padding': 0, 'font-family': 'Microsoft YaHei'}"
        >
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="name" label="姓名" sortable show-overflow-tooltip width="80"></el-table-column>
          <el-table-column prop="sex" label="性别" sortable show-overflow-tooltip width="70"></el-table-column>
          <el-table-column prop="age" label="年龄" sortable show-overflow-tooltip width="70"></el-table-column>
          <el-table-column prop="temperature" label="温度" sortable show-overflow-tooltip width="70"></el-table-column>
          <el-table-column prop="tel" label="电话" sortable show-overflow-tooltip width="110"></el-table-column>
          <el-table-column prop="address" label="住址" sortable show-overflow-tooltip width="170"></el-table-column>
          <el-table-column prop="status" label="状态" sortable show-overflow-tooltip width="75"></el-table-column>
          <el-table-column label="操作" show-overflow-tooltip width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="compileTool(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="delMember(scope.row.userId,scope.row)" v-if="memberListPaging.id!=-1">移除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="cnt_tool">
          <a class="memberLink" href="javascript:;" @click="addMemberBtn" v-if="memberListPaging.id!=-1">添加成员</a>
          <a class="memberLink" href="javascript:;" @click="delMemberBtn" v-if="memberListPaging.id!=-1">移除成员</a>
        </div>
        <div class="block" v-show="changeModule.status">
          <!-- 普通 -->
          <el-pagination
            v-if="!screen.visible"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[15, 20, 30, 40]"
            :page-size="memberListPaging.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="memberData.total"
            class="pagingConfig"
          ></el-pagination>

          <!-- 筛选 -->
          <el-pagination
            v-else
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[15, 20, 30, 40]"
            :page-size="memberListPaging.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="screen.total"
            class="pagingConfig"
          ></el-pagination>
        </div>
      </div>
      <div class="no_member" v-show="!changeModule.status">
        <div class="no_member_top">
          <svg-icon iconClass="member" class="member" v-show="memberData.total===0"></svg-icon>
          <svg-icon iconClass="no_access" class="no_access" v-show="memberData.total===null"></svg-icon>
          <p v-show="memberData.total===0">当前部门无成员</p>
          <p v-show="memberData.total===null">暂无权限查看</p>
        </div>
        <div class="no_member_bottom" v-if="memberData.total===0">
          <a class="memberLink" @click="addMemberBtn">添加成员</a>
        </div>
      </div>
    </div>
    <el-dialog
      id="nodepart_dialog"
      title="未分组成员"
      :visible.sync="dialogTableVisible.status"
      :close-on-click-modal="false"
    >
      <el-input placeholder="请输入名字或电话" v-model="nodepart_input.txt" @input="nodepart_fn" clearable>
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-table
        ref="multipleTable"
        v-loading="addNodepart_loading"
        :data="ungrouped.data"
        tooltip-effect="dark"
        style="width: 100%;"
        height="300px"
        @selection-change="handleSelectionChange"
        :row-class-name="tableRowClassName"
        @scroll="tableScroll"
        class="addScroll"
      >
        <el-table-column type="selection" width="45" show-overflow-tooltip></el-table-column>
        <el-table-column label="姓名" width="100" show-overflow-tooltip sortable>
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column prop="temperature" label="体温" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="tel" label="电话" width="170" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="remark" label="状态" show-overflow-tooltip sortable></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toggleSelection()">取 消</el-button>
        <el-button type="primary" @click="addMemberList">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { onMounted, ref, reactive, watchEffect } from "@vue/composition-api";
import { switchModule } from "@/utils/common";
import {
  listUserLocationById,
  listDeviceAlarmInfoByUserId,
  removeMember,
  listUserByDepartment,
  listUserByNoDepartment,
  addMember,
  fuzzySearchNotGroup,
  listDepartmentByUser,
  select,
} from "@/api/contactsApi";
import { getLoginEmployee } from "@/api/employeeApi";
import { Message } from "element-ui";
import { cloneArray } from "@/utils/common";
export default {
  name: "memberList",
  props: {
    currentDepart: {
      // 不用在setup中重新声明一次变量
      type: Object,
      default: () => {}, // default值 需要使用箭头函数回调
    },
    memberData: {
      type: Object,
      default: () => {},
    },
    contactsModule: {
      type: Object,
      default: () => [],
    },
    currentMemberInfo: {
      type: Object,
      default: () => {},
    },
    modifyMemberInfo: {
      type: Object,
      default: () => {},
    },
    initial: {
      type: Object,
      default: () => {},
    },
    tmpHistory: {
      type: Object,
      default: () => {},
    },
    memberListPaging: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { root, refs }) {
    /**
     * 设备频率
     */
    let deviceStep = reactive({
      step: 0,
    });
    select().then((res) => {
      let hours = new Date().getHours(),
        dayInterval = res.data.dayInterval,
        dayTime = res.data.dayTime,
        nightInterval = res.data.nightInterval,
        nightTime = res.data.nightTime;
      if (hours >= dayTime && hours <= nightTime) {
        deviceStep.step = dayInterval * 60 * 1000 * 2;
      } else {
        deviceStep.step = nightInterval * 60 * 1000 * 2;
      }
    });
    /**检测当前管理员是否有权限查看当前部门
     *
     */
    let changeModule = reactive({
      status: true,
    });
    const dialogTableVisible = reactive({
      status: false,
    });

    // 批量添加未分組成員
    let multipleSelection = reactive([]);
    const toggleSelection = (rows) => {
      dialogTableVisible.status = false;
      if (rows) {
        rows.forEach((row) => {
          refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        refs.multipleTable.clearSelection();
      }
    };
    const handleSelectionChange = (val) => {
      multipleSelection = val;
    };

    // 批量移除成員
    let multipleSelection_remove = reactive([]);
    const toggleSelection_remove = (rows) => {
      if (rows) {
        rows.forEach((row) => {
          refs.multipleTable_remove.toggleRowSelection(row);
        });
      } else {
        refs.multipleTable_remove.clearSelection();
      }
    };
    const handleSelectionChange_remove = (val, index) => {
      multipleSelection_remove = val;
    };

    watchEffect(() => {
      if (props.memberData.total === 0) {
        changeModule.status = false;
      } else if (props.memberData.total === null) {
        changeModule.status = false;
      } else {
        changeModule.status = true;
      }
    });

    /**
     *  tr click事件
     */
    const compileTool = (data) => {
      // 切换模块
      switchModule(props.contactsModule, "memberInfo");

      // 获得成员个人信息
      let currentMemberInfo = props.currentMemberInfo;
      let modifyMemberInfo = props.modifyMemberInfo;
      let initial = props.initial;
      let step = deviceStep.step;
      for (let key in currentMemberInfo) {
        let time = new Date().getTime() - new Date(data.gmtCreate).getTime();
        if (time < step) {
          currentMemberInfo.online = true;
        } else {
          currentMemberInfo.online = false;
        }
        currentMemberInfo[key] = data[key];
        if (key == "address") {
          let address = currentMemberInfo.address;
          // 创建地址解析器实例
          var myGeo = new BMap.Geocoder();
          // 将地址解析结果显示在地图上,并调整地图视野
          myGeo.getPoint(
            address,
            function (point) {
              if (point) {
                currentMemberInfo.addressLongitude = point.lng;
                currentMemberInfo.addressLatitude = point.lat;
              } else {
                root.$message({
                  type: "error",
                  message: "您选择地址没有解析到结果!",
                });
              }
            },
            "北京市"
          );
        }
      }
      for (let key in modifyMemberInfo) {
        if (key == "id") {
          modifyMemberInfo[key] = data.userId;
          initial[key] = data.userId;
        } else {
          modifyMemberInfo[key] = data[key];
          initial[key] = data[key];
        }
      }
      /**
       * 查询用户所属的所有部门
       */
      let selectId = {
        id: data.userId,
      };
      listDepartmentByUser(selectId).then((res) => {
        let listData = res.data;
        currentMemberInfo.listDepart = [];
        listData.forEach((item) => {
          currentMemberInfo.listDepart.push(item.name);
        });
      });
      let tmpHistory = props.tmpHistory;
      /**根据用户id获取历史数据信息 */
      let currentObj = {
        userId: currentMemberInfo.userId,
      };
      listUserLocationById(currentObj).then((res) => {
        let array = res.data.list ? res.data.list : res.data; // 服务器与local切换
        let newArr_time = [],
          newArr_tmp = [],
          newArr_position = [],
          new_tableData = [],
          error_time = [],
          error_tmp = [],
          new_errorTableData = [];
        array.forEach((item) => {
          if (item.alarmType == 2 || item.alarmType == 3) {
            item.userName = currentMemberInfo.name;
            item.tel = currentMemberInfo.tel;
            // let lng = item.longitude,
            //   lat = item.latitude;
            // let pt = new BMap.Point(lng, lat);
            // let geoc = new BMap.Geocoder();
            // geoc.getLocation(pt, function (rs) {
            //   if (rs.addressComponents != null) {
            //     let addComp = rs.addressComponents;
            //     item.address =
            //       addComp.province +
            //       addComp.city +
            //       addComp.district +
            //       addComp.street +
            //       addComp.streetNumber;
            //     tmpHistory.data.push(item);
            //   }
            // });
            tmpHistory.data.push(item);
          }
          // temperature
          newArr_time.push(item.gmtCreate);
          let temperature = Number(item.temperature).toFixed(1);
          newArr_tmp.push(temperature); //Number().toFiexd(1)
          let errorObj = {};
          if (temperature >= 37.3) {
            error_time.push(item.gmtCreate);
            error_tmp.push(temperature);
            errorObj = {
              name: props.currentMemberInfo.name,
              time: item.gmtCreate,
              temperature: temperature,
            };
            new_errorTableData.push(errorObj);
          }
          // position
          let positionObj = {
            lng: item.longitude,
            lat: item.latitude,
          };
          newArr_position.push(positionObj);

          // tableData
          let tableObj = {
            name: props.currentMemberInfo.name,
            time: item.gmtCreate,
            temperature: temperature,
          };
          new_tableData.push(tableObj);
        });
        tmpHistory.newArr_time = newArr_time;
        tmpHistory.newArr_tmp = newArr_tmp;
        tmpHistory.error_time = error_time;
        tmpHistory.error_tmp = error_tmp;
        tmpHistory.newArr_position = newArr_position;
        tmpHistory.tableData = new_tableData.reverse();
        tmpHistory.error_tableData = new_errorTableData.reverse();
      });
      /**根据用户id获取设备最新数据和告警信息 */
      let currentArray = [currentMemberInfo.userId];
      listDeviceAlarmInfoByUserId(currentArray).then((res) => {
        let data = res.data[0] ? res.data[0] : [];
        props.tmpHistory.railName = data.railName;
        for (let key in data) {
          if (key == "age") {
            let newDate = new Date().getTime();
            let date = new Date(data[key]).getTime();
            let oneDay = 365 * 24 * 60 * 60 * 1000; // 一天的毫秒数
            let age = parseInt((newDate - date) / oneDay);
            currentMemberInfo[key] = age;
            currentMemberInfo.date = data[key];
            modifyMemberInfo.age = data[key];
            initial.age = data[key];
          } else if (key === "temperature") {
            currentMemberInfo[key] = parseFloat(data[key]).toFixed(1);
          } else if (key == "online") {
            continue;
          } else {
            currentMemberInfo[key] = data[key];
          }
        }
        for (let key in currentMemberInfo) {
          if (key === "railName" || key == "online" || key == "remarks") {
            continue;
          }
          let verify =
            currentMemberInfo[key] === null ||
            currentMemberInfo[key] === undefined ||
            currentMemberInfo[key] === ""; // 验证值是否为空
          if (verify) {
            currentMemberInfo[key] = "暂无数据";
          }
        }
      });
    };

    /**选择单个成员 */
    const checkChild = () => {};
    /**
     * 添加成员
     */
    // 获取登录人员权限ID
    const loginEmployeeInfo = reactive({
      role: null,
    });
    getLoginEmployee().then((res) => {
      loginEmployeeInfo.role = res.data.role;
    });
    /**
     * 查询未分组用户
     */
    let ungrouped = reactive({
      pageNum: 1,
      pageSize: 15,
      value: false,
      data: [], // 普通查询
    });
    // 添加成员
    const addMemberBtn = () => {
      let role = loginEmployeeInfo.role;
      if (role.id == 3 || role == null) {
        root.$message({ type: "warning", message: "没有访问权限" });
      } else {
        nodepart_input.txt = "";
        ungrouped.pageNum = 1;
        ungrouped.data.splice(0, ungrouped.data.length);
        dialogTableVisible.status = true;
        noDepart(ungrouped.pageNum, ungrouped.pageSize);
      }
    };
    // 批量移除成员
    const delMemberBtn = () => {
      let len = multipleSelection_remove.length;
      if (len == 0) {
        root.$message({
          type: "warning",
          message: "请选择要移除的部门成员",
        });
      } else {
        let data = [];
        multipleSelection_remove.forEach((item) => {
          data.push(item.userId);
        });
        delMemberOpen(data, multipleSelection_remove[0]);
      }
    };

    // 筛选
    const screen = reactive({
      visible: false, // 控制显示
      pageNum: 1,
      pageSize: 15,
      pagesizes: [15, 20, 30, 40],
      total: 0,
      show: [],
      data: [],
      content: {
        normal: "筛选正常用户",
        abnormal: "筛选异常用户",
      },
    });
    const screenAbnormal = (departId, txt) => {
      let parmas = new URLSearchParams();
      parmas.append("id", departId);
      listUserByDepartment(parmas).then((res) => {
        let code = res.code,
          msg = res.msg,
          data = res.data.list,
          start = screen.pageSize * (screen.pageNum - 1),
          end = screen.pageSize * screen.pageNum;
        data.forEach((item) => {
          item.temperature = Number(item.temperature).toFixed(1);

          // age
          let newDate = new Date().getTime();
          let date = new Date(item.age).getTime();
          let oneDay = 365 * 24 * 60 * 60 * 1000; // 一天的毫秒数
          let age = parseInt((newDate - date) / oneDay);
          item.age = age;
          if (item.temperature > 37.3) {
            item.status = "温度异常";
          } else {
            item.status = "";
          }
        });
        if (code == 0) {
          screen.visible = false;
          if (txt == "abnormal") {
            screen.data = data.filter((item) => {
              return parseFloat(item.temperature) >= 37.3;
            });
          } else {
            screen.data = data.filter((item) => {
              return parseFloat(item.temperature) < 37.3;
            });
          }
          screen.show = screen.data.slice(start, end);
          screen.visible = true;
          screen.total = screen.data.length;
          console.log(screen);
        } else {
          root.$message({
            type: "error",
            message: msg,
          });
        }
      });
    };

    const noDepart = (pageNum, pageSize) => {
      addNodepart_loading.value = true;
      listUserByNoDepartment(pageNum, pageSize).then((res) => {
        if (res.code === 0) {
          let data = res.data.list ? res.data.list : res.data,
            len = data.length;
          if (len !== 0) {
            data.forEach((item) => {
              let temperature = parseFloat(item.temperature);
              if (temperature >= 37.3) {
                item.remark = "温度异常";
              }
              ungrouped.data.push(item);
            });
            addNodepart_loading.value = false;
          } else {
            //暂无为分组用户
            addNodepart_loading.value = false;
            return;
          }
        } else {
          ungrouped.data = [];
          addNodepart_loading.value = false;
        }
      });
    };
    const addMemberList = () => {
      if (multipleSelection.length > 0) {
        addMemberOpen();
      } else {
        root.$message({ type: "warning", message: "请选择用户在添加" });
      }
    };
    /** 搜索未分组用户输入框
     *
     */
    const nodepart_input = reactive({
      txt: "",
    });
    const addNodepart_loading = ref("true");
    const nodepart_fn = () => {
      let txt = nodepart_input.txt;
      let params = "?keyword=" + txt;
      addNodepart_loading.value = true;
      if (txt.length === 0) {
        ungrouped.data = [];
        noDepart(ungrouped.pageNum, ungrouped.pageSize);
        addNodepart_loading.value = false;
      } else {
        fuzzySearchNotGroup(params).then((res) => {
          if (res.code === 0) {
            let data = res.data || [],
              len = data.length;
            ungrouped.data = res.data;
            addNodepart_loading.value = false;
          } else {
            root.$message({
              type: "error",
              message: res.msg,
            });
            addNodepart_loading.value = false;
          }
        });
      }
    };

    /**
     * 移除成员
     */
    const delMember = (id, row) => {
      delMemberOpen([id], row);
    };

    /**当前页变动时候触发的事件 */
    const handleCurrentChange = (val) => {
      props.memberListPaging.pageNum = val;
      selectChildMember(props.memberListPaging);
    };
    const handleSizeChange = (val) => {
      props.memberListPaging.pageSize = val;
      selectChildMember(props.memberListPaging);
    };
    /**
     * 查询部门成员
     */
    const selectChildMember = (memberListPaging) => {
      if (memberListPaging.id === -1) {
        listUserByNoDepartment(
          memberListPaging.pageNum,
          memberListPaging.pageSize
        ).then((res) => {
          props.memberData.data.splice(0, props.memberData.data.length);
          let data = res.data.list ? res.data.list : res.data;

          let size = res.data.size,
            hasPreviousPage = res.data.hasPreviousPage;
          let verify = res.data.total != 0 ? true : false;
          if (size === 0) {
            if (hasPreviousPage) {
              props.memberListPaging.pageNum--;
              selectChildMember(props.memberListPaging);
            } else {
              changeModule.status = verify;
            }
          } else {
            changeModule.status = verify;
          }

          props.memberData.data.total = res.data.total;
          props.currentDepart.length = data.length;
          props.memberData.total = res.data.total;
          let i = 0,
            len = data.length;
          for (i; i < len; i++) {
            // temperatrue
            data[i].temperature = Number(data[i].temperature).toFixed(1);

            // age
            let newDate = new Date().getTime();
            let date = new Date(data[i].age).getTime();
            let oneDay = 365 * 24 * 60 * 60 * 1000; // 一天的毫秒数
            let age = parseInt((newDate - date) / oneDay);
            data[i].age = age;
            if (data[i].temperature > 37.3) {
              data[i].status = "温度异常";
            } else {
              data[i].status = "";
            }
            props.memberData.data.push(data[i]);
          }
          //[ ... memberData.data] = data;
        });
      } else {
        let params = new URLSearchParams(); // text post 提交
        params.append("id", memberListPaging.id);
        params.append("pageNum", memberListPaging.pageNum);
        params.append("pageSize", memberListPaging.pageSize);
        listUserByDepartment(params).then((res) => {
          props.memberData.data.splice(0, props.memberData.data.length);
          let data = res.data.list ? res.data.list : res.data;

          let size = res.data.size,
            hasPreviousPage = res.data.hasPreviousPage;
          let verify = res.data.total != 0 ? true : false;
          if (size === 0) {
            if (hasPreviousPage) {
              props.memberListPaging.pageNum--;
              selectChildMember(props.memberListPaging);
            } else {
              changeModule.status = verify;
            }
          } else {
            changeModule.status = verify;
          }

          props.memberData.data.total = res.data.total;
          props.currentDepart.length = data.length;
          props.memberData.total = res.data.total;
          let i = 0,
            len = data.length;
          for (i; i < len; i++) {
            // temperatrue
            data[i].temperature = Number(data[i].temperature).toFixed(1);

            // age
            let newDate = new Date().getTime();
            let date = new Date(data[i].age).getTime();
            let oneDay = 365 * 24 * 60 * 60 * 1000; // 一天的毫秒数
            let age = parseInt((newDate - date) / oneDay);
            data[i].age = age;
            if (data[i].temperature > 37.3) {
              data[i].status = "温度异常";
            } else {
              data[i].status = "";
            }
            props.memberData.data.push(data[i]);
          }
          //[ ... memberData.data] = data;
        });
      }
    };

    /**弹出框
     *
     */

    // 移除成员确认框
    const delMemberOpen = (data, row) => {
      const h = root.$createElement;
      let str = "";
      if (data.length == 1) {
        str = `移除"${row.name}"`;
      } else {
        str = "移除这些成员。";
      }
      root
        .$msgbox({
          title: "移除成员",
          message: h("p", null, [
            h("span", null, str),
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
          let parmas = {
            depId: props.currentDepart.id,
            userIds: data,
          };
          removeMember(parmas).then((res) => {
            let code = res.code;
            if (code === 0) {
              root.$message({
                type: "success",
                message: "移除成功",
              });
              selectChildMember(props.memberListPaging);
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
            message: "已取消移除",
          });
        });
    };
    const tableScroll = () => {
      if (dialogTableVisible.status) {
        let tableHeight = refs.multipleTable.bodyWrapper.offsetHeight;
        let tableScrollTop = refs.multipleTable.bodyWrapper.scrollTop;
        let tableScrollHeight = refs.multipleTable.bodyWrapper.scrollHeight;
        if (tableScrollHeight - tableScrollTop <= tableHeight) {
          ungrouped.pageNum++;
          noDepart(ungrouped.pageNum, ungrouped.pageSize);
        }
      }
    };
    window.addEventListener("scroll", tableScroll, true);
    // 增加成员确认框
    const addMemberOpen = () => {
      const h = root.$createElement;
      root
        .$msgbox({
          title: "添加成员",
          message: h("p", null, [
            h("span", null, `增加成员`),
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
          let addMemberData = {
            userId: [],
            depId: props.currentDepart.id,
          };
          multipleSelection.forEach((item) => {
            addMemberData.userId.push(item.userId);
          });
          addMember(addMemberData).then((res) => {
            let code = res.code;
            if (code === 0) {
              selectChildMember(props.memberListPaging);
              root.$message({
                type: "success",
                message: "添加成功",
              });
              dialogTableVisible.status = false;
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
            message: "已取消添加",
          });
        });
    };
    // 异常状态表格
    const tableRowClassName = ({ row, rowIndex }) => {
      let temperature = parseFloat(row.temperature);
      if (temperature >= 37.3) {
        return "warning-row";
      }
      return "";
    };

    onMounted(() => {});
    return {
      compileTool,
      changeModule,
      checkChild,
      addMemberBtn, // Fn 添加部门成员
      delMemberBtn,
      screen,
      screenAbnormal,
      delMember, // Fn 移除部门成员
      handleCurrentChange,
      handleSizeChange,
      ungrouped,
      toggleSelection,
      handleSelectionChange,
      handleSelectionChange_remove,
      tableRowClassName,
      dialogTableVisible,
      addMemberList,
      tableScroll,
      nodepart_input,
      nodepart_fn,
      addNodepart_loading,
    };
  },
};
</script>
<style lang="scss" scoped>
$contactsHeight: 592px;
.chunk_cnt {
  height: $contactsHeight;
  // padding-bottom: 45px !important;
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
    .has_member {
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
        thead {
          input {
            cursor: pointer;
          }
          th {
            padding-top: 4px;
          }
        }
        tbody {
          input {
            cursor: pointer;
          }
          tr:hover {
            background: #f5f5f5;
          }
        }
        .danger {
          color: #da5646;
        }
      }
    }
    .no_member {
      .no_member_top {
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
      .no_member_bottom {
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
.member {
  color: #ddd;
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
</style>