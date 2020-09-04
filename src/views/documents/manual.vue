<template>
  <main id="manual" class="frame_center document_fix">
    <div>
      <div class="manual_main frame_center_main frame_cnt">
        <p class="MsoNormal">
          <span>
            <b>一、登录注册</b>
          </span>
        </p>
        <p class="MsoNormal">
          <span>1.注册：首先下载企业微信移动端安装并注册，其次在如泰官网</span>
        </p>
        <p class="MsoNormal">
          <span>
            <a href="http://www.chinautech.com/cn/">http://www.chinautech.com/cn/</a>底部联系如泰申请如泰疫情防控中心服务。
          </span>
        </p>
        <img :src="urlList.contact_we" alt="关于我们">
        <p class="MsoNormal">
          <span>2.登录：访问疫情防控中心<a href="https://iot.chinautech.com/">https://iot.chinautech.com/</a> 使用企业微信扫码登录</span>
        </p>
        <img :src="urlList.login_code">
      <p class="MsoNormal"><span><b>二、地图</b></span></p>
      <p class="MsoNormal"><span>1.成员位置信息概览</span></p>
      <img :src="urlList.overview">
      <p class="MsoNormal"><span>2.成员信息点击显示，红色成员图标表示温度告警，灰色表示不在线，蓝色表示在线</span></p>
      <img :src="urlList.detailed_info">
      <p class="MsoNormal"><span>3.数据统计,统计当前管理员管理成员数，统计管理的成员在线离线人数，统计管理的成员温度正常异常人数</span></p>
      <img :src="urlList.statistics_manager">
      <p class="MsoNormal"><span>统计饼图可点击查看详情信息</span></p>
      <img :src="urlList.temperature_normal">
      <p class="MsoNormal"><span>统计告警信息</span></p>
      <img :src="urlList.statistics_alarm">
      <p class="MsoNormal"><span>地图右上角拥有工具箱可以点击展开，查看热力图</span></p>
      <img :src="urlList.position_info">
      <img :src="urlList.position_heat">
      <p class="MsoNormal"><span><b>三、部门管理</b></span></p>
      <p class="MsoNormal"><span>1.点击部门后面的三个小点进行部门的增删改操作，部门管理员对于所管辖的部门拥有删除、修改和添加子部门权限。对于非管辖部门无操作权限,并且无添加成员权限和查看未分组权限。普通管理员和超级管理员拥有给部门添加成员权限.</span></p>
      <img :src="urlList.department_operating">
      <p class="MsoNormal"><span>2.成员信息详情查看按钮和移除按钮。移除则回把用户放入未分组用户，等待普通管理员和超级管理员重新分配部门</span></p>
      <img :src="urlList.member_display">
      <p class="MsoNormal"><span>3.成员详情信息，管理员可编辑。体温告警次数可点击只显示温度异常信息，位置告警次点击显示位置告警信息</span></p>
      <img :src="urlList.member_details">
      <p class="MsoNormal"><span>4.体温变化图，可进行选取显示范围和数据表格显示。温度告警红色字体显示</span></p>
      <img :src="urlList.temperature">
      <img :src="urlList.temperature_display">
      <img :src="urlList.temperature_info">
      <p class="MsoNormal"><span><b>四、围栏管理</b></span></p>
      <p class="MsoNormal"><span>1.查看围栏，点击新增围栏进行新增操作</span></p>
      <img :src="urlList.rail_info">
      <p class="MsoNormal"><span>2.左上角点击小手图标拖动地图，圆圈图标选取围栏范围</span></p>
      <img :src="urlList.rail_insert">
      <p class="MsoNormal"><span>3.点击查看按钮可修改围栏信息，删除按钮删除围栏。删除围栏之前必须移除围栏下的所有成员，成员围栏的绑定和解绑在部门→点击具体部门→点击成员查看成员详情里面</span></p>
      <img :src="urlList.rail_update">
      <p class="MsoNormal"><span><b>五、企业管理</b></span></p>
      <p class="MsoNormal"><span>1.企业信息查看，仅有超级管理员可修改企业名称、企业地址、联系电话、座机、电子邮箱</span></p>
      <img :src="urlList.company_info">
      <p class="MsoNormal"><span>2.个人信息查看， 管理员名称、联系电话和电子邮箱可修改</span></p>
      <img :src="urlList.user_info">
      <p class="MsoNormal"><span>3.权限管理，超级管理员不可被修改，超级管理员拥有管理普通管理员和部门管理员权限，普通管理员拥有管理部门管理员权限</span></p>
      <img :src="urlList.permissions">
      </div>
      <p class="version">© 2009&nbsp;-&nbsp;2020&nbsp;Utech Inc. All Rights Reserved</p>
    </div>
  </main>
</template>
<script>
import company_info from "./images/manual/company_info.png";
import contact_we from "./images/manual/contact_we.png";
import department_operating from "./images/manual/department_operating.png";
import detailed_info from "./images/manual/detailed_info.png";
import login_code from "./images/manual/login_code.png";
import member_details from "./images/manual/member_details.png";
import member_display from "./images/manual/member_display.png";
import overview from "./images/manual/overview.png";
import permissions from "./images/manual/permissions.png";
import rail_info from "./images/manual/rail_info.png";
import rail_insert from "./images/manual/rail_insert.png";
import rail_update from "./images/manual/rail_update.png";
import statistics_manager from "./images/manual/statistics_manager.png";
import temperature from "./images/manual/temperature.png";
import temperature_display from "./images/manual/temperature_display.png";
import temperature_info from "./images/manual/temperature_info.png";
import user_info from "./images/manual/user_info.png";
import temperature_normal from "./images/manual/temperature_normal.png";
import statistics_alarm from "./images/manual/statistics_alarm.png";
import position_info from "./images/manual/position_info.png";
import position_heat from "./images/manual/position_heat.png";
import { reactive, ref } from "@vue/composition-api";
export default {
  name: "manual",
  setup() {
    const urlList = reactive({
      contact_we,
      company_info,
      department_operating,
      detailed_info,
      login_code,
      member_details,
      member_display,
      overview,
      permissions,
      rail_info,
      rail_insert,
      rail_update,
      statistics_manager,
      temperature,
      temperature_display,
      temperature_info,
      user_info,
      temperature_normal,
      statistics_alarm,
      position_info,
      position_heat,
    });
    return {urlList};
  },
};
</script>
<style lang="scss" scoped>
#manual {
  height: 1600px;
  .version {
    margin-top: 24px;
  }
}
.manual_main {
  text-align: center;
}
</style>