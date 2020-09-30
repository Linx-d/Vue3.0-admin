<template>
  <div class="body">
    <div class="tab_cnt">企业信息</div>
    <div class="logo">
      <div class="logo_zi">
        <div
          class="logo_box"
          @click="modifyHandle('logoUrl')"
          @mouseenter="imgMask(true)"
          @mouseleave="imgMask(false)"
        >
          <img :src="corpInfo.logoUrl" />
          <div class="logo_mask" v-show="imgData.visible">
            <svg-icon iconClass="take_photo" class="take_photo"></svg-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="info_item">
        <div class="info_item_a">企业名称</div>
        <div class="info_item_b">
          <i v-show="corpInfo.name">{{ corpInfo.name }}</i>
          <span v-if="employeeInfo.roleId!=1">
            <i v-show="!corpInfo.name">暂无</i>
          </span>
          <a
            hefr="javascript:;"
            class="modifyInfoBtn"
            @click="modifyHandle('name')"
            v-if="employeeInfo.roleId==1"
          >
            <span v-if="corpInfo.name">修改</span>
            <span v-else>添加</span>
          </a>
        </div>
      </div>
      <div class="info_item_center">
        <div class="info_item_center_a">企业地址</div>
        <div class="info_item_center_b">
          <i v-show="corpInfo.address">{{ corpInfo.address }}</i>
          <span v-if="employeeInfo.roleId!=1">
            <i v-show="!corpInfo.address">暂无</i>
          </span>
          <a
            hefr="javascript:;"
            class="modifyInfoBtn"
            @click="modifyHandle('address')"
            v-if="employeeInfo.roleId==1"
          >
            <span v-if="corpInfo.address">修改</span>
            <span v-else>添加</span>
          </a>
        </div>
      </div>
      <div class="info_item">
        <div class="info_item_a">联系电话</div>
        <div class="info_item_b">
          <i v-show="corpInfo.tel">{{ corpInfo.tel }}</i>
          <span v-if="employeeInfo.roleId!=1">
            <i v-show="!corpInfo.tel">暂无</i>
          </span>
          <a
            hefr="javascript:;"
            class="modifyInfoBtn"
            @click="modifyHandle('tel')"
            v-if="employeeInfo.roleId==1"
          >
            <span v-if="corpInfo.tel">修改</span>
            <span v-else>添加</span>
          </a>
        </div>
      </div>
      <div class="info_item_center">
        <div class="info_item_center_a">企业座机</div>
        <div class="info_item_center_b">
          <i v-show="corpInfo.landline">{{ corpInfo.landline }}</i>
          <span v-if="employeeInfo.roleId!=1">
            <i v-show="!corpInfo.landline">暂无</i>
          </span>
          <a
            hefr="javascript:;"
            class="modifyInfoBtn"
            @click="modifyHandle('landline')"
            v-if="employeeInfo.roleId==1"
          >
            <span v-if="corpInfo.landline">修改</span>
            <span v-else>添加</span>
          </a>
        </div>
      </div>
      <div class="info_item">
        <div class="info_item_a">电子邮箱</div>
        <div class="info_item_b">
          <i v-show="corpInfo.email">{{ corpInfo.email }}</i>
          <span v-if="employeeInfo.roleId!=1">
            <i v-show="!corpInfo.email">暂无</i>
          </span>
          <a
            hefr="javascript:;"
            class="modifyInfoBtn"
            @click="modifyHandle('email')"
            v-if="employeeInfo.roleId==1"
          >
            <span v-if="corpInfo.email">修改</span>
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
        <div class="info_item_a">管理人员</div>
        <div class="info_item_b">{{ corpInfo.employeeNum }}</div>
      </div>
    </div>
    <div class="tail">
      <div class="tail_item">
        <div class="tail_item_a">企业ID</div>
        <div class="tail_item_b">{{ corpInfo.id }}</div>
      </div>
      <div class="tail_itemt">
        <div class="tail_itemt_a">创建时间</div>
        <div class="tail_itemt_b">{{ corpInfo.gmtCreate }}</div>
      </div>
    </div>
    <!-- 修改企业名称 弹出框 -->
    <el-dialog
      title="修改企业名称"
      class="universal_dialog"
      :visible.sync="modifyCorpData.dialogNameVisible"
      :before-close="modifyCancle"
      :close-on-click-modal="false"
    >
      <el-form
        :model="corpInfoModify"
        :rules="rules"
        ref="corpInfoModify"
        label-width="100px"
        class="corpInfoClass"
      >
        <el-form-item label="企业名称" :label-width="modifyCorpData.formLabelWidth" prop="name">
          <el-input
            v-model="corpInfoModify.name"
            autocomplete="off"
            maxlength="20"
            @keyup.enter.native="confirmOpen('name')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmOpen('name')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改联系电话 弹出框 -->
    <el-dialog
      title="修改联系电话"
      class="universal_dialog"
      :visible.sync="modifyCorpData.dialogTelVisible"
      :before-close="modifyCancle"
      :close-on-click-modal="false"
    >
      <el-form
        :model="corpInfoModify"
        :rules="rules"
        ref="corpInfoModify"
        label-width="100px"
        class="corpInfoClass"
      >
        <el-form-item label="联系电话" :label-width="modifyCorpData.formLabelWidth" prop="tel">
          <el-input
            v-model="corpInfoModify.tel"
            autocomplete="off"
            @keyup.enter.native="confirmOpen('tel')"
            maxlength="20"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmOpen('tel')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改企业地址 弹出框 -->
    <el-dialog
      title="修改企业地址"
      class="universal_dialog"
      :visible.sync="modifyCorpData.dialogAddressVisible"
      :before-close="modifyCancle"
      :close-on-click-modal="false"
    >
      <el-form
        :model="corpInfoModify"
        :rules="rules"
        ref="corpInfoModify"
        label-width="100px"
        class="corpInfoClass"
      >
        <el-form-item label="企业地址" :label-width="modifyCorpData.formLabelWidth" prop="address">
          <el-input
            v-model="corpInfoModify.address"
            autocomplete="off"
            maxlength="20"
            @keyup.enter.native="confirmOpen('address')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmOpen('address')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改企业座机 弹出框 -->
    <el-dialog
      title="修改企业座机"
      class="universal_dialog"
      :visible.sync="modifyCorpData.dialogLandlineVisible"
      :before-close="modifyCancle"
      :close-on-click-modal="false"
    >
      <el-form
        :model="corpInfoModify"
        :rules="rules"
        ref="corpInfoModify"
        label-width="100px"
        class="corpInfoClass"
      >
        <el-form-item label="企业座机" :label-width="modifyCorpData.formLabelWidth" prop="landline">
          <el-input
            v-model="corpInfoModify.landline"
            autocomplete="off"
            @keyup.enter.native="confirmOpen('landline')"
            maxlength="20"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmOpen('landline')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改企业邮箱 弹出框 -->
    <el-dialog
      title="修改企业邮箱"
      class="universal_dialog"
      :visible.sync="modifyCorpData.dialogEmailVisible"
      :before-close="modifyCancle"
      :close-on-click-modal="false"
    >
      <el-form
        :model="corpInfoModify"
        :rules="rules"
        ref="corpInfoModify"
        label-width="100px"
        class="corpInfoClass"
      >
        <el-form-item label="企业邮箱" :label-width="modifyCorpData.formLabelWidth" prop="email">
          <el-input
            v-model="corpInfoModify.email"
            autocomplete="off"
            @keyup.enter.native="confirmOpen('email')"
            maxlength="20"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmOpen('email')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改企业头像 弹出框 -->
    <el-dialog
      id="modify_photo"
      title="修改企业头像"
      class="universal_dialog"
      :visible.sync="modifyCorpData.dialogLogoUrlVisible"
      :before-close="modifyCancle"
      :close-on-click-modal="false"
    >
      <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="imgData.url" :src="imgData.url" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyCancle()">取 消</el-button>
        <el-button type="primary" @click="confirmOpen('logoUrl')">确 定</el-button>
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
      roleId: null,
    });
    getLoginEmployee().then((res) => {
      let data = res.data;
      let roleId = data.role ? data.role.id : null;
      employeeInfo.id = data.id;
      employeeInfo.name = data.name;
      //employeeInfo.photo = data.photo;
      employeeInfo.tel = data.tel;
      employeeInfo.gmtCreate = data.gmtCreate || "暂无";
      employeeInfo.gmtModified = data.gmtModified || "暂无";
      employeeInfo.corpUserId = data.corpUserId || "暂无";
      employeeInfo.identity = data.role ? data.role.name : "暂无";
      employeeInfo.role = data.role || "暂无";
      employeeInfo.roleId = employeeInfo.role ? employeeInfo.role.id : null;
    });
    /**企业信息
     *
     */
    // 与view绑定
    let corpInfo = reactive({
      id: "ww2e7b5f3c87c34c17",
      name: "测试",
      logoUrl:
        "https://p.qlogo.cn/bizmail/x9CrcRIuFWvA8VQcstTibfPAsrpcpFulOZwapfGCNwjkJMVUibNl0kWA/0",
      tel: "",
      email: "",
      landline: "",
      address: "",
      gmtCreate: "2020-06-11 16:29:08",
      gmtModified: "2020-06-11T16:29:08",
      member: 1000,
      employeeNum: 0,
      departmentNum: 0,
    });
    // 用于修改的企业信息
    let corpInfoModify = reactive({
      id: "ww2e7b5f3c87c34c17",
      name: "测试",
      logoUrl:
        "https://p.qlogo.cn/bizmail/x9CrcRIuFWvA8VQcstTibfPAsrpcpFulOZwapfGCNwjkJMVUibNl0kWA/0",
      tel: "",
      email: "",
      landline: "",
      address: "",
      gmtCreate: "2020-06-11 16:29:08",
      gmtModified: "2020-06-11T16:29:08",
      member: 1000,
      employeeNum: 0,
      departmentNum: 0,
    });
    getCorpInfo().then((response) => {
      let data = response.data;
      for (let key in data) {
        corpInfo[key] = corpInfoModify[key] = data[key];
      }
    });

    const modifyCorpData = reactive({
      dialogNameVisible: false,
      dialogTelVisible: false,
      dialogAddressVisible: false,
      dialogLandlineVisible: false,
      dialogEmailVisible: false,
      dialogLogoUrlVisible: false,
      formLabelWidth: "120px",
    });
    /**上传头像
     *
     */
    const imgData = reactive({
      visible: false,
      url: "",
      file: "",
    });
    const imgMask = (data) => {
      return;
      if (data) {
        imgData.visible = true;
      } else {
        imgData.visible = false;
      }
    };
    const handleAvatarSuccess = (res, file) => {
      imgData.url = URL.createObjectURL(file.raw);
      imgData.file = file;
    };
    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 0.512;

      if (!isJPG) {
        root.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        root.$message.error("上传头像图片大小不能超过 512KB!");
      }
      return isJPG && isLt2M;
    };

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
    const validateLandline = (rule, value, callback) => {
      let exp = /0\d{2,3}-[1-9]\d{6,7}/; // 匹配区号3到4位，电话7到8位的固定电话号码
      let len = value.length;
      if (value === "") {
        callback(new Error("请输入座机"));
      } else if (!exp.test(value)) {
        callback(new Error("请输入正确的座机"));
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
        { message: "请输入名称" },
        { min: 2, max: 20, message: "长度在 2 到 20 个字符" },
      ],
      tel: [{ validator: validateTel }],
      landline: [{ validator: validateLandline }],
      address: [
        { message: "请输入地址" },
        { min: 2, max: 20, message: "长度在 2 到 20 个字符" },
      ],
      email: [{ validator: validateEmail }],
    });
    const submitForm = (formName, key, val, status) => {
      if (key == "logoUrl") {
        let modifyData = new FormData();
        modifyData.append(key, val);
        modifyData.append('name', corpInfo.name);
        updateCorporation(modifyData).then((res) => {
          let code = res.code;
          if (code === 0) {
            if (key == "name") {
              root.$store.commit("SET_CORPORINFO");
            }
            root.$message({
              type: "success",
              message: "修改成功",
            });
            imgData.file = "";

            modifyCorpData[status] = false;
            let myGeo = new BMap.Geocoder();
            myGeo.getPoint(
              val,
              function (point) {
                if (point) {
                  sessionStorage.setItem("corpAddress", JSON.stringify(point));
                } else {
                  root.$message({
                    type: "warning",
                    message: "您选取的地址没有获取到解析结果",
                  });
                }
              },
              "北京市"
            );
          } else {
            root.$message({
              type: "warning",
              message: res.msg,
            });
          }
        });
      } else {
        refs[formName].validate((valid) => {
          if (valid) {
            let modifyData = new URLSearchParams();
            modifyData.append(key, val);
            updateCorporation(modifyData).then((res) => {
              let code = res.code;
              if (code === 0) {
                if (key == "name") {
                  root.$store.commit("SET_CORPORINFO");
                }
                root.$message({
                  type: "success",
                  message: "修改成功",
                });
                refs[formName].model[key] = val;
                if (key == "logoUrl") {
                  corpInfo[key] = res.data.logoUrl;
                } else {
                  corpInfo[key] = val;
                }
                modifyCorpData[status] = false;
                let myGeo = new BMap.Geocoder();
                myGeo.getPoint(
                  val,
                  function (point) {
                    if (point) {
                      sessionStorage.setItem(
                        "corpAddress",
                        JSON.stringify(point)
                      );
                    } else {
                      root.$message({
                        type: "warning",
                        message: "您选取的地址没有获取到解析结果",
                      });
                    }
                  },
                  "北京市"
                );
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
      }
    };
    const resetForm = (formName) => {
      corpInfoModify = corpInfo;
      refs[formName].resetFields();
    };
    const modifyHandle = (data) => {
      switch (data) {
        case "name":
          modifyCorpData.dialogNameVisible = true;
          break;
        case "tel":
          modifyCorpData.dialogTelVisible = true;
          break;
        case "landline":
          modifyCorpData.dialogLandlineVisible = true;
          break;
        case "address":
          modifyCorpData.dialogAddressVisible = true;
          break;
        case "email":
          modifyCorpData.dialogEmailVisible = true;
          break;
        case "logoUrl":
          return;
          modifyCorpData.dialogLogoUrlVisible = true;
          break;
      }
    };
    const confirmOpen = (data) => {
      let str = "";
      switch (data) {
        case "name":
          str = "dialogNameVisible";
          break;
        case "tel":
          str = "dialogTelVisible";
          break;
        case "address":
          str = "dialogAddressVisible";
          break;
        case "email":
          str = "dialogEmailVisible";
          break;
        case "landline":
          str = "dialogLandlineVisible";
          break;
        case "logoUrl":
          str = "dialogLogoUrlVisible";
          break;
      }
      if (data == "logoUrl") {
        submitForm("corpInfoModify", [data], imgData.file, str);
      } else {
        submitForm("corpInfoModify", [data], corpInfoModify[data], str);
      }
    };

    const modifyCancle = () => {
      for (let key in modifyCorpData) {
        if (key == "formLabelWidth") continue;
        modifyCorpData[key] = false;
      }
      for (let key in corpInfo) {
        corpInfoModify[key] = corpInfo[key];
      }
    };
    watchEffect(() => {});
    onMounted(() => {});
    return {
      // 修改企业信息
      corpInfo,
      corpInfoModify,
      rules,
      modifyCorpData,
      modifyCancle,
      modifyHandle,
      confirmOpen,
      employeeInfo,
      // 上传头像
      imgData,
      imgMask,
      handleAvatarSuccess,
      beforeAvatarUpload,
    };
  },
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
    height: 178px;
    border-bottom: 1px solid #e4e6e9;
    .logo_zi {
      height: 178px;
      width: 178px;
      padding-top: 30px;
      color: #787878;
      font-size: 14px;
      @include webkit("box-sizing", border-box);
      .logo_box {
        overflow: hidden;
        position: relative;
        cursor: pointer;
        img {
          width: 100%;
        }
        .logo_mask {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          background: rgba(0, 0, 0, 0.35);
          text-align: center;
          .take_photo {
            margin-top: 5%;
            width: 2em;
            height: 2em;
          }
        }
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