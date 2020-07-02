<template>
  <main id="contacts" class="frame_center">
    <div class="contacts_main frame_center_main">
      <div class="chunk_title">
        <div class="chunk_title_top">
          <el-input class="search" placeholder="搜索部门" v-model="filterText"></el-input>
          <a href="javascript:;" class="addChildMember">
            <i>+</i>
          </a>
        </div>
        <div class="chunk_title_bottom">
          <el-tree
            :class="['filter-tree', 'memberList']"
            :data="departData"
            :props="defaultProps"
            node-key="id"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            :expand-on-click-node="false"
            :default-expanded-keys="[1]"
            ref="tree"
          >
            <span :class="['custom-tree-node']" slot-scope="{ node, data }">
              <i>
                <svg-icon iconClass="depart" class="depart"></svg-icon>
              </i>
              <span class="tree-text">{{ node.label }}</span>
              <span class="departTool">
                <!--
                <el-button type="text" size="mini" @click="() => append(data)">Append</el-button>
                <el-button type="text" size="mini" @click="() => remove(node, data)">Delete</el-button>
                -->
                <div
                  class="menu_right"
                  @click.stop="showDepartClick"
                  @mouseleave.stop="hideDepartLeave"
                >
                  <svg-icon iconClass="menu_link" class="menu_right_svg"></svg-icon>
                  <div
                    v-show="showDepartOperation"
                    :class="['departOperation', {'showDepartOperation': showDepartOperation}]"
                  >
                    <ul>
                      <li>
                        <el-button
                          type="text"
                          @click.stop="dialogShow(data, node)"
                          class="addMemberBtn"
                        >添加子部门</el-button>
                      </li>
                      <li>
                        <el-button
                          type="text"
                          @click.stop="dialogmodify(data, node)"
                          class="modifyMemberBtn"
                        >修改部门名称</el-button>
                      </li>
                      <li>
                        <el-button
                          type="text"
                          @click.stop="dialogDel(data, node)"
                          class="delMemberBtn"
                        >删除部门</el-button>
                      </li>
                      <li>id:{{data.id}}</li>
                    </ul>
                  </div>
                </div>

                <el-dialog title="添加部门" :visible.sync="dialogFormVisible" class="addDialog">
                  <el-form :model="form">
                    <el-form-item label="部门名称" :label-width="formLabelWidth">
                      <el-input
                        v-model="form.name"
                        autocomplete="off"
                        ref="partmentContent"
                        maxlength="30"
                        placeholder="请输入部门名称"
                        @click.stop.native="() => { return }"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click.stop="dialogFormVisible = false">取 消</el-button>
                    <el-button
                      type="primary"
                      @click.stop="dialogHide(childData)"
                      :disabled="addStatus"
                    >确 定</el-button>
                  </div>
                </el-dialog>

                <el-dialog title="修改部门名称" :visible.sync="modifyData.visibel" class="modifyDialog">
                  <el-form :model="modifyData">
                    <el-form-item label="部门名称" :label-width="formLabelWidth">
                      <el-input
                        v-model="modifyData.name"
                        autocomplete="off"
                        ref="partmentChangeContent"
                        maxlength="30"
                        :placeholder="modifyData.name"
                        @click.stop.native="() => { return }"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click.stop="modifyData.visibel = false">取 消</el-button>
                    <el-button
                      type="primary"
                      @click.stop="dialogModifyHide()"
                      :disabled="modifyData.status"
                    >保 存</el-button>
                  </div>
                </el-dialog>

                <el-dialog
                  title="移除部门"
                  :visible.sync="dialogVisible"
                  width="30%"
                  :before-close="handleClose"
                  class="addDialog"
                >
                  <span>{{ memberLabel }}</span>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click.stop="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click.stop="dialogDelHide()">确 定</el-button>
                  </span>
                </el-dialog>
              </span>
              <svg-icon iconClass="menuRight"></svg-icon>
            </span>
          </el-tree>
        </div>
      </div>
      <contactsList
        v-show="contactsModule.memberList"
        :currentDepart="currentDepart"
        :memberData="memberData"
        :contactsModule="contactsModule"
        :currentMemberInfo="currentMemberInfo"
        :tmpHistory="tmpHistory"
      ></contactsList>
      <el-pagination
        background
        layout="prev, pager, next"
        :size="memberData.length"
        :total="memberData.length"
        :hide-on-single-page="true"
        class="pagination_my"
      ></el-pagination>
      <contactsInfo
        v-show="contactsModule.memberInfo"
        :currentDepart="currentDepart"
        :contactsModule="contactsModule"
        :currentMemberInfo="currentMemberInfo"
        :tmpHistory="tmpHistory"
      ></contactsInfo>
    </div>
  </main>
