<template>
  <div class="body">
    <div class="tab_cnt">企业信息</div>
    <div class="logo">
      <div class="logo_zi">
        <img :src="companyInfo.logoUrl" />
      </div>
    </div>
    <div class="info">
      <div class="info_item">
        <div class="info_item_a">企业地址</div>
        <div class="info_item_b">{{ companyInfo.address }}</div>
      </div>
      <div class="info_item_center">
        <div class="info_item_center_a">联系电话</div>
        <div class="info_item_center_b">{{ companyInfo.tel }}</div>
      </div>
      <div class="info_item">
        <div class="info_item_a">企业名称</div>
        <div class="info_item_b">{{ companyInfo.name }}</div>
      </div>
    </div>
    <div class="info">
      <div class="info_item">
        <div class="info_item_a">企业成员</div>
        <div class="info_item_b">{{ companyInfo.member }}</div>
      </div>
      <div class="info_item_center">
        <div class="info_item_center_a">企业部门</div>
        <div class="info_item_center_b">{{ companyInfo.departmentNum }}</div>
      </div>
      <div class="info_item">
        <div class="info_item_a">企业员工</div>
        <div class="info_item_b">{{ companyInfo.employeeNum }}</div>
      </div>
    </div>
    <div class="tail">
      <div class="tail_item">
        <div class="tail_item_a">创建时间</div>
        <div class="tail_item_b">{{ companyInfo.gmtCreate }}</div>
      </div>
      <div class="tail_itemt">
        <div class="tail_itemt_a">企业ID</div>
        <div class="tail_itemt_b">{{ companyInfo.id }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getCorpInfo } from "@/api/corporationApi";
import { reactive, onMounted, watchEffect } from "@vue/composition-api";
export default {
  name: "corporationInfo",
  setup() {
    let params = reactive({
      corpId: "ww2e7b5f3c87c34c17"
    });
    let companyInfo = reactive({
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
        companyInfo[key] = data[key];
      }
    });
    watchEffect(() => {});
    onMounted(() => {});
    return { companyInfo };
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