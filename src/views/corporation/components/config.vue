<template>
  <div class="body">
    <div class="info_title">
      <span>设置设备上传频率</span>
    </div>

    <div class="config_form">
      <el-form
        :model="modifyConfig"
        :rules="rules"
        :ref="handle.ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="right"
        size="small"
      >
        <el-form-item label="白天上传间隔:" prop="name">
          <el-time-select
            v-model="modifyConfig.dayInterval"
            :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '24:00',
            }"
            placeholder="选择时间"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="晚上上传间隔:" prop="name">
          <el-time-select
            v-model="modifyConfig.nightInterval"
            :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '24:00',
            }"
            placeholder="选择时间"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="起始时间:" prop="start">
          <el-time-select
            placeholder="起始时间"
            v-model="modifyConfig.dayTime"
            :picker-options="{
              start: '0:00',
              step: '01:00',
              end: '24:00',
            }"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="结束时间:" prop="end">
          <el-time-select
            placeholder="结束时间"
            v-model="modifyConfig.nightTime"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00',
              minTime: modifyConfig.dayTime,
            }"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item class="railBtn universal_btn">
          <el-button @click="restForm">重置</el-button>
          <el-button type="primary" @click="configSubmit">提交</el-button>
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
        <el-button type="primary" @click="backHandle()">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { onMounted, reactive } from "@vue/composition-api";
import { updateUpload, select } from "@/api/employeeApi";
export default {
  name: "modify_form",
  setup(props, { root, refs }) {
    /**form
     *
     */
    let deviceConfig = reactive({
      dayTime: "0:00", // hour
      nightTime: "0:00", // hour
      dayInterval: "0:00", // minute
      nightInterval: "0:00", // minute
    });
    let modifyConfig = reactive({
      dayTime: "0:00", // hour
      nightTime: "0:00", // hour
      dayInterval: "0:00", // minute
      nightInterval: "0:00", // minute
    });
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
    select().then((res) => {
      // day 起始时间
      deviceConfig.dayTime = parseInt(res.data.dayTime);
      if (deviceConfig.dayTime <= 0) {
        deviceConfig.dayTime = "0" + ":00";
      } else if (deviceConfig.dayTime <= 24) {
        if (deviceConfig.dayTime < 10) {
          deviceConfig.dayTime = "0" + deviceConfig.dayTime;
        }
        deviceConfig.dayTime = deviceConfig.dayTime + ":00";
      } else {
        deviceConfig.dayTime = 24 + ":00";
      }
      // day 间隔
      deviceConfig.dayInterval = parseInt(res.data.dayInterval);
      if (deviceConfig.dayInterval < 60) {
        deviceConfig.dayInterval = "00:" + deviceConfig.dayInterval;
      } else {
        deviceConfig.dayInterval =
          parseInt(parseInt(deviceConfig.dayInterval) / 60) +
          ":" +
          (deviceConfig.dayInterval % 60);
      }

      // night 起始时间
      deviceConfig.nightTime = parseInt(res.data.nightTime);
      if (deviceConfig.nightTime <= 0) {
        deviceConfig.nightTime = 0 + ":00";
      } else if (deviceConfig.nightTime <= 24) {
        if (deviceConfig.nightTime < 10) {
          deviceConfig.nightTime = "0" + deviceConfig.nightTime;
        }
        deviceConfig.nightTime = deviceConfig.nightTime + ":00";
      } else {
        deviceConfig.nightTime = 24 + ":00";
      }
      // night 间隔
      deviceConfig.nightInterval = parseInt(res.data.nightInterval);
      if (deviceConfig.nightInterval < 60) {
        deviceConfig.nightInterval = "00:" + deviceConfig.nightInterval;
      } else {
        let num = parseInt(parseInt(deviceConfig.nightInterval) / 60);
        let num2 = deviceConfig.nightInterval % 60;
        if (num < 10) {
          num = "0" + num;
        }
        if (num2 < 10) {
          num2 = "0" + num2;
        }
        deviceConfig.nightInterval = num + ":" + num2;
      }

      for (let key in deviceConfig) {
        modifyConfig[key] = deviceConfig[key];
      }
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
    const dateChange = (val) => {};
    /**方法
     *
     */
    const restForm = () => {
      for (let key in deviceConfig) {
        modifyConfig[key] = deviceConfig[key];
      }
    };
    const configSubmit = () => {
      let submitData = {
        dayTime: 0, // hour
        nightTime: 0, // hour
        dayInterval: 0, // minute
        nightInterval: 0, // minute
      };
      for (let key in modifyConfig) {
        let arr = modifyConfig[key].split(":");
        if (key == "dayInterval" || key == "nightInterval") {
          submitData[key] = parseInt(arr[0]) * 60 + parseInt(arr[1]);
        } else {
          submitData[key] = parseInt(arr[0]);
        }
      }
      let params = new URLSearchParams();
      params.append("dayTime", submitData.dayTime);
      params.append("nightTime", submitData.nightTime);
      params.append("dayInterval", submitData.dayInterval);
      params.append("nightInterval", submitData.nightInterval);
      updateUpload(params).then((res) => {
        if (res.code == 0) {
          root.$message({
            type: "success",
            message: "成功设置设备上传频率！",
          });
        } else {
          restForm();
        }
      });
    };

    // 重置
    const resetForm = (formName) => {
      refs[formName].resetFields();
    };
    // 返回
    const memberInfoBack = (data, modifyData) => {};
    const handleClose = (done) => {
      done();
    };
    const backHandle = (modifyData, initiData) => {};

    /**挂载完成
     *
     */
    onMounted(() => {});
    return {
      ruleForm,
      rules,
      resetForm,
      memberInfoBack,
      dateChange,
      handle,
      backHandle,
      handleClose,
      deviceConfig,
      modifyConfig,
      restForm,
      configSubmit,
    };
  },
};
</script>
<style lang="scss" scoped>
$contactsHeight: 592px;
.body {
  padding: 15px 25px 15px;
}
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
  .config_form {
    padding: 25px 60px 0 15px;
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

.universal_btn {
  .el-form-item__content {
    .el-button {
      width: 80px;
      height: 32px;
    }
  }
}
</style>