<template>
  <div class="chunk_cnt">
    <div class="info_title">
      <span>编辑成员信息</span>
    </div>

    <div class="cnt_tool">
      <a
        class="memberLink"
        id="saveInfo"
        href="javascript:;"
        @click="
          submitForm('ruleForm', modifyMemberInfo, currentMemberInfo, initial)
        "
        >保存</a
      >
      <a
        class="memberLink"
        href="javascript:;"
        @click="memberInfoBack(currentMemberInfo, modifyMemberInfo, initial)"
        >取消</a
      >
    </div>

    <div class="modify_form">
      <el-form
        :model="modifyMemberInfo"
        :rules="rules"
        :ref="handle.ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="right"
        size="small"
      >
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="modifyMemberInfo.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio v-model="modifyMemberInfo.sex" label="男">男</el-radio>
          <el-radio v-model="modifyMemberInfo.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="生日:" prop="date">
          <div class="block">
            <el-date-picker
              v-model="modifyMemberInfo.age"
              type="date"
              placeholder="选择日期"
              @change="dateChange"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="电话:" prop="tel">
          <el-input v-model="modifyMemberInfo.tel" clearable></el-input>
        </el-form-item>
        <el-form-item label="部门:" prop="depart">
          <div class="depart_box">
            <div>
              <span class="depart_item">
                <svg-icon iconClass="depart" class="depart"></svg-icon>
                {{ modifyMemberInfo.depart }}
              </span>
              <a
                hefr="javascript:;"
                class="modifyInfoBtn"
                @click="chooseDepart(modifyMemberInfo)"
              >
                <span>修改</span>
              </a>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="住址:" prop="address">
          <el-input v-model="modifyMemberInfo.address" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remarks">
          <el-input
            type="textarea"
            v-model="modifyMemberInfo.remarks"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <!-- 是否留在当前页 -->
    <el-dialog
      title="提示"
      :visible.sync="handle.dialogVisible"
      width="30%"
      :before-close="handleClose"
      class="addDialog universal_dialog"
    >
      <svg-icon
        iconClass="dialog_wanrning"
        className="dialog_wanrning"
      ></svg-icon>
      <span>成员的资料尚未保存，确定要离开吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handle.dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="backHandle(modifyMemberInfo, initial)"
          >确认</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改部门 -->
    <el-dialog
      title="选择成员所在部门"
      :visible.sync="departInfo.visible"
      width="30%"
      :before-close="handleClose"
      class="addDialog universal_dialog"
      :close-on-click-modal="false"
    >
      <div class="tree_box">
        <el-tree
          :data="departInfo.data"
          ref="chooseTree"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[6]"
          :default-checked-keys="[5]"
          :props="departInfo.defaultProps"
          :check-strictly="true"
          @check="checkDepartNode"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <i>
              <svg-icon iconClass="depart" class="depart"></svg-icon>
            </i>
            <span class="tree-text">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="departInfo.visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click.stop="chooseDepart_confirm(modifyMemberInfo)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { onMounted, reactive } from "@vue/composition-api";
