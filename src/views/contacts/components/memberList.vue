<template>
  <div class="chunk_cnt">
    <div class="cnt_top">
      <div class="cnt_top_l">
        <span>{{ currentDepart.label }}</span>
        <span>({{ memberData.total }}人)</span>
      </div>
      <div class="block" v-show="changeModule.status">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[15, 20, 30, 40]"
          :page-size="memberListPaging.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="memberData.total"
          class="pagingConfig"
        ></el-pagination>
      </div>
      <div class="cnt_top_r">
        <a href="javascript:;"></a>
        <!--<span class="frame_operation_separator" v-if="currentDepart.id!==currentDepart.topId">|</span>-->
      </div>
    </div>
    <div class="cnt_bottom">
      <div class="has_member" v-show="changeModule.status">
        <div class="cnt_tool">
          <a class="memberLink" href="javascript:;" @click="addMemberBtn">添加成员</a>
        </div>
        <table class="memberTable mm_tabel">
          <thead>
            <tr>
              <!--
              <th>
                <input type="checkbox" name="memberChooseAll" class="memberAllSlect" />
              </th>
              -->
              <th>姓名</th>
              <th>性别</th>
              <th>年龄</th>
              <th>温度</th>
              <th>电话</th>
              <th>地址</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(member, index) in memberData.data"
              :key="member.id"
              @click.stop="compileTool(member)"
            >
              <!--
              <td @click.stop="checkChild">
                <input type="checkbox" name="memberChoose" class="memberSelect" />
              </td>
              -->
              <td :title="member.name">{{ member.name }}</td>
              <td :title="member.sex">{{ member.sex }}</td>
              <td :title="member.age">{{ member.age }}</td>
              <td :title="member.temperature">{{ member.temperature }}</td>
              <td :title="member.tel">{{ member.tel }}</td>
              <td :title="member.address">{{ member.address }}</td>
              <td class="tdTool">
                <a href="javascript:;" @click.stop="compileTool(member)">查看</a>
                <a href="javascript:;" @click.stop="delMember(member.userId, index)">移除</a>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="cnt_tool">
          <a class="memberLink" href="javascript:;" @click="addMemberBtn">添加成员</a>
        </div>
      </div>
      <div class="no_member" v-show="!changeModule.status">
        <div class="no_member_top">
          <svg-icon iconClass="member" class="member"></svg-icon>
          <p>当前部门无任何成员</p>
        </div>
        <div class="no_member_bottom">
          <a class="memberLink" @click="addMemberBtn">添加成员</a>
        </div>
      </div>
    </div>
    <el-dialog title="未分组成员" :visible.sync="dialogTableVisible.status">
      <el-table
        ref="multipleTable"
        :data="ungrouped.data"
        tooltip-effect="dark"
        style="width: 100%;"
        height="300px"
        @selection-change="handleSelectionChange"
        @scroll="tableScroll"
        class="addScroll"
      >
        <el-table-column type="selection" width="70"></el-table-column>
        <el-table-column label="姓名" width="150">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column prop="tel" label="电话" width="150"></el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="toggleSelection()">取 消</el-button>
        <el-button type="primary" @click="addMemberList">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { onMounted, reactive, watchEffect } from "@vue/composition-api";