</template>

<script>
import contactsInfo from "./components/memberInfo";
import contactsList from "./components/memberList";
import {
  addDepartment,
  listAllDepartment,
  updateDepartment,
  addMember,
  removeDepartment,
  listUserByDepartment,
  listUserByNoDepartment,
  removeMember,
  listDepartmentByPid
} from "@/api/contactsApi";
import { translateDataToTree, switchModule } from "@/utils/common";
import sha1 from "sha1"; //前台加密 使用:  sha1(value);
import cookie from "cookie_js";
import {
  onMounted,
  reactive,
  watchEffect,
  ref,
  computed,
  watch
} from "@vue/composition-api";
export default {
  name: "contacts",
  components: { contactsInfo, contactsList },
  setup(props, { root, refs, set }) {
    /**
     * contacts模块管理
     */
    let contactsModule = reactive({
      memberList: true, // 成员列表
      memberInfo: false, // 成员信息
      memberModify: false // 修改信息
    });
    let currentMemberInfo = reactive({
      address: "山西省太原市万柏林区a",
      age: "23",
      gmtCreate: null,
      name: "aaaaaa",
      radius: "25",
      railLatitude: "29.825502",
      railLongitude: "106.530144",
      sex: "男",
      tel: "13647684961",
      temperature: "0.0",
      userId: "5",
      userLatitude: 106.53721028909878,
      userLongitude: 29.821216648608489
    }); // 当前成员信息
    let tmpHistory = reactive({
      newArr_time: [],
      newArr_tmp: [],
      online: false,
      temperature: "33.78",
      electric: "2",
      location: "重庆市北碚区云汉大道",
      railName: "万寿福居公租房",
      lastUpdate: "2020-05-14 15:48:02",
      tnumber: null,
      pnumber: 109
    }); // 当前成员温度随时间变化的历史数据
    /**
     * 数据
     */
    let companyData = reactive({
      companyId: 6
    }); // 顶级部门 id
    const getCompanyId = () => {
      listAllDepartment().then(response => {
        let data = response.data.list ? response.data.list : response.data;
        return data[0].id;
      });
    };

    let treeData = reactive({
      status: false
    });
    let memberLabel = ref("移除部门");
    let departData = reactive([
      {
        label: "",
        displayOrder: 10001,
        id: getCompanyId() || 6,
        pid: 0,
        children: [],
        childrenLen: 0
      }
    ]);
    watchEffect(() => departData);
    // 当前部门信息
    let currentDepart = reactive({
      label: "",
      id: 1,
      pid: 0,
      length: 0,
      topId: 2
    });
    //selectChildDepart(0);
    let childData = reactive({}); // add child
    let addStatus = ref(false); // 增加部门的确定按钮的禁用状态
    let removeData = reactive({
      data: {},
      node: {}
    }); // remove child
    let modifyNodeData = reactive({});
    const defaultProps = reactive({
      children: "children",
      label: "label"
    });
    const filterText = ref("");
    const dialogFormVisible = ref(false); // formLog
    const dialogVisible = ref(false); // delLog
    const form = reactive({
      name: "",
      delivery: false,
      type: [],
      resource: "",
      desc: ""
    });
    const modifyData = reactive({ name: "", visibel: false, status: false }); // 修改部门名称 data
    const formLabelWidth = ref("100px");

    /**---------------------------------- 部门 end---------------------------------- */
    /**
     * 函数
     *
     */

    /**
     * 添加子部门 btn
     */
    const append = data => {
      addDepart(form.name, data.id).then(response => {
        let resData = response.data;
        const newChild = {
          id: resData.id,
          pid: resData.pid,
          label: resData.name,
          displayOrder: resData.displayOrder,
          children: []
        };
        if (!data.children) {
          set(data, "children", []);
        }
        data.children.push(newChild);
        root.$message({
          message: "成功添加部门",
          type: "success"
        });
      });
    };

    /**
     * 删除子部门 btn
     */
    const remove = (node, data) => {
      let id = data.id;
      delDepart(id)
        .then(response => {
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.id === data.id);
          children.splice(index, 1);
          root.$message({
            message: "成功移除部门",
            type: "success"
          });
        })
        .catch(response => {
          root.$message({
            message: response.msg,
            type: "error"
          });
        });
    };

    /**
     * 查询子部门
     */
    const selectChildDepart = id => {
      let listPidParams = new URLSearchParams();
      listPidParams.append("id", id);
      listDepartmentByPid(listPidParams).then(response => {
        let data = response.data;
        let len = data.length,
          i = 0;
        for (i; i < len; i++) {
          let currentMember = data[i];
          console.log(currentMember);
        }
      });
    };

    /**
     * 添加部门成员
     */
    const addMemberFn = (depId, userIdArr) => {
      console.log(depId, userIdArr);
      let params = new URLSearchParams();
      params.append("userId", userIdArr); // [1, 2, 7]
      params.append("depId", depId); // 7
      //console.log(params);
      console.log(params);
      return addMember(params);
    };

    /**
     * 查询未分组用户
     */
    const selectNodepart = (pageNum, pageSize) => {
      return listUserByNoDepartment(pageNum, pageSize);
    };

    /**
     * 查询所有部门
     */
    const selectAllDepart = () => {
      return listAllDepartment().then(response => {
        let data = response.data.list ? response.data.list : response.data,
          len = data.length;
        if (len <= 0) {
          root.$message({ message: "暂无部门" });
        } else {
          let id = data[0].id;
          companyData.companyId = id;
          currentDepart.topId = id;
          departData[0].id = id;
          let treeData = translateDataToTree(data)[0];
          if (treeData == undefined) {
            root.$message({
              message: "部门信息有误",
              type: "error"
            });
          } else {
            departData[0].label = currentDepart.label = treeData.name;
            departData[0].children = treeData.children;
            departData[0].childrenLen = treeData.childrenLen;
            departData[0].displayOrder = treeData.displayOrder;
            departData[0].id = currentDepart.id = treeData.id;
            departData[0].pid = currentDepart.pid = treeData.pid;
          }
        }
        return companyData;
      });
    };
    selectAllDepart();

    /**
     * 查询未分组用户
     */
    let ungrouped = reactive({
      pageNum: 1,
      pageSize: 20,
      value: false,
      data: []
    });
    const noDepart = () => {
      selectNodepart(ungrouped.pageNum, ungrouped.pageSize).then(response => {
        let data = response.data.list ? response.data.list : response.data,
          len = data.length;
        if (len !== 0) {
          let i = 0;
          for (i; i < len; i++) {
            let user = data[i];
          }
          ungrouped.data = data; // 将未分组用户存入 ungrouped.data 中
        } else {
          //暂无为分组用户
          return;
        }
      });
    };
    noDepart();

    /**
     * 添加部门
     */
    const addDepart = (name, pid) => {
      return addDepartment({
        name: name,
        pid: pid
      });
    };

    /**
     * 删除部门
     */
    const delDepart = id => {
      let removeDepartmentId = new URLSearchParams();
      removeDepartmentId.append("id", id);
      return removeDepartment(removeDepartmentId);
    };

    /**
     * 修改部门信息
     */
    const updateDepart = modifyNodeData => {
      let data = modifyNodeData.data;
      return updateDepartment({
        id: data.id,
        name: data.label,
        pid: data.pid,
        displayOrder: data.displayOrder
      });
    };

    /**
     * departData 点击事件
     */
    const handleNodeClick = data => {
      // 当前部门信息
      let id = data.id;
      currentDepart.label = data.label;
      currentDepart.id = data.id;
      currentDepart.pid = data.pid;
      treeData.status = true;
      memberData.splice(0, memberData.length); // 删除之前的成员信息
      selectChildMember(id);
      switchModule(contactsModule, "memberList");
    };

    /**
     * 过滤
     */
    const filterNode = (value, data) => {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    };

    /**
     * 成功提示函数
     */
    const open4 = () => {
      //查询部门成员
      let listUserId = new URLSearchParams();
      listUserId.append("id", 7);
      listUserByDepartment(listUserId).then(response => {
        root.$message({
          message: response.msg,
          type: "warning"
        });
      });
      selectAllDepart();
    };

    /**
     * handleClose
     */
    const handleClose = done => {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    };

    /**
     * dialog 显示 btn
     * type: 添加部门
     */
    const dialogShow = (data, node) => {
      console.log(data, node);
      let len = node.level;
      if (len > 14) {
        root.$message({
          message: "子部门层级超过15层，无法添加"
        });
      } else {
        childData = data;
        dialogFormVisible.value = true;
      }
    };

    /**
     * dialog 隐藏 btn
     * type: 添加部门
     */
    const dialogHide = () => {
      let inputTxt = form.name,
        len = inputTxt.length;
      if (len !== 0) {
        dialogFormVisible.value = false;
        append(childData);
      } else {
        addStatus.value = true;
        root.$message({
          message: "部门名称不能为空",
          type: "warning"
        });
      }
    };

    /**
     * dialogDel 显示 btn
     * type: 移除部门
     */
    const dialogDel = (data, node) => {
      removeData = {
        data: data,
        node: node
      };
      let id = removeData.data.id || 0;
      memberLabel.value = `是否移除'${removeData.data.label}'`;
      if (companyData.companyId == id) {
        root.$message({
          message: "不能移除顶级部门",
          type: "warning"
        });
      } else {
        dialogVisible.value = true;
      }
    };

    /**
     * dialogDelHide 隐藏 btn
     * type: 移除部门
     */
    const dialogDelHide = () => {
      dialogVisible.value = false;
      remove(removeData.node, removeData.data);
      delDepart();
    };

    /**
     * dialogmodify 显示 btn
     * type: 修改部门名称
     */
    const dialogmodify = (data, node) => {
      let pid = data.pid;
      if (pid !== 0) {
        modifyNodeData = node;
        modifyData.name = data.label;
        modifyData.visibel = true;
      } else {
        root.$message({
          message: "不能更改顶级部门的名称",
          type: "warning"
        });
      }
    };

    /**
     * dialogModifyHide 隐藏 btn
     * type: 修改部门名称
     */
    const dialogModifyHide = () => {
      let len = modifyData.name.length;
      if (len <= 0) {
        root.$message({
          message: "部门名称不能为空",
          type: "warning"
        });
        modifyData.status = true;
      } else {
        let inputTxt = refs.partmentChangeContent.value;
        modifyNodeData.data.label = inputTxt;
        modifyNodeData.data.name = inputTxt;
        updateDepart(modifyNodeData)
          .then(response => {
            root.$message({
              message: "修改名称成功",
              type: "success"
            });
            currentDepart.label = inputTxt; // 修改memberList中的名称
            modifyData.visibel = false;
          })
          .catch(response => {
            root.$message({
              message: response.msg,
              type: "error"
            });
          });
      }
    };
    /**---------------------------------- 部门 end---------------------------------- */

    /**---------------------------------- 部门成员 login---------------------------------- */
    let memberData = reactive([]);
    /**
     * 查询部门成员
     */
    const selectChildMember = id => {
      let listUserId = new URLSearchParams(); // text post 提交
      listUserId.append("id", id);
      listUserByDepartment(listUserId).then(response => {
        let data = response.data.list ? response.data.list : response.data;
        currentDepart.length = data.length;
        let i = 0,
          len = data.length;

        for (i; i < len; i++) {
          data[i].temperature = Number(data[i].temperature).toFixed(1);
          memberData.push(data[i]);
        }
        //[ ... memberData] = data;
      });
    };
    /**
     * 左侧工具栏点击事件
     */
    let showDepartOperation = ref(false);
    const showDepartClick = () => {
      showDepartOperation.value = true;
    };
    const hideDepartLeave = () => {
      showDepartOperation.value = false;
    };
    watchEffect(() => {
      // 获取顶级部门的真实id
      selectChildMember(companyData.companyId);
    });
    /**---------------------------------- 部门成员 end---------------------------------- */

    /**---------------------------------- 生命周期 onMounted login ---------------------------------- */
    onMounted(() => {
      console.log("挂载完成"); //addMemberFn selectNodepart
      /**在挂载完成之后在执行侦听器 */
      watchEffect(
        () => filterText.value,
        val => {
          refs.tree.filter(val);
        },
        () => departData
      );
      watchEffect(() => {
        //dialogFormVisible modifyData.visibel
        if (dialogFormVisible.value === false) {
          form.name = "";
        }
      });
      watchEffect(() => {
        let len = form.name.length;
        if (len > 0) {
          addStatus.value = false;
        } else if (len >= 30) {
          root.$message({
            message: "部门名称长度不能大于30",
            type: "warning"
          });
        }
      });
      watchEffect(() => {
        let modifyLen = modifyData.name.length;
        if (modifyLen > 0) {
          modifyData.status = false;
        } else if (modifyLen >= 30) {
          root.$message({
            message: "部门名称长度不能大于30",
            type: "warning"
          });
        }
      });
      /*
      //删除部门成员
      let removeMemberParams = new URLSearchParams();
      removeMemberParams.append("userIds", [1, 2, 7]);
      removeMemberParams.append("depId", 7);
      removeMember(removeMemberParams);
      */
    });
    /**---------------------------------- 生命周期 onMounted end---------------------------------- */

    return {
      contactsModule,
      open4,
      departData,
      defaultProps,
      handleNodeClick,
      filterNode,
      filterText,
      append,
      remove,
      treeData,
      //dialog
      dialogFormVisible,
      form,
      formLabelWidth,
      childData,
      dialogHide,
      dialogShow,
      // delDialog
      dialogVisible,
      dialogDel,
      dialogDelHide,
      handleClose,
      removeData,
      addStatus,
      memberLabel,
      //modify
      modifyData,
      dialogmodify,
      dialogModifyHide,
      // memberData
      memberData,
      currentDepart,
      currentMemberInfo,
      tmpHistory,
      updateDepart, // 修改部门名称
      modifyNodeData, // 传入子组件的部门修改信息
      showDepartOperation, // 点击左侧导航栏的菜单栏的样式 布尔值
      showDepartClick, // 鼠标 点击 控制左侧导航栏的显示菜单栏函数
      hideDepartLeave // 鼠标离开 控制左侧导航栏隐藏的菜单栏函数
    };
  }
};
</script>

