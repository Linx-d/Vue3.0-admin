<template>
  <div class="body">
    <div class="tab_cnt">企业信息</div>
    <div class="logo">
      <div class="logo_zi">企业logo</div>
    </div>
    <div class="info">
      <div class="info_item">
        <div class="info_item_a">企业地址</div>
        <div class="info_item_b">重庆北碚区京东方大道390号</div>
      </div>
      <div class="info_item_center">
        <div class="info_item_center_a">联系电话</div>
        <div class="info_item_center_b">023 - 8866 7766</div>
      </div>
      <div class="info_item">
        <div class="info_item_a">企业名称</div>
        <div class="info_item_b">重庆如泰科技有限公司</div>
      </div>
    </div>
    <div class="info">
      <div class="info_item">
        <div class="info_item_a">企业成员</div>
        <div class="info_item_b">76个成员</div>
      </div>
      <div class="info_item_center">
        <div class="info_item_center_a">企业部门</div>
        <div class="info_item_center_b">12个部门</div>
      </div>
      <div class="info_item">
        <div class="info_item_a">绑定手环/成员</div>
        <div class="info_item_b">74/76</div>
      </div>
    </div>
    <div class="tail">
      <div class="tail_item">
        <div class="tail_item_a">创建时间</div>
        <div class="tail_item_b">2020年6月30日</div>
      </div>
      <div class="tail_itemt">
        <div class="tail_itemt_a">企业ID</div>
        <div class="tail_itemt_b">ww39277c878fcf29e5</div>
      </div>
    </div>
  </div>
  
</template>
<script>

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
      border-bottom: 1px solid #DCE1E6;
    }
    .logo {
      height: 158px;
      border-bottom: 1px solid #E4E6E9;
      .logo_zi {
        height: 128px;
        width: 120px;
        padding-top: 30px;
        color: #787878;
        font-size: 14px;
      }
    }
    .info {
      height: 94px;
      border-bottom: 1px solid #E4E6E9;
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