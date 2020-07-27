<template>
  <div class="body">
    <div class="tab_cnt">企业信息</div>
    <div class="logo">
      <div class="logo_zi">
        <img :src="corpInfo.logoUrl" />
      </div>
    </div>
    <div class="info">
      <div class="info_item">
        <div class="info_item_a">企业名称</div>
        <div class="info_item_b">
          <i v-show="corpInfo.name">{{ corpInfo.name }}</i>
          <a hefr="javascript:;" class="modifyInfoBtn" @click="modifycorpName" v-if="employeeInfo.roleId!=3">
            <span v-if="corpInfo.name">修改</span>
            <span v-else>添加</span>
          </a>
        </div>
      </div>
      <div class="info_item_center">
        <div class="info_item_center_a">企业地址</div>
        <div class="info_item_center_b">
          <i v-show="corpInfo.address">{{ corpInfo.address }}</i>
          <a hefr="javascript:;" class="modifyInfoBtn" @click="modifycorpAddress" v-if="employeeInfo.roleId!=3">
            <span v-if="corpInfo.address">修改</span>
            <span v-else>添加</span>
          </a>
        </div>
      </div>
      <div class="info_item">
        <div class="info_item_a">联系电话</div>
        <div class="info_item_b">
          <i v-show="corpInfo.tel">{{ corpInfo.tel }}</i>
          <a hefr="javascript:;" class="modifyInfoBtn" @click="modifycorpTel" v-if="employeeInfo.roleId!=3">
            <span v-if="corpInfo.tel">修改</span>
            <span v-else>添加</span>
          </a>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="info_item">
        <div class="info_item_a">企业成员</div>
        <div class="info_item_b">{{ corpInfo.member }}</div>
      </div>
      <div class="info_item_center">
        <div class="info_item_center_a">企业部门</div>
        <div class="info_item_center_b">{{ corpInfo.departmentNum }}</div>
      </div>
      <div class="info_item">
        <div class="info_item_a">企业员工</div>
        <div class="info_item_b">{{ corpInfo.employeeNum }}</div>
      </div>
    </div>
    <div class="tail">
      <div class="tail_item">
        <div class="tail_item_a">创建时间</div>
        <div class="tail_item_b">{{ corpInfo.gmtCreate }}</div>
      </div>
      <div class="tail_itemt">
        <div class="tail_itemt_a">企业ID</div>
        <div class="tail_itemt_b">{{ corpInfo.id }}</div>
      </div>
    </div>

    <!-- 修改企业名称 弹出框 -->
    <el-dialog
      title="修改企业名称"
      :visible.sync="modifyCorpData.dialogNameVisible"
      :before-close="modifyBefore"
    >
      <el-form
        :model="corpInfo"
        :rules="rules"
        ref="corpInfo"
        label-width="100px"
        class="corpInfoClass"
      >
        <el-form-item label="企业名称" :label-width="modifyCorpData.formLabelWidth" prop="name">
          <el-input v-model="corpInfo.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyNameCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmNameOpen()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改企业电话 弹出框 -->
    <el-dialog
      title="修改企业电话"
      :visible.sync="modifyCorpData.dialogTelVisible"
      :before-close="modifyBefore"
    >
      <el-form
        :model="corpInfo"
        :rules="rules"
        ref="corpInfo"
        label-width="100px"
        class="corpInfoClass"
      >
        <el-form-item label="企业电话" :label-width="modifyCorpData.formLabelWidth" prop="tel">
          <el-input v-model="corpInfo.tel" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyTelCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmTelOpen()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改企业地址 弹出框 -->
    <el-dialog
      title="修改企业地址"
      :visible.sync="modifyCorpData.dialogAddressVisible"
      :before-close="modifyBefore"
    >
      <el-form
        :model="corpInfo"
        :rules="rules"
        ref="corpInfo"
        label-width="100px"
        class="corpInfoClass"
      >
        <el-form-item label="企业地址" :label-width="modifyCorpData.formLabelWidth" prop="address">
          <el-input v-model="corpInfo.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyAddressCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmAddressOpen()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCorpInfo, updateCorporation } from "@/api/corporationApi";