import {
  updateUser,
  listAllDepartment,
  addMember,
  removeMember,
} from "@/api/contactsApi";
import { switchModule, translateDataToTree } from "@/utils/common";
export default {
  name: "modify_form",
  props: {
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
    contactsModule: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { root, refs }) {
    /**form
     *
     */
    let handle = reactive({
      judge: true, // 判断是否修改
      save: false, // 判断是否保存
      dialogVisible: false, // 弹出框
      ruleForm: "ruleForm", // refs
    });

    const ruleForm = reactive({
      name: "",
      sex: "",
      tel: "",
      address: "",
      remarks: "",
      age: "",
      date: "",
      labelPosition: "right",
    });

    /**规则 */
    const validateTel = (rule, value, callback) => {
      let exp = /^[1]([3-9])[0-9]{9}$/; // 匹配11位手机号码
      let len = value.length;
      if (value === "") {
        callback(new Error("请输入联系电话"));
      } else if (!exp.test(value)) {
        callback(new Error("请输入正确的联系电话"));
      } else {
        callback();
      }
    };
    const rules = reactive({
      tel: [{ validator: validateTel }],
    });
    const dateChange = (val) => {
      let year = val.getFullYear();
      let month = val.getMonth() + 1;
      let date = val.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      props.modifyMemberInfo.age = year + "-" + month + "-" + date;
    };
    /**方法
     *
     */
    // 提交
    const submitForm = (formName, data, memberData, initiData) => {
      if (departInfo.id != null) {
        // 原来的部门如果不是未分组部门，先移除这个成员
        if (departInfo.changeDepartId == -1) {
          //
        } else {
          let parmas_remove = {
            depId: departInfo.departId,
            userIds: [departInfo.id],
          };
          removeMember(parmas_remove).then((res) => {
            if (res.code == 0) {
              // 移除成功
            } else {
              root.$message({
                type: "error",
                message: "部门信息有误",
              });
              return;
            }
          });

          // 部门信息
          const parmas_add = {
            userId: departInfo.id,
            depId: departInfo.changeDepartId,
          };
          addMember(parmas_add).then((res) => {
            if (res.code == 0) {
              console.log(res, "true");
            } else {
              console.log(res, "false");
            }
          });
        }
      }

      refs[formName].validate((valid) => {
        if (valid) {
          updateUser(data).then((res) => {
            let code = res.code,
              msg = res.msg;
            if (code === 0) {
              root.$message({
                type: "success",
                message: "保存成功",
              });
              handle.save = true;
              for (let key in data) {
                initiData[key] = data[key];
                memberData[key] = data[key];
                if (key == "age") {
                  let newDate = new Date().getTime();
                  let date = new Date(data[key]).getTime();
                  let oneDay = 365 * 24 * 60 * 60 * 1000; // 一天的毫秒数
                  let age = parseInt((newDate - date) / oneDay);
                  memberData[key] = age;
                }
              }
              switchModule(props.contactsModule, "memberInfo");
              // 选择了部门
              if (departInfo.id != null) {
                props.currentMemberInfo.listDepart = [
                  departInfo.changeDepartLabel,
                ];
                departInfo.changeDepartId = null;
                departInfo.changeDepartLabel = null;
              }

            } else {
              root.$message({
                type: "error",
                message: msg,
              });
            }
          });
        } else {
          root.$message({
            type: "error",
            message: "部门信息有误",
          });
          return false;
        }
      });
    };

    // 重置
    const resetForm = (formName) => {
      refs[formName].resetFields();
    };
    // 返回
    const memberInfoBack = (data, modifyData) => {
      // data: 当前用户的信息 modifyData: 修改的用户信息
      let key = "", // 获取model值
        key1 = ""; // 判断是否修改了信息
      data.id = data.userId;
      for (key in modifyData) {
        if (data[key] != modifyData[key]) {
          if (key == "age") {
            if (data.date == modifyData[key]) {
              handle.judge = true;
              // continue;
            } else {
              handle.judge = false;
              break;
            }
          } else {
            handle.judge = false;
            console.log(key, data[key], "key");
            break;
          }
        }
      }
      if (handle.save) {
        switchModule(props.contactsModule, "memberInfo");
        handle.save = false;
        handle.judge = true;
      } else {
        if (handle.judge) {
          switchModule(props.contactsModule, "memberInfo");
        } else {
          handle.dialogVisible = true;
        }
      }
    };
    const handleClose = (done) => {
      done();
    };
    const backHandle = (modifyData, initiData) => {
      for (let key in initiData) {
        modifyData[key] = initiData[key];
      }
      handle.dialogVisible = false;
      switchModule(props.contactsModule, "memberInfo");
    };

    /**
     * 选择部门
     */
    // 部门信息
    const departInfo = reactive({
      visible: false,
      data: [
        {
          label: "",
          displayOrder: 10001,
          id: props.modifyMemberInfo.pid, // 顶级部门id
          pid: 0,
          children: [],
          childrenLen: 0,
        },
      ],
      id: null,
      depart: null,
      departId: null,
      changeDepartId: null,
      changeDepartLabel: null,
      defaultProps: {
        children: "children",
        label: "label",
      },
    });
    // fn
    const chooseDepart = (data) => {
      departInfo.visible = true;
      departInfo.departId = data.departId;
      departInfo.depart = data.depart;
      if (departInfo.changeDepartId == null) {
        // 获取所有部门信息生成树状结构
        listAllDepartment().then((res) => {
          // 未分组成员部门
          let ungroupedDepart = {
            id: -1,
            pid: data.pid,
            name: "未分组成员",
            label: "未分组成员",
            hasAuthority: false,
            disabled: true,
            children: [],
            displayOrder: 10001,
          };
          res.data.list.push(ungroupedDepart);
          let treeData = translateDataToTree(res.data.list)[0];
          for (let key in departInfo.data[0]) {
            if (key == "id") {
              continue;
            } else {
              departInfo.data[0][key] = treeData[key];
            }
          }
        });
      }
    };
    // 确定
    const chooseDepart_confirm = (data) => {
      if (departInfo.changeDepartId == -1) {
        root.$message({
          type: "warning",
          message: "未分组成员部门不能手动添加成员，请选择其他部门",
        });
      } else if (departInfo.changeDepartId == null) {
        root.$message({
          type: "warning",
          message: "请选择部门",
        });
      } else {
        root.$message({
          type: "success",
          message: `选择了"${departInfo.changeDepartLabel}"部门`,
        });
        props.modifyMemberInfo.depart = departInfo.changeDepartLabel;
        departInfo.visible = false;
        departInfo.id = data.id;
      }
    };
    // 设置每次只能选择一个节点
    const checkDepartNode = (checkedNodes) => {
      departInfo.changeDepartId = checkedNodes.id;
      departInfo.changeDepartLabel = checkedNodes.label;
      refs.chooseTree.setCheckedKeys([checkedNodes.id]);
    };
    /**挂载完成
     *
     */
    onMounted(() => {});
    return {
      ruleForm,
      rules,
      submitForm,
      resetForm,
      memberInfoBack,
      dateChange,
      handle,
      backHandle,
      handleClose,
      // 选择部门
      departInfo,
      chooseDepart,
      chooseDepart_confirm,
      checkDepartNode,
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
  #saveInfo {
    background-color: rgb(62, 138, 203);
    border-radius: 3px;
    border-color: #2084ca;
    color: #fff;
  }
  .modify_form {
    padding: 25px 60px 0 15px;
    .depart_box {
      padding-right: 3px;
      color: #606266;
      font-size: 14px;
      .depart_item {
        cursor: pointer;
        .depart {
          vertical-align: middle;
          margin-right: 3px;
        }
        .modifyInfoBtn {
          margin-left: 5px;
        }
      }
    }
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
  }
}

// tree 节点
.depart {
  vertical-align: middle;
  margin-right: 5px;
}
</style>