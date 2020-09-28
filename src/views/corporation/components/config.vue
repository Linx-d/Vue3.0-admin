<template>
  <div>
    <div class="info_title">
      <span>设置设备上传频率</span>
    </div>

    <div class="cnt_tool">
      <a
        class="memberLink"
        id="saveInfo"
        href="javascript:;"
        @click="submitForm('ruleForm')"
        >保存</a
      >
      <a class="memberLink" href="javascript:;" @click="memberInfoBack()"
        >取消</a
      >
    </div>

    <div class="config_form">
      <el-form
        :model="deviceConfig"
        :rules="rules"
        :ref="handle.ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="right"
        size="small"
      >
        <el-form-item label="白天上传间隔:" prop="name">
          <el-time-select
            v-model="deviceConfig.dayInterval"
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
            v-model="deviceConfig.nightInterval"
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
            v-model="deviceConfig.dayTime"
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
            v-model="deviceConfig.nightTime"
            :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00',
              minTime: deviceConfig.dayTime,
            }"
          >
          </el-time-select>
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
      dayTime: 8, // hour
      nightTime: 80, // hour
      dayInterval: 20, // minute
      nightInterval: 60, // minute
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
    // 提交
    const submitForm = (formName, data, memberData, initiData) => {
      let params = new URLSearchParams();
      params.append('dayTime', 8);
      params.append('nightTime', 20);
      params.append('dayInterval', 20);
      params.append('nightInterval', 60);
      updateUpload(params).then(res => {
        console.log(res, 'updateUpload');
      });
      select().then(res => {
        console.log(res, 'select');
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
      submitForm,
      resetForm,
      memberInfoBack,
      dateChange,
      handle,
      backHandle,
      handleClose,
      deviceConfig,
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
  .config_form {
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