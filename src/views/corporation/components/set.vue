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
        <div class="info_item_b">{{ employeeInfo.name }}</div>
      </div>
      <div class="info_item_center">
        <div class="info_item_center_a">联系电话</div>
        <div class="info_item_center_b">{{ employeeInfo.tel }}</div>
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
  </div>
</template>
<script>
import { getLoginEmployee } from "@/api/employeeApi";
import { reactive, onMounted, watchEffect } from "@vue/composition-api";
export default {
  name: "corporationInfo",
  setup() {
    let employeeInfo = reactive({
      corpId: "ww2e7b5f3c87c34c17",
      name: "测试",
      photo:
        "https://p.qlogo.cn/bizmail/x9CrcRIuFWvA8VQcstTibfPAsrpcpFulOZwapfGCNwjkJMVUibNl0kWA/0",
      tel: "",
      departmentManagers: "",
      gmtCreate: "2020-06-11 16:29:08",
      gmtModified: "2020-06-11T16:29:08",
      identity: '', // 身份
      corpUserId: 0,
      role: null
    });
    getLoginEmployee().then(res => {
      let data = res.data;
      employeeInfo.id = data.id;
      employeeInfo.name = data.name;
      //employeeInfo.photo = data.photo;
      employeeInfo.tel = data.tel || '暂无';
      employeeInfo.departmentManagers = data.departmentManagers || '暂无';
      employeeInfo.gmtCreate = data.gmtCreate || '暂无';
      employeeInfo.gmtModified = data.gmtModified || '暂无';
      employeeInfo.corpUserId = data.corpUserId || '暂无';
      employeeInfo.identity = data.role.name || '暂无';
    });
    watchEffect(() => {});
    onMounted(() => {});
    return { employeeInfo };
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