import { getLoginEmployee } from "@/api/employeeApi";
import { reactive, onMounted, watchEffect } from "@vue/composition-api";
export default {
  name: "corporationInfo",
  setup(props, { root, refs }) {
    /**登录人员信息
     * 
     */
    let employeeInfo = reactive({
      id: null,
      corpId: "ww2e7b5f3c87c34c17",
      name: "",
      photo:
        "https://p.qlogo.cn/bizmail/x9CrcRIuFWvA8VQcstTibfPAsrpcpFulOZwapfGCNwjkJMVUibNl0kWA/0",
      tel: null,
      gmtCreate: "2020-06-11 16:29:08",
      gmtModified: "2020-06-11T16:29:08",
      identity: "", // 身份
      corpUserId: 0,
      role: null,
      roleId: null
    });
    getLoginEmployee().then(res => {
      let data = res.data;
      let roleId = data.role.id;
      employeeInfo.id = data.id;
      employeeInfo.name = data.name;
      //employeeInfo.photo = data.photo;
      employeeInfo.tel = data.tel;
      employeeInfo.gmtCreate = data.gmtCreate || "暂无";
      employeeInfo.gmtModified = data.gmtModified || "暂无";
      employeeInfo.corpUserId = data.corpUserId || "暂无";
      employeeInfo.identity = data.role.name || "暂无";
      employeeInfo.role = data.role || "暂无";
      employeeInfo.roleId = employeeInfo.role.id;
    });
    /**企业信息
     * 
     */
    let corpInfo = reactive({
      id: "ww2e7b5f3c87c34c17",
      name: "测试",
      logoUrl:
        "https://p.qlogo.cn/bizmail/x9CrcRIuFWvA8VQcstTibfPAsrpcpFulOZwapfGCNwjkJMVUibNl0kWA/0",
      tel: "",
      address: "",
      gmtCreate: "2020-06-11 16:29:08",
      gmtModified: "2020-06-11T16:29:08",
      member: 1000,
      employeeNum: 0,
      departmentNum: 0
    });
    getCorpInfo().then(response => {
      let data = response.data;
      for (let key in data) {
        corpInfo[key] = data[key];
      }
    });

    const modifyCorpData = reactive({
      dialogNameVisible: false,
      dialogTelVisible: false,
      dialogAddressVisible: false,
      formLabelWidth: "120px"
    });
    const rules = reactive({
      name: [
        { required: true, message: "请输入名称" },
        { min: 2, max: 5, message: "长度在 2 到 5 个字符" }
      ],
      tel: [
        { required: true, message: "请输入联系电话" },
        { min: 2, max: 25, message: "长度在 2 到 25 个字符" }
      ],
      address: [
        { required: true, message: "请输入地址" },
        { min: 2, max: 25, message: "长度在 2 到 25 个字符" }
      ]
    });
    const submitForm = (formName, key, val, status) => {
      refs[formName].validate(valid => {
        if (valid) {
          let modifyData = {};
          modifyData[key] = val;
          updateCorporation(modifyData).then(res => {
            let code = res.code;
            if (code === 0) {
              root.$message({
                type: "success",
                message: "修改成功"
              });
              modifyCorpData[status] = false;
            } else {
              root.$message({
                type: "warning",
                message: res.msg
              });
            }
          });
        } else {
          return false;
        }
      });
    };
    const resetForm = formName => {
      refs[formName].resetFields();
    };
    const modifycorpName = () => {
      modifyCorpData.dialogNameVisible = true;
    };
    const modifycorpTel = () => {
      modifyCorpData.dialogTelVisible = true;
    };
    const modifycorpAddress = () => {
      modifyCorpData.dialogAddressVisible = true;
    };
    const confirmNameOpen = () => {
      submitForm('corpInfo', 'name', corpInfo.name, 'dialogNameVisible');
    };
    const confirmTelOpen = () => {
      submitForm('corpInfo', 'tel', corpInfo.tel, 'dialogTelVisible');
    };
    const confirmAddressOpen = () => {
      submitForm('corpInfo', 'address', corpInfo.address, 'dialogAddressVisible');
    };
    const modifyNameCancle = () => {
      resetForm("corpInfo");
      modifyCorpData.dialogNameVisible = false;
    };
    const modifyTelCancle = () => {
      resetForm("corpInfo");
      modifyCorpData.dialogTelVisible = false;
    };
    const modifyAddressCancle = () => {
      resetForm("corpInfo");
      modifyCorpData.dialogAddressVisible = false;
    };
    const modifyBefore = () => {
      resetForm("corpInfo");
      modifyCorpData.dialogNameVisible = false;
      modifyCorpData.dialogTelVisible = false;
      modifyCorpData.dialogAdressVisible = false;
    };
    watchEffect(() => {});
    onMounted(() => {});
    return {
      corpInfo,
      rules,
      modifyCorpData,
      modifyBefore,
      modifyNameCancle, modifyTelCancle, modifyAddressCancle,
      modifycorpName, modifycorpTel, modifycorpAddress,
      confirmNameOpen, confirmTelOpen, confirmAddressOpen,
      employeeInfo
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