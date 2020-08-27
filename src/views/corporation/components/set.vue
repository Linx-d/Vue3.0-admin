<template>
  <div class="body">
    <div class="tab_cnt">个人信息</div>
    <div class="logo">
      <div class="logo_zi">
        <!-- <img :src="employeeInfo.photo" /> -->
        <svg-icon :iconClass="employeeInfo.photo" class="auth_icon"></svg-icon>
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
        <div class="info_item_center_a">联系方式</div>
        <div class="info_item_center_b">
          <i v-show="employeeInfo.tel">{{ employeeInfo.tel }}</i>
          <a hefr="javascript:;" class="modifyInfoBtn" @click="modifyStaffTel">
            <span v-if="employeeInfo.tel">修改</span>
            <span v-else>添加</span>
          </a>
        </div>
      </div>
      <div class="info_item_center memberEmail">
        <div class="info_item_center_a">电子邮箱</div>
        <div class="info_item_center_b">
          <i v-show="employeeInfo.email">{{ employeeInfo.email }}</i>
          <a hefr="javascript:;" class="modifyInfoBtn" @click="modifyStaffEmail">
            <span v-if="employeeInfo.email">修改</span>
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
      <div class="info_item_center">
        <div class="info_item_center_a">企业ID</div>
        <div class="info_item_center_b">{{ employeeInfo.corpId }}</div>
      </div>
      <div class="info_item">
        <div class="info_item_a">管理员ID</div>
        <div class="info_item_b">{{ employeeInfo.corpUserId }}</div>
      </div>
      <div class="departManagersBox" v-if="employeeInfo.roleId!=3">
        <div class="departManagers_title">管理范围</div>
        <div class="departManagers" :title="employeeInfo.departmentManagers">
          <div v-if="employeeInfo.departmentManagers">{{ employeeInfo.departmentManagers }}</div>
          <div v-else>
            <div>暂无</div>
          </div>
        </div>
      </div>
      <div class="departManagersBoxAll" v-else>
        <div class="departManagers_title">管理范围</div>
        <div class="departManagers" v-if="employeeInfo.departmentManagers">
          <div
            v-for="depart in employeeInfo.departmentManagers"
            :key="depart.id"
            class="departContent"
          >
            <div class="depart_item item_margin-bottom" :title="depart">
              <svg-icon iconClass="depart" class="departSvg"></svg-icon>
              <span>{{ depart }}</span>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="depart_none">暂无</div>
        </div>
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
      :close-on-click-modal="false"
    >
      <el-form
        :model="employeeInfo"
        :rules="rules"
        ref="employeeInfo"
        label-width="100px"
        class="employeeInfoClass"
      >
        <el-form-item label="名称" :label-width="modifyStaffData.formLabelWidth" prop="name">
          <el-input
            v-model="employeeName.name"
            autocomplete="off"
            maxlength="20"
            @input="inputDetection"
            @keyup.enter.native="confirmNameOpen('employeeInfo')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyNameCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmNameOpen('employeeInfo')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改联系方式 弹出框 -->
    <el-dialog
      title="修改联系方式"
      :visible.sync="modifyStaffData.dialogTelVisible"
      :before-close="modifyTelBefore"
      :close-on-click-modal="false"
    >
      <el-form
        :model="employeeInfo"
        :rules="rules"
        ref="employeeInfo"
        label-width="100px"
        class="employeeInfoClass"
      >
        <el-form-item label="联系方式" :label-width="modifyStaffData.formLabelWidth" prop="tel">
          <el-input
            v-model="employeeInfo.tel"
            autocomplete="off"
            @keyup.enter.native="confirmTelOpen('employeeInfo')"
            maxlength="20"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyTelCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmTelOpen('employeeInfo')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改电子邮箱 弹出框 -->
    <el-dialog
      title="修改电子邮箱"
      :visible.sync="modifyStaffData.dialogEmailVisible"
      :before-close="modifyEmailBefore"
      :close-on-click-modal="false"
    >
      <el-form
        :model="employeeInfo"
        :rules="rules"
        ref="employeeInfo"
        label-width="100px"
        class="employeeInfoClass"
      >
        <el-form-item label="Email" :label-width="modifyStaffData.formLabelWidth" prop="email">
          <el-input
            v-model="employeeInfo.email"
            autocomplete="off"
            @keyup.enter.native="confirmEmailOpen('employeeInfo')"
            maxlength="20"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyEmailCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmEmailOpen('employeeInfo')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getLoginEmployee,
  updateEmployee,
  selectEmpDepRoleByEmpId,
  updateEmployeeNotAuth,
} from "@/api/employeeApi";
import { jssdk } from "@/utils/wxwork";
import { reactive, onMounted, watchEffect, ref } from "@vue/composition-api";
export default {
  name: "corporationInfo",
  setup(props, { root, refs }) {
    let employeeInfo = reactive({
      id: null,
      corpId: "ww2e7b5f3c87c34c17",
      name: "",
      photo:
        "https://p.qlogo.cn/bizmail/x9CrcRIuFWvA8VQcstTibfPAsrpcpFulOZwapfGCNwjkJMVUibNl0kWA/0",
      email: "",
      tel: null,
      departmentManagers: null,
      gmtCreate: "2020-06-11 16:29:08",
      gmtModified: "2020-06-11T16:29:08",
      identity: "", // 身份
      corpUserId: 0,
      role: null,
      roleId: null,
      managersStatus: true,
    });
    let employeeName = reactive({
      name: "",
    });

    getLoginEmployee().then((res) => {
      let data = res.data;
      let roleId = data.role ? data.role.id : null;
      employeeInfo.id = data.id;
      employeeInfo.name = data.name;
      employeeInfo.tel = data.tel;
      employeeInfo.email = data.email;
      employeeInfo.gmtCreate = data.gmtCreate || "暂无";
      employeeInfo.gmtModified = data.gmtModified || "暂无";
      employeeInfo.corpUserId = data.corpUserId || "暂无";
      employeeInfo.identity = data.role ? data.role.name : "暂无";
      employeeInfo.role = data.role || "暂无";
      employeeInfo.roleId = employeeInfo.role.id;
      employeeInfo.corpId = employeeInfo.corpId;
      if (roleId === 1) {
        employeeInfo.departmentManagers = "所有部门";
        employeeInfo.photo = "superManager";
      } else if (roleId === 2) {
        employeeInfo.departmentManagers = "所有部门";
        employeeInfo.photo = "normalManager";
      } else if (roleId === null) {
        employeeInfo.departmentManagers = null;
        employeeInfo.photo = "departManager_no";
      } else {
        employeeInfo.photo = "departManager";
        let departManagers = data.departmentManagers;
        employeeInfo.departmentManagers = [];
        if (departManagers != null && departManagers.length > 0) {
          selectEmpDepRoleByEmpId(data.id).then((response) => {
            let len = response.data.length;
            if (len > 5) {
              employeeInfo.managersStatus = true;
            }
            response.data.forEach((item, index) => {
              employeeInfo.departmentManagers.push(item.depName);
            });
          });
        } else {
          employeeInfo.departmentManagers = null;
        }
      }
    });

    const modifyStaffData = reactive({
      dialogNameVisible: false,
      dialogTelVisible: false,
      dialogEmailVisible: false,
      formLabelWidth: "120px",
    });
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
    const validateEmail = (rule, value, callback) => {
      let exp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; // 匹配Email地址
      let len = value.length;
      if (value === "") {
        callback(new Error("请输入Email"));
      } else if (!exp.test(value)) {
        callback(new Error("请输入正确的Email"));
      } else {
        callback();
      }
    };
    const rules = reactive({
      name: [
      ],
      tel: [{ validator: validateTel }],
      email: [{ validator: validateEmail }],
    });
    const submitNameForm = (formName) => {
      refs[formName].validate((valid) => {
        if (valid) {
          let modifyData = new URLSearchParams();
          modifyData.append("name", employeeName.name);
          modifyData.append("id", employeeInfo.id);
          updateEmployeeNotAuth(modifyData).then((res) => {
            let code = res.code;
            if (code === 0) {
              employeeInfo.name = employeeName.name;
              modifyStaffData.dialogNameVisible = false;
              root.$message({
                type: "success",
                message: "修改成功",
              });
            } else {
              root.$message({
                type: "warning",
                message: res.msg,
              });
            }
          });
        } else {
          return false;
        }
      });
    };
    const submitTelForm = (formName) => {
      refs[formName].validate((valid) => {
        if (valid) {
          let modifyData = new URLSearchParams();
          modifyData.append("tel", employeeInfo.tel);
          modifyData.append("id", employeeInfo.id);
          updateEmployeeNotAuth(modifyData).then((res) => {
            let code = res.code;
            if (code === 0) {
              root.$message({
                type: "success",
                message: "修改成功",
              });
              modifyStaffData.dialogTelVisible = false;
            } else {
              root.$message({
                type: "warning",
                message: res.msg,
              });
            }
          });
        } else {
          return false;
        }
      });
    };
    const submitEmailForm = (formName) => {
      refs[formName].validate((valid) => {
        if (valid) {
          let modifyData = new URLSearchParams();
          modifyData.append("email", employeeInfo.email);
          modifyData.append("id", employeeInfo.id);
          updateEmployeeNotAuth(modifyData).then((res) => {
            let code = res.code;
            if (code === 0) {
              root.$message({
                type: "success",
                message: "修改成功",
              });
              modifyStaffData.dialogEmailVisible = false;
            } else {
              root.$message({
                type: "warning",
                message: res.msg,
              });
            }
          });
        } else {
          return false;
        }
      });
    };
    const resetForm = (formName) => {
      refs[formName].resetFields();
    };

    const modifyStaffName = () => {
      let len = employeeInfo.name.length;
      if (len < 10) {
        employeeName.name = employeeInfo.name;
      }
      modifyStaffData.dialogNameVisible = true;
    };
    const modifyStaffTel = () => {
      modifyStaffData.dialogTelVisible = true;
    };
    const modifyStaffEmail = () => {
      modifyStaffData.dialogEmailVisible = true;
    };
    const confirmNameOpen = (data) => {
      let patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、''；‘'，。、]/im;
      if (patrn.test(employeeName.name)) {
        root.$message({
          type: "error",
          message: "名称不能有字符",
        });
      } else {
        submitNameForm(data);
      }
    };
    const confirmTelOpen = (data) => {
      submitTelForm(data);
    };
    const confirmEmailOpen = (data) => {
      submitEmailForm(data);
    };
    const modifyNameCancle = () => {
      resetForm("employeeInfo");
      modifyStaffData.dialogNameVisible = false;
    };
    const modifyNameBefore = () => {
      resetForm("employeeInfo");
      modifyStaffData.dialogNameVisible = false;
    };
    const modifyTelCancle = () => {
      resetForm("employeeInfo");
      modifyStaffData.dialogTelVisible = false;
    };
    const modifyTelBefore = () => {
      resetForm("employeeInfo");
      modifyStaffData.dialogTelVisible = false;
    };
    const modifyEmailCancle = () => {
      resetForm("employeeInfo");
      modifyStaffData.dialogEmailVisible = false;
    };
    const modifyEmailBefore = () => {
      resetForm("employeeInfo");
      modifyStaffData.dialogEmailVisible = false;
    };

    /**修改名称限制输入特殊字符 */
    const inputDetection = () => {
      let str = employeeName.name;
      let patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、''；‘'，。、]/im;
      if (patrn.test(str)) {
        root.$message({
          type: "error",
          message: "名称不能有字符",
        });
      }
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
      employeeInfo,
      employeeName,
      modifyStaffData,
      modifyStaffEmail,
      modifyStaffName,
      modifyStaffTel,
      confirmNameOpen,
      rules,
      modifyNameCancle,
      modifyNameBefore,
      modifyTelCancle,
      confirmTelOpen,
      confirmEmailOpen,
      loadWWOpenData,
      inputDetection,
      modifyEmailCancle,
      modifyEmailBefore,
      modifyTelBefore,
    };
  },
};
</script>
<style lang="scss" scoped>
$mainWidth: 80%;
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
      color: #787878;
      font-size: 14px;
      .auth_icon {
        width: 150%;
        height: 100%;
      }
    }
  }
  .info {
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
    .memberEmail {
      padding-top: 0;
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
  .departManagersBox {
    margin-top: 16px;
    height: 21px;
    .departManagers_title {
      padding-top: 0;
    }
    .departManagers {
      float: right;
      width: 80%;
    }
  }
  .departManagersBoxAll {
    margin-top: 8px;
    overflow: hidden;
    .departManagers {
      float: left;
      margin-left: 45px;
      .depart_item {
        margin-right: 20px;
        margin-bottom: 15px;
      }
    }
    .depart_none {
      width: 120px;
      height: 100%;
      padding-right: 9px;
      font-size: 14px;
      float: left;
      padding-top: 9px;
      margin-left: 48px;
    }
  }
  .departManagers_title {
    width: 120px;
    height: 100%;
    padding-right: 9px;
    color: #787878;
    font-size: 14px;
    float: left;
    padding-top: 9px;
  }
}
</style>
