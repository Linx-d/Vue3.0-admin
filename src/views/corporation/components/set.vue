<template>
  <div class="body">
    <div class="tab_cnt">个人信息</div>
    <div class="logo">
      <div class="logo_zi">
        <img :src="employeeInfo.photo" />
      </div>
    </div>
    <div class="info">
      <div class="info_item">
        <div class="info_item_a">管理员名称</div>
        <div class="info_item_b">
          <i v-show="employeeInfo.name" v-html="employeeInfo.name"></i>
          <a hefr="javascript:;" class="modifyInfoBtn" @click="modifyStaffName">
            <span>修改</span>
          </a>
        </div>
      </div>
      <div class="info_item_center">
        <div class="info_item_center_a">联系电话</div>
        <div class="info_item_center_b">
          <i v-show="employeeInfo.tel">{{ employeeInfo.tel }}</i>
          <a hefr="javascript:;" class="modifyInfoBtn" @click="modifyStaffTel">
            <span v-if="employeeInfo.tel">修改</span>
            <span v-else>添加</span>
          </a>
        </div>
      </div>
      <div class="info_item">
        <div class="info_item_a">管理员身份</div>
        <div class="info_item_b">{{ employeeInfo.identity }}</div>
      </div>
    </div>
    <div class="info">
      <div class="info_item">
        <div class="info_item_a">管理的部门</div>
        <div class="info_item_b">{{ employeeInfo.departmentManagers }}</div>
      </div>
      <div class="info_item_center">
        <div class="info_item_center_a">企业ID</div>
        <div class="info_item_center_b">{{ employeeInfo.corpId }}</div>
      </div>
      <div class="info_item">
        <div class="info_item_a">管理员ID</div>
        <div class="info_item_b">{{ employeeInfo.corpUserId }}</div>
      </div>
    </div>
    <div class="tail">
      <div class="tail_item">
        <div class="tail_item_a">创建时间</div>
        <div class="tail_item_b">{{ employeeInfo.gmtCreate }}</div>
      </div>
      <div class="tail_item">
        <div class="tail_item_a">修改时间</div>
        <div class="tail_item_b">{{ employeeInfo.gmtModified }}</div>
      </div>
    </div>

    <!-- 修改名称 弹出框 -->
    <el-dialog
      title="修改名称"
      :visible.sync="modifyStaffData.dialogNameVisible"
      :before-close="modifyNameBefore"
    >
      <el-form
        :model="employeeInfo"
        :rules="rules"
        ref="employeeInfo"
        label-width="100px"
        class="employeeInfoClass"
      >
        <el-form-item label="名称" :label-width="modifyStaffData.formLabelWidth" prop="name">
          <el-input v-model="employeeName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyNameCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmNameOpen('employeeInfo')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改电话 弹出框 -->
    <el-dialog
      title="修改电话"
      :visible.sync="modifyStaffData.dialogTelVisible"
      :before-close="modifyBefore"
    >
      <el-form
        :model="employeeInfo"
        :rules="rules"
        ref="employeeInfo"
        label-width="100px"
        class="employeeInfoClass"
      >
        <el-form-item label="电话" :label-width="modifyStaffData.formLabelWidth" prop="tel">
          <el-input v-model="employeeInfo.tel" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyTelCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmTelOpen('employeeInfo')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getLoginEmployee, updateEmployee } from "@/api/employeeApi";
