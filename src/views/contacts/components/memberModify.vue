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
        @click="submitForm('ruleForm', modifyMemberInfo, currentMemberInfo, initial)"
      >保存</a>
      <a
        class="memberLink"
        href="javascript:;"
        @click="memberInfoBack(currentMemberInfo, modifyMemberInfo, initial)"
      >取消</a>
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
        <el-form-item label="住址:" prop="address">
          <el-input v-model="modifyMemberInfo.address" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remarks">
          <el-input type="textarea" v-model="modifyMemberInfo.remarks" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="handle.dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>成员的资料尚未保存，确定要离开吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handle.dialogVisible = false">留在此页</el-button>
        <el-button type="primary" @click="backHandle(modifyMemberInfo, initial)">离开此页</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { reactive, ref, watchEffect } from "@vue/composition-api";
import { updateUser } from "@/api/contactsApi";
import { switchModule } from "@/utils/common";
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
    const rules = reactive({
      name: [],
    });
    const dateChange = (val) => {
      let year = val.getFullYear();
      let month = val.getMonth() + 1;
      let date = val.getDate();
      console.log(month, "val");
      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      props.modifyMemberInfo.age = year + "-" + month + "-" + date;
      console.log(props.modifyMemberInfo, "modifyInfo");
    };
    /**方法
     *
     */
    // 提交
    const submitForm = (formName, data, memberData, initiData) => {
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
              console.log(data, "data");
              console.log(memberData, "memberData");
              console.log(initiData, "initiData");
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
            } else {
              root.$message({
                type: "error",
                message: msg,
              });
            }
          });
        } else {
          console.log("error submit!!");
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
        if (key == "remarks") {
          if (data[key] == "暂无数据") {
            data[key] = null;
          }
        }
        if (data[key] != modifyData[key]) {
          if (key == "age") {
            if (data.date == modifyData[key]) {
              console.log(data.date, modifyData[key]);
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
</style>