<style lang="scss" scoped>
$contactsHeight: 592px;
#contacts {
  .contacts_main {
    position: relative;
    .chunk_title {
      width: 257px;
      max-width: 257px;
      min-width: 257px;
      height: $contactsHeight;
      .chunk_title_top {
        padding: 10px;
        border-bottom: 1px solid #e4e6e9;
        position: relative;
        .search {
          width: 212px;
        }
        .addChildMember {
          width: 20px;
          height: 20px;
          text-align: center;
          font-size: 27px;
          color: #aaaaaa;
          position: absolute;
          right: 4px;
          top: 9px;
          i {
            font-style: normal;
          }
        }
      }
      .chunk_title_bottom {
        padding: 10px 0;
        .memberList {
          font-size: 14px;
        }
        .unrouped {
          height: 26px;
          line-height: 26px;
          color: #606266;
          width: 100%;
          cursor: pointer;
          margin-bottom: 10px;
          padding-left: 24px;
          font-size: 14px;
          @include webkit("box-sizing", border-box);
        }
        .unrouped:hover {
          background: rgb(245, 247, 250);
        }
        .el-tree-node__children {
          max-width: 257px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
.tree-active {
  background: #5090f1 !important;
}
.pagination_my {
  position: absolute;
  right: 7px;
  bottom: 6px;
}
.depart {
  margin-right: 6px;
}

// 显示隐藏左侧导航工具栏
.el-tree-node__content {
  position: relative;
  .menu_right {
    opacity: 0;
    position: absolute;
    right: 5px;
    top: 5px;
    .departOperation {
      position: absolute;
      left: 8px;
      top: 8px;
      opacity: none;
      background: #fff;
      ul {
        @include webkit("box-shadow", 0 0 3px 0 #c8c8c8);
        li {
          width: 98px;
          height: 26px;
          padding: 4px 9px;
          line-height: 18px;
          @include webkit("box-sizing", border-box);
          .addMemberBtn,
          .modifyMemberBtn,
          .delMemberBtn {
            padding: 0;
            color: #000;
          }
        }
        li:hover {
          background-color: #f5f7fa;
        }
        li:last-child:hover {
          background-color: #fff;
        }
      }
    }
    .showDepartOperation {
      display: block;
    }
  }
}
.el-tree-node__content:hover {
  .menu_right {
    opacity: 1;
  }
}
</style>