import { jssdk } from "@/utils/wxwork";
import { reactive, onMounted, watchEffect } from "@vue/composition-api";
export default {
  name: "corporationInfo",
  setup(props, { root, refs }) {
    let employeeInfo = reactive({
      id: null,
      corpId: "ww2e7b5f3c87c34c17",
      name: "测试",
      photo:
        "https://p.qlogo.cn/bizmail/x9CrcRIuFWvA8VQcstTibfPAsrpcpFulOZwapfGCNwjkJMVUibNl0kWA/0",
      tel: null,
      departmentManagers: "",
      gmtCreate: "2020-06-11 16:29:08",
      gmtModified: "2020-06-11T16:29:08",
      identity: "", // 身份
      corpUserId: 0,
      role: null
    });
    let employeeName = ref(employeeInfo.name);
    console.log(employeeName)
    getLoginEmployee().then(res => {
      let data = res.data;
      let roleId = data.role.id;
      if (roleId === 1) {
        employeeInfo.departmentManagers = "所有部门";
      } else {
        employeeInfo.departmentManagers = data.departmentManagers || "暂无";
      }
      employeeInfo.id = data.id;
      employeeInfo.name = data.name;
      //employeeInfo.photo = data.photo;
      employeeInfo.tel = data.tel;
      employeeInfo.gmtCreate = data.gmtCreate || "暂无";
      employeeInfo.gmtModified = data.gmtModified || "暂无";
      employeeInfo.corpUserId = data.corpUserId || "暂无";
      employeeInfo.identity = data.role.name || "暂无";
      employeeName = employeeInfo.name;
    });

    const modifyStaffData = reactive({
      dialogNameVisible: false,
      dialogTelVisible: false,
      formLabelWidth: "120px"
    });
    const rules = reactive({
      name: [
        { required: true, message: "请输入名称" },
        { min: 2, max: 5, message: "长度在 2 到 5 个字符" }
      ],
      tel: [
        { required: true, message: "请输入联系电话" },
        { min: 11, max: 11, message: "长度为 11 个字符" }
      ]
    });
    const submitNameForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          let modifyData = new URLSearchParams();
          modifyData.append("name", employeeInfo.name);
          modifyData.append("id", employeeInfo.id);
          updateEmployee(modifyData).then(res => {
            let code = res.code;
            if (code === 0) {
              root.$message({
                type: "success",
                message: "修改成功"
              });
              employeeInfo.name = employeeName;
              modifyStaffData.dialogNameVisible = false;
            } else {
              root.$message({
                type: "warning",
                message: res.msg
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    const submitTelForm = formName => {
      refs[formName].validate(valid => {
        if (valid) {
          let modifyData = new URLSearchParams();
          modifyData.append("tel", employeeInfo.tel);
          modifyData.append("id", employeeInfo.id);
          updateEmployee(modifyData).then(res => {
            let code = res.code;
            if (code === 0) {
              root.$message({
                type: "success",
                message: "修改成功"
              });
              modifyStaffData.dialogTelVisible = false;
            } else {
              root.$message({
                type: "warning",
                message: res.msg
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    const resetForm = formName => {
      refs[formName].resetFields();
    };

    const modifyStaffName = () => {
      employeeInfo.name = '';
      modifyStaffData.dialogNameVisible = true;
    };
    const modifyStaffTel = () => {
      modifyStaffData.dialogTelVisible = true;
    };
    const confirmNameOpen = data => {
      submitNameForm(data);
    };
    const confirmTelOpen = data => {
      submitTelForm(data);
    };
    const modifyNameCancle = () => {
      resetForm("employeeInfo");
      modifyStaffData.dialogNameVisible = false;
    };
    const modifyTelCancle = () => {
      resetForm("employeeInfo");
      modifyStaffData.dialogTelVisible = false;
    };
    const modifyBefore = () => {
      resetForm("employeeInfo");
      modifyStaffData.dialogNameVisible = false;
    };
    const modifyNameBefore = () => {
      resetForm("employeeInfo");
      modifyStaffData.dialogNameVisible = false;
    };
    watchEffect(() => {});
    onMounted(() => {});
    // -------------------------企业微信--------------------------------
    const callSDK = () => {
      let jsApiList = [];
      let fun = () => {
        WWOpenData.bindAll(document.getElementsByTagName("ww-open-data"));
      };
      jssdk(jsApiList, fun);
    };
    callSDK();
    const loadWWOpenData = () => {
      WWOpenData.bindAll(document.getElementsByTagName("ww-open-data"));
    };
    return {
      employeeInfo, employeeName,
      modifyStaffData,
      modifyStaffName,
      modifyStaffTel,
      confirmNameOpen,
      rules,
      modifyNameCancle,
      modifyBefore, modifyNameBefore,
      modifyTelCancle,
      confirmTelOpen,
      loadWWOpenData
    };
  }
};
</script>
<style lang="scss" scoped>
$mainWidth: 705px;
.body {
  padding: 15px 25px 15px;
  .tab_cnt {
    font-size: 18px;
    padding-left: 0%;
    padding-top: 5px;
    margin-bottom: 15px;
    padding-bottom: 20px;
    border-bottom: 1px solid #dce1e6;
  }
  .logo {
    height: 158px;
    border-bottom: 1px solid #e4e6e9;
    .logo_zi {
      height: 128px;
      width: 120px;
      padding-top: 30px;
      color: #787878;
      font-size: 14px;
      img {
        width: 200px;
      }
    }
  }
  .info {
    height: 94px;
    border-bottom: 1px solid #e4e6e9;
    padding: 20px 0;
    .info_item {
      height: 21px;
      line-height: 21px;
      .info_item_a {
        width: 120px;
        height: 100%;
        padding-right: 9px;
        color: #787878;
        font-size: 14px;
        float: left;
      }
      .info_item_b {
        width: $mainWidth;
        height: 100%;
        font-size: 14px;
        color: rgb(0, 0, 0);
        float: right;
      }
    }
    .info_item_center {
      height: 21px;
      line-height: 21px;
      padding: 16px 0;
      .info_item_center_a {
        width: 120px;
        height: 100%;
        padding-right: 9px;
        color: #787878;
        font-size: 14px;
        float: left;
      }
      .info_item_center_b {
        width: $mainWidth;
        height: 100%;
        font-size: 14px;
        color: rgb(0, 0, 0);
        float: right;
      }
    }
    i {
      font-style: normal;
      margin-right: 10px;
    }
  }
  .tail {
    height: 57px;
    padding: 20px 0;
    .tail_item {
      height: 21px;
      line-height: 21px;
      margin-bottom: 16px;
      .tail_item_a {
        width: 120px;
        height: 100%;
        padding-right: 9px;
        color: #787878;
        font-size: 14px;
        float: left;
      }
      .tail_item_b {
        width: $mainWidth;
        height: 100%;
        font-size: 14px;
        color: rgb(0, 0, 0);
        float: right;
      }
    }
    .tail_itemt {
      height: 21px;
      line-height: 21px;
      padding: 15px 0;
      .tail_itemt_a {
        width: 120px;
        height: 100%;
        padding-right: 9px;
        color: #787878;
        font-size: 14px;
        float: left;
      }
      .tail_itemt_b {
        width: $mainWidth;
        height: 100%;
        font-size: 14px;
        color: rgb(0, 0, 0);
        float: right;
      }
    }
  }
}
</style>