import { switchModule } from "@/utils/common";
import {
  listUserLocationById,
  listDeviceAlarmInfoByUserId,
  removeMember,
  listUserByDepartment,
  listUserByNoDepartment,
  addMember
} from "@/api/contactsApi";
import { Message } from "element-ui";
import { cloneArray } from "@/utils/common";
export default {
  name: "memberList",
  props: {
    currentDepart: {
      // 不用在setup中重新声明一次变量
      type: Object,
      default: () => {} // default值 需要使用箭头函数回调
    },
    memberData: {
      type: Object,
      default: () => {}
    },
    contactsModule: {
      type: Object,
      default: () => []
    },
    currentMemberInfo: {
      type: Object,
      default: () => {}
    },
    tmpHistory: {
      type: Object,
      default: () => {}
    },
    memberListPaging: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root, refs }) {
    let changeModule = reactive({
      status: true
    });
    const dialogTableVisible = reactive({
      status: false
    });
    let multipleSelection = reactive([]);
    const toggleSelection = rows => {
      dialogTableVisible.status = false;
      if (rows) {
        rows.forEach(row => {
          refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        refs.multipleTable.clearSelection();
      }
    };
    const handleSelectionChange = val => {
      multipleSelection = val;
    };
    watchEffect(() => {
      if (props.memberData.total === 0) {
        changeModule.status = false;
      } else {
        changeModule.status = true;
      }
    });
    /**
     *  tr click事件
     */
    const compileTool = data => {
      // 切换模块
      switchModule(props.contactsModule, "memberInfo");

      // 获得成员个人信息
      let currentMemberInfo = props.currentMemberInfo;
      for (let key in currentMemberInfo) {
        currentMemberInfo[key] = data[key];
      }
      let tmpHistory = props.tmpHistory;
      /**根据用户id获取历史数据信息 */
      let currentObj = {
        userId: currentMemberInfo.userId
      };
      listUserLocationById(currentObj).then(res => {
        let array = res.data.list ? res.data.list : res.data; // 服务器与local切换
        let newArr_time = [],
          newArr_tmp = [];
        array.forEach(item => {
          newArr_time.push(item.gmtCreate);
          let temperature = Number(item.temperature).toFixed(1);
          newArr_tmp.push(temperature); //Number().toFiexd(1)
        });
        tmpHistory.newArr_time = newArr_time;
        tmpHistory.newArr_tmp = newArr_tmp;
      });
      /**根据用户id获取设备最新数据和告警信息 */
      let currentArray = [currentMemberInfo.userId];
      listDeviceAlarmInfoByUserId(currentArray).then(res => {
        let data = res.data[0] ? res.data[0] : [];
        props.tmpHistory.railName = data.railName;
        for (let key in data) {
          currentMemberInfo[key] = data[key];
        }
        for (let key in currentMemberInfo) {
          if (key === "railName") {
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
    const checkChild = () => {
      console.log("1");
    };
    /**
     * 添加成员
     */
    /**
     * 查询未分组用户
     */
    let ungrouped = reactive({
      pageNum: 1,
      pageSize: 15,
      value: false,
      data: []
    });
    const addMemberBtn = () => {
      ungrouped.pageNum = 1;
      ungrouped.data.splice(0, ungrouped.data.length);
      dialogTableVisible.status = true;
      noDepart(ungrouped.pageNum, ungrouped.pageSize);
    };
    const noDepart = (pageNum, pageSize) => {
      listUserByNoDepartment(pageNum, pageSize).then(res => {
        let data = res.data.list ? res.data.list : res.data,
          len = data.length;
        if (len !== 0) {
          data.forEach(item => {
            ungrouped.data.push(item);
          });
        } else {
          //暂无为分组用户
          return;
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

    /**
     * 移除成员
     */
    const delMember = (id, index) => {
      delMemberOpen(id, index);
    };

    /**当前页变动时候触发的事件 */
    const handleCurrentChange = val => {
      props.memberListPaging.pageNum = val;
      selectChildMember(props.memberListPaging);
    };
    const handleSizeChange = val => {
      props.memberListPaging.pageSize = val;
      selectChildMember(props.memberListPaging);
    };
    /**
     * 查询部门成员
     */
    const selectChildMember = memberListPaging => {
      let params = new URLSearchParams(); // text post 提交
      params.append("id", memberListPaging.id);
      params.append("pageNum", memberListPaging.pageNum);
      params.append("pageSize", memberListPaging.pageSize);
      listUserByDepartment(params).then(res => {
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
          data[i].temperature = Number(data[i].temperature).toFixed(1);
          props.memberData.data.push(data[i]);
        }
        //[ ... memberData.data] = data;
      });
    };

    /**弹出框
     *
     */

    // 移除成员确认框
    const delMemberOpen = (id, index) => {
      let item = props.memberData.data[index];
      const h = root.$createElement;
      root
        .$msgbox({
          title: "移除成员",
          message: h("p", null, [
            h("span", null, `移除"${item.name}"`)
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
          let parmas = {
            depId: props.currentDepart.id,
            userIds: [id]
          };
          removeMember(parmas).then(res => {
            let code = res.code;
            if (code === 0) {
              //props.memberData.data.splice(index, 1);
              root.$message({
                type: "success",
                message: "移除成功"
              });
              selectChildMember(props.memberListPaging);
            } else {
              root.$message({
                type: "error",
                message: res.msg
              });
            }
          });
        })
        .catch(() => {
          root.$message({
            type: "info",
            message: "已取消移除"
          });
        });
    };
    const tableScroll = () => {
      let tableHeight = refs.multipleTable.bodyWrapper.offsetHeight;
      let tableScrollTop = refs.multipleTable.bodyWrapper.scrollTop;
      let tableScrollHeight = refs.multipleTable.bodyWrapper.scrollHeight;
      if (tableScrollHeight - tableScrollTop <= tableHeight) {
        ungrouped.pageNum++;
        noDepart(ungrouped.pageNum, ungrouped.pageSize);
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
            h("span", null, `增加成员`)
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
          let addMemberData = {
            userId: [],
            depId: props.currentDepart.id
          };
          multipleSelection.forEach(item => {
            addMemberData.userId.push(item.userId);
          });
          addMember(addMemberData).then(res => {
            let code = res.code;
            if (code === 0) {
              selectChildMember(props.memberListPaging);
              root.$message({
                type: "success",
                message: "添加成功"
              });
              dialogTableVisible.status = false;
            } else {
              root.$message({
                type: "error",
                message: res.msg
              });
            }
          });
        })
        .catch(() => {
          root.$message({
            type: "info",
            message: "已取消添加"
          });
        });
    };

    onMounted(() => {});
    return {
      compileTool,
      changeModule,
      checkChild,
      addMemberBtn, // Fn 添加部门成员
      delMember, // Fn 移除部门成员
      handleCurrentChange,
      handleSizeChange,
      ungrouped,
      toggleSelection,
      handleSelectionChange,
      dialogTableVisible,
      addMemberList,
      tableScroll
    };
  }
};
</script>
<style lang="scss" scoped>
$contactsHeight: 592px;
.chunk_cnt {
  height: $contactsHeight;
  padding-bottom: 45px !important;
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