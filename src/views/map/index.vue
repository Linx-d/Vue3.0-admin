<template>
  <main
    id="map"
    :class="{cutFullClass: full}"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(11, 21, 50, 0.8)"
  >
    <div id="mapShow" :class="['map_main', 'frame_center']"></div>
    <!-- <div :class="['tool', { tool_top: full }]">
      <ul>
        <li @click="cutFull">
          <svg-icon iconClass="full_screen" class="mapMenu"></svg-icon>
          <i>全屏</i>
        </li>
      </ul>
    </div>-->
    <!-- alanysis 数据分析模块 login -->
    <div :class="['alanysis']">
      <!-- <div
      :class="['alanysis', {'alanysisToggle': alanysisStatus.status}]"
      >-->
      <div class="case_header">
        <h1>疫情防控中心</h1>
      </div>
      <div class="alanysis_top">
        <div
          class="case_open_left-a"
          @click="echarts_toggle.online=false"
          v-if="echarts_toggle.online"
        >
          <svg-icon iconClass="open_echarts"></svg-icon>
        </div>
        <div
          class="case_open_left-b"
          @click="echarts_toggle.temperature=false"
          v-if="echarts_toggle.temperature"
        >
          <svg-icon iconClass="open_echarts"></svg-icon>
        </div>
        <div :class="['alanysis-a', {'echarts_hide': echarts_toggle.online}]">
          <div class="case_close_right" @click="echarts_toggle.online=true">
            <svg-icon iconClass="close_echarts" class="closeIcon"></svg-icon>
          </div>
          <div class="case_top_right"></div>
          <div class="case_top_left"></div>
          <div class="case_bottom_left"></div>
          <div class="case_bottom_right"></div>
          <div id="abnormal" class="alanysis_top_a echartsIndivi">
            <h1>
              <div>
                <span>企业用户总量:</span>
                {{ scaleStatic.person }}人
              </div>
              <div>
                <span>您管理的用户:</span>
                {{ scaleStatic.managerPerson }}人
              </div>
            </h1>
            <span class="onlineLine"></span>
            <div class="abnormal_top" @click="lineHandle('on')">
              <span>在线</span>
              <br />
              <span>{{ scaleStatic.online }}人</span>
            </div>
            <div class="abnormal_bottom" @click="lineHandle('un')">
              <span>离线</span>
              <br />
              <span>{{ scaleStatic.unline }}人</span>
            </div>
          </div>
        </div>
        <div :class="['alanysis-b', {'echarts_hide': echarts_toggle.temperature}]">
          <div class="case_close_right" @click="echarts_toggle.temperature=true">
            <svg-icon iconClass="close_echarts" class="closeIcon"></svg-icon>
          </div>
          <div class="case_top_right"></div>
          <div class="case_top_left"></div>
          <div class="case_bottom_left"></div>
          <div class="case_bottom_right"></div>
          <div id="online" class="alanysis_top_a echartsIndivi"></div>
        </div>
      </div>
      <div class="alanysis_bottom">
        <div
          class="case_open_left-l"
          @click="echarts_toggle.alarm=false"
          v-if="echarts_toggle.alarm"
        >
          <svg-icon iconClass="open_echarts"></svg-icon>
        </div>
        <div
          class="case_open_left-r"
          @click="echarts_toggle.history=false"
          v-if="echarts_toggle.history"
        >
          <svg-icon iconClass="open_echarts"></svg-icon>
        </div>
        <div
          :class="['alanysis_bottom_L', 'echartsIndivi', {'echarts_hide': echarts_toggle.alarm}]"
        >
          <div class="case_close_right" @click="echarts_toggle.alarm=true">
            <svg-icon iconClass="close_echarts" class="closeIcon"></svg-icon>
          </div>
          <div class="case_top_right"></div>
          <div class="case_top_left"></div>
          <div class="case_bottom_left"></div>
          <div class="case_bottom_right"></div>
          <a href="javascript:;" id="grandTotal">
            <h1>
              警告统计
              <span
                style="color: #cfcfcf; font-size: 12px; text-align: center; display: inline-block;"
              >
                更新时间
                <i
                  style="color: #cfcfcf; font-size: 12px; font-style: normal;"
                >{{ alarmData.date }}</i>
              </span>
            </h1>

            <div class="totalContent">
              <div class="tb_top">
                <span :title="alarmData.alarmSum">{{ alarmData.alarmSum }}</span>
                <span :title="alarmData.personSum">{{ alarmData.personSum }}</span>
                <span :title="alarmData.tsum">{{ alarmData.tsum }}</span>
                <span :title="alarmData.psum">{{ alarmData.psum }}</span>
              </div>
              <div class="tb_middle">
                <span class="tdBgc">累计告警</span>
                <span class="tdBgc">累计人数</span>
                <span class="tdBgc">温度告警</span>
                <span class="tdBgc">位置告警</span>
              </div>
              <div class="tb_bottom">
                <strong style="color: #b2b2b2;" @click="alarmHandle('sum')">
                  <span>今日新增</span>
                  <span style="color: #bf4739;">+{{ alarmData.newSum }}</span>
                </strong>
                <strong style="color: #b2b2b2;" @click="personHandle('person')">
                  <span>今日新增</span>
                  <span style="color: #cd6212;">+{{ alarmData.newPersonSum }}</span>
                </strong>
                <strong style="color: #b2b2b2;" @click="alarmHandle('temperature')">
                  <span>今日新增</span>
                  <span style="color: #1089e7;">+{{ alarmData.newTSum }}</span>
                </strong>
                <strong style="color: #b2b2b2;" @click="alarmHandle('position')">
                  <span>今日新增</span>
                  <span style="color: #35cbbf;">+{{ alarmData.newPSum }}</span>
                </strong>
              </div>
            </div>
          </a>
        </div>

        <div
          :class="['alanysis_bottom_R', 'echartsIndivi', {'echarts_hide': echarts_toggle.history}]"
        >
          <div class="case_close_right" @click="echarts_toggle.history=true">
            <svg-icon iconClass="close_echarts" class="closeIcon"></svg-icon>
          </div>

          <div class="case_top_right"></div>
          <div class="case_top_left"></div>
          <div class="case_bottom_left"></div>
          <div class="case_bottom_right"></div>
          <div id="history"></div>
        </div>
      </div>
      <div class="alanysis_topRight">
        <div
          class="case_open_left-t"
          @click="echarts_toggle.system=false"
          v-if="echarts_toggle.system"
        >
          <svg-icon iconClass="open_echarts"></svg-icon>
        </div>
        <div :class="['alanysis_right', {'echarts_hide': echarts_toggle.system}]">
          <div class="case_close_right" @click="echarts_toggle.system=true">
            <svg-icon iconClass="close_echarts" class="closeIcon"></svg-icon>
          </div>
          <div class="case_top_right"></div>
          <div class="case_top_left"></div>
          <div class="case_bottom_left"></div>
          <div class="case_bottom_right"></div>
          <div id="system" class="alanysis_right_content echartsIndivi"></div>
        </div>
      </div>

      <!-- input search -->
      <div :class="['search_box']">
        <div
          id="search_city"
          :class="{'city_show': search_toggle.city, 'city_none': search_toggle.city_none,'city_block': search_toggle.city_block }"
        >
          <input
            id="suggestId"
            class="city-input"
            type="text"
            placeholder="请输入地址"
            ref="address_search"
            v-model="address"
          />
          <div
            id="searchResultPanel"
            style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"
          ></div>
          <!-- <span class="frame_operation_dep">|</span> -->
          <el-tooltip class="item" effect="dark" content="搜索用户" placement="bottom">
            <span class="search_handle" @click="toogle_city">
              <svg-icon iconClass="search_change2" class="search_change"></svg-icon>
            </span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="关闭" placement="bottom">
            <span class="close_handle" @click="city_close">
              <svg-icon iconClass="search_close" class="search_close"></svg-icon>
            </span>
          </el-tooltip>
        </div>
        <div
          id="search_person"
          :class="{'person_show': search_toggle.member, 'person_none': search_toggle.person_none,'person_block': search_toggle.person_block}"
        >
          <el-autocomplete
            class="inline-input"
            v-model="member"
            :fetch-suggestions="querySearch"
            placeholder="请输入用户名"
            :trigger-on-focus="false"
            @select="handleSelect"
            ref="member_search"
          ></el-autocomplete>
          <!-- <span class="frame_operation_dep">|</span> -->
          <el-tooltip class="item" effect="dark" content="搜索地址" placement="bottom">
            <span class="search_handle" @click="toogle_member">
              <svg-icon iconClass="search_change2" class="search_change"></svg-icon>
            </span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="关闭" placement="bottom">
            <span class="close_handle" @click="member_close">
              <svg-icon iconClass="search_close" class="search_close"></svg-icon>
            </span>
          </el-tooltip>
        </div>
      </div>

      <!-- tool_box -->
      <div class="tool_box">
        <!-- <div class="tool_left tool-common">城市</div> -->
        <!-- <span class="frame_operation_dep"></span> -->
        <!-- <div class="tool_middle tool-common"></div> -->
        <!-- <span class="frame_operation_dep"></span> -->
        <div class="tool_right tool-common" @click.stop="tool_active">
          <el-tooltip class="item" effect="dark" content="工具箱" placement="top">
            <span>
              <svg-icon v-if="!change_boolean.status" iconClass="tool_box"></svg-icon>
              <svg-icon v-else iconClass="tool_box_active"></svg-icon>
            </span>
          </el-tooltip>
          <span :class="{tool_right_active: change_boolean.status}">工具箱</span>
          <span>
            <svg-icon v-if="!change_boolean.status" iconClass="down_arrow"></svg-icon>
            <svg-icon v-else iconClass="top_arrow"></svg-icon>
          </span>
          <div v-show="change_boolean.status" class="tool_list">
            <ul>
              <li @click.stop="hitMap" :class="{'item_active': item_active.hitMap}">热力图</li>
              <li @click.stop="cutFull" :class="{'item_active': item_active.cutFull}">全屏</li>
              <li @click.stop="searchMeber">搜索用户</li>
              <li @click.stop="searchCity">搜索地址</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- alanysis 数据分析模块 end -->

    <!-- 用户在线情况 -->
    <el-dialog
      :title="database.online.title"
      :visible.sync="database.online.visible"
      :close-on-click-modal="false"
      class="online_dialog"
    >
      <el-table
        :data="database.online.show"
        style="width: 100%"
        max-height="500"
        height="500"
        v-loading="database.online.loading"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="userName" label="姓名" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="temperature" label="体温" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="tel" label="联系方式" width="150" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="address" label="当前所在地址" width="300" show-overflow-tooltip sortable></el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="最新上传数据时间"
          width="250"
          show-overflow-tooltip
          sortable
        ></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="database.online.pageNum"
          :page-sizes="database.online.pageSizes"
          :page-size="database.online.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="database.online.total"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- 用户温度情况 -->
    <el-dialog
      :title="database.temperature.title"
      :visible.sync="database.temperature.visible"
      :close-on-click-modal="false"
      class="temperature_dialog"
    >
      <el-table
        :data="database.temperature.show"
        style="width: 100%"
        max-height="500"
        height="500"
        v-loading="database.temperature.loading"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="userName" label="姓名" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="temperature" label="体温" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="tel" label="联系方式" width="150" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="address" label="当前所在地址" width="300" show-overflow-tooltip sortable></el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="最新上传数据时间"
          width="250"
          show-overflow-tooltip
          sortable
        ></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="database.temperature.pageNum"
          :page-sizes="database.temperature.pageSizes"
          :page-size="database.temperature.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="database.temperature.total"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- 告警统计 -->
    <el-dialog
      :title="database.alarm.title"
      :visible.sync="database.alarm.visible"
      :close-on-click-modal="false"
      class="alarm_dialog"
    >
      <el-table
        :data="database.alarm.show"
        style="width: 100%"
        max-height="500"
        height="500"
        v-loading="database.alarm.loading"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          prop="userName"
          label="姓名"
          width="100"
          title="userName"
          show-overflow-tooltip
          sortable
        ></el-table-column>
        <el-table-column prop="temperature" label="体温" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="type" label="告警类型" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="tel" label="联系方式" width="120" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="address" label="当前所在地址" width="260" show-overflow-tooltip sortable></el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="最新上传数据时间"
          width="200"
          show-overflow-tooltip
          sortable
        ></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="database.alarm.pageNum"
          :page-sizes="database.alarm.pageSizes"
          :page-size="database.alarm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="database.alarm.total"
        ></el-pagination>
      </div>
    </el-dialog>

    <!-- 今日新增人数统计 -->
    <el-dialog
      :title="database.person.title"
      :visible.sync="database.person.visible"
      :close-on-click-modal="false"
      class="person_dialog"
    >
      <el-table
        :data="database.person.show"
        style="width: 100%"
        max-height="500"
        height="500"
        v-loading="database.person.loading"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="userName" label="姓名" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="temperature" label="体温" width="100" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="tel" label="联系方式" width="150" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="address" label="当前所在地址" width="300" show-overflow-tooltip sortable></el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="最新上传数据时间"
          width="250"
          show-overflow-tooltip
          sortable
        ></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="database.person.pageNum"
          :page-sizes="database.person.pageSizes"
          :page-size="database.person.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="database.person.total"
        ></el-pagination>
      </div>
    </el-dialog>
  </main>
</template>

<script>
import { Map } from "@/map";
import {
  onMounted,
  computed,
  reactive,
  watchEffect,
  ref,
} from "@vue/composition-api";
import {
  listAlarmView,
  getAlarmView,
  listUserLocation,
  add,
  fuzzySearch,
  listDeviceAlarmInfoByUserId,
  listAddAlarmData,
  listAddAlarmUser,
} from "@/api/mapApi";
import { listRail, selectRailList, listUserInfoByRail } from "@/api/railApi";
import { getCorpInfo } from "@/api/corporationApi";
import { select } from "@/api/contactsApi";
import individuaction from "./custom_map_config/custom_map_config.json"; // 个性化地图 所用样式文件
import { adaptionEchartsV2 } from "@/utils/common"; // 图表自适应
import alarmOption from "./options/alarmOption.js"; // 告警模块
import deviceOption from "./options/deviceOption.js"; // 设备模块
import historyOption from "./options/historyOption.js"; // 历史告警模块
import onlineOption from "./options/onlineOption.js"; // 在线统计模块
import systemOption from "./options/systemOption.js"; // 系统统计模块
import onLineIcon from "@/views/images/marker_online.png";
import unLineIcon from "@/views/images/marker_unline.png";
import dangerIcon from "@/views/images/marker_danger.png";
import address_location from "@/views/images/address_location.png"; // 搜索地址标注
import pointAggre from "@/views/images/pointAggre.png"; // 点聚合
import case_top_right from "@/views/images/case_top_right.png";
import custom_map_config from "./custom_map_config/custom_map_config.json";
// import "./custom_echarts_config/macarons.js"; // macarons echarts
// import "./custom_echarts_config/vintage.js"; // vintage echarts
// import "./custom_echarts_config/walden.js"; // walden echarts
import "./custom_echarts_config/dark.js"; // dark echarts
export default {
  name: "mapModule",
  setup(props, { root, refs }) {
    /**显示隐藏图表
     * 值是false 时为显示, true 为隐藏
     */
    const echarts_toggle = reactive({
      online: false, // 在线
      alarm: false, // 警告
      history: false, // 历史
      system: false, // 疫情
      temperature: false, // 温度
      mask: false, // 覆盖层
    });
    /**
     * 设备频率
     */
    let deviceStep = reactive({
      step: 0,
      marking: 37.3,
    });
    select().then((res) => {
      let hours = new Date().getHours(),
        dayInterval = res.data.dayInterval,
        dayTime = res.data.dayTime,
        nightInterval = res.data.nightInterval,
        nightTime = res.data.nightTime;
      if (hours >= dayTime && hours <= nightTime) {
        deviceStep.step = dayInterval * 60 * 1000 * 2;
      } else {
        deviceStep.step = nightInterval * 60 * 1000 * 2;
      }
    });
    /**温度、在线统计
     *
     */
    const database = reactive({
      online: {
        title: "",
        visible: false,
        loading: true,
        data: [],
        show: [],
        total: 0,
        pageSizes: [15, 20, 30, 40],
        pageNum: 1,
        pageSize: 15,
      },
      temperature: {
        title: "",
        visible: false,
        loading: true,
        data: [],
        show: [],
        total: 0,
        pageSizes: [15, 20, 30, 40],
        pageNum: 1,
        pageSize: 15,
      },
      alarm: {
        title: "",
        visible: false,
        loading: true,
        data: [],
        show: [],
        total: 0,
        pageSizes: [15, 20, 30, 40],
        pageNum: 1,
        pageSize: 15,
      },
      person: {
        title: "",
        visible: false,
        loading: true,
        data: [],
        show: [],
        total: 0,
        pageSizes: [15, 20, 30, 40],
        pageNum: 1,
        pageSize: 15,
      },
      onlineContent: [],
      temperatureContent: [],
      personContent: [],
      alarmContent: [],
    });
    const lineHandle = (val) => {
      database.online.visible = true;
      database.online.pageNum = 1;
      database.online.pageSize = 15;
      let len = database.online.data.length;
      database.online.data.splice(0, len);
      if (val == "on") {
        database.online.title = "在线用户";
        database.onlineContent.forEach((item) => {
          let temperature = parseFloat(item.temperature),
            gmt = new Date().getTime() - new Date(item.gmtCreate).getTime();
          let step = deviceStep.step;
          if (gmt < step) {
            database.online.data.push(item);
          }
        });
      } else {
        database.online.title = "离线用户";
        database.onlineContent.forEach((item) => {
          let temperature = parseFloat(item.temperature),
            gmt = new Date().getTime() - new Date(item.gmtCreate).getTime();
          let step = deviceStep.step;
          if (gmt >= step) {
            database.online.data.push(item);
          }
        });
      }
      database.online.total = database.online.data.length;
      database.online.show = database.online.data.slice(
        0,
        database.online.pageSize
      );
      database.online.loading = false;
    };
    const temperatureHandle = (val) => {
      database.temperature.visible = true;
      database.temperature.pageNum = 1;
      database.temperature.pageSize = 15;
      let len = database.temperature.data.length;
      database.temperature.data.splice(0, len);
      if (val == "normal") {
        database.temperature.title = "体温正常用户";
        database.temperatureContent.forEach((item) => {
          let temperature = parseFloat(item.temperature);
          let marking = deviceStep.marking;
          if (temperature < marking) {
            database.temperature.data.push(item);
          }
        });
      } else {
        database.temperature.title = "体温异常用户";
        database.temperatureContent.forEach((item) => {
          let temperature = parseFloat(item.temperature);
          let marking = deviceStep.marking;
          if (temperature >= marking) {
            database.temperature.data.push(item);
          }
        });
      }
      database.temperature.total = database.temperature.data.length;
      database.temperature.show = database.temperature.data.slice(
        0,
        database.temperature.pageSize
      );
      database.temperature.loading = false;
    };
    const personHandle = (val) => {
      database.person.visible = true;
      database.person.pageNum = 1;
      database.person.pageSize = 15;
      let len = database.person.data.length;
      database.person.data.splice(0, len);
      if (val == "person") {
        database.person.title = "今日新增成员";
        database.person.data = database.personContent;
      }
      database.person.total = database.person.data.length;
      database.person.show = database.person.data.slice(
        0,
        database.person.pageSize
      );
      database.person.loading = false;
    };
    const alarmHandle = (val) => {
      database.alarm.visible = true;
      database.alarm.pageNum = 1;
      database.alarm.pageSize = 15;
      let len = database.alarm.data.length;
      database.alarm.data.splice(0, len);
      if (val == "sum") {
        database.alarm.title = "今日新增告警";
        database.alarmContent.forEach((item) => {
          let alarmType = item.alarmType;
          if (alarmType == 1) {
            item.type = "温度";
            database.alarm.data.push(item);
          } else if (alarmType == 2) {
            item.type = "位置";
            database.alarm.data.push(item);
          } else if (alarmType == 3) {
            item.type = "位置和位置";
            database.alarm.data.push(item);
          }
        });
      } else if (val == "temperature") {
        database.alarm.title = "今日新增温度告警";
        database.alarmContent.forEach((item) => {
          let alarmType = item.alarmType;
          if (alarmType == 1 || alarmType == 3) {
            item.type = "温度";
            database.alarm.data.push(item);
          }
        });
      } else if (val == "position") {
        database.alarm.title = "今日新增位置告警";
        database.alarmContent.forEach((item) => {
          let alarmType = item.alarmType;
          if (alarmType == 2 || alarmType == 3) {
            item.type = "位置";
            database.alarm.data.push(item);
          }
        });
      }
      database.alarm.total = database.alarm.data.length;
      database.alarm.show = database.alarm.data.slice(
        0,
        database.alarm.pageSize
      );
      database.alarm.loading = false;
    };
    const handleSizeChange = (val) => {
      let choose = "",
        online = database.online.visible,
        temperature = database.temperature.visible,
        alarm = database.alarm.visible,
        person = database.person.visible;
      if (online) {
        choose = "online";
      } else if (temperature) {
        choose = "temperature";
      } else if (alarm) {
        choose = "alarm";
      } else if (person) {
        choose = "person";
      }
      database[choose].pageSize = val;
      let start = database[choose].pageSize * (database[choose].pageNum - 1);
      let end = database[choose].pageSize * database[choose].pageNum;
      database[choose].show = database[choose].data.slice(start, end);
    };
    const handleCurrentChange = (val) => {
      let choose = "",
        online = database.online.visible,
        temperature = database.temperature.visible,
        alarm = database.alarm.visible,
        person = database.person.visible;
      if (online) {
        choose = "online";
      } else if (temperature) {
        choose = "temperature";
      } else if (alarm) {
        choose = "alarm";
      } else if (person) {
        choose = "person";
      }
      database[choose].pageNum = val;
      let start = database[choose].pageSize * (database[choose].pageNum - 1);
      let end = database[choose].pageSize * database[choose].pageNum;
      database[choose].show = database[choose].data.slice(start, end);
    };
    // 异常状态表格
    const tableRowClassName = ({ row, rowIndex }) => {
      let temperature = parseFloat(row.temperature);
      let type = row.alarmType;
      if (temperature >= 37.3) {
        return "warning-row";
      } else if (type == 1 || type == 2 || type == 3) {
        return "warning-row";
      }
      return "";
    };

    /**
     * 图表框
     */
    const echartsBorder = reactive({
      top_right: case_top_right,
    });
    /**在线统计
     *
     */
    const scaleStatic = reactive({
      person: 0,
      managerPerson: 0,
      online: 0,
      unline: 0,
      address: "",
    });
    /**获取企业信息
     *
     */
    getCorpInfo().then((res) => {
      scaleStatic.person = res.data.member;
      scaleStatic.address = res.data.address;
    });
    const full = computed(() => {
      return root.$store.state.map.full;
    });
    // 隐藏图表
    const alanysisStatus = reactive({
      status: false,
    });
    /**
     * 百度地图方法
     */
    let positionPoint = reactive({
      lng: 0,
      lat: 0,
    });
    ((window) => {
      getCorpInfo().then((res) => {
        // 将地址解析结果显示在地图上,并调整地图视野
        let address = res.data.address;
        if (address != null) {
          let myGeo = new BMap.Geocoder();
          myGeo.getPoint(
            res.data.address,
            function (addressPoint) {
              if (addressPoint) {
                baiduMap(addressPoint);
              } else {
                alert("您选择地址没有解析到结果!");
              }
            },
            "北京市"
          );
        } else {
          root.$message({
            type: "normal",
            message: "请联系超级管理员设置企业地址",
          });
          let point = new BMap.Point(116.404, 39.915);
          baiduMap(data);
        }
      });
    })(window);
    function baiduMap(data) {
      Map("EG4ercSC4ZmBIhIcBvyoj65q12m2fy00").then((BMap) => {
        // 添加地图类型控件
        // map.addControl(
        //   new BMap.MapTypeControl({
        //     mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
        //   })
        // );
        let map = new BMap.Map("mapShow", {
          minZoom: 6,
          maxZoom: 20,
          // enableMapClick: false, // 关闭底图可点默认事件
        }); // 创建Map实例
        window.map = map;
        let navigationControl = new BMap.NavigationControl({
          // 靠左上角位置
          anchor: BMAP_ANCHOR_TOP_LEFT,
          offset: {
            width: 430,
            height: 220,
          },
          // LARGE类型
          type: BMAP_NAVIGATION_CONTROL_LARGE,
          // 启用显示定位
          enableGeolocation: true,
        });
        map.addControl(navigationControl);
        map.centerAndZoom(new BMap.Point(data.lng, data.lat), 19); // 初始化地图,用城市名设置地图中心点
        listUserLocation().then((res) => {
          let code = res.code;
          let data = res.data;
          let len = data.length;
          let zoomLevel = null;
          if (len < 50) {
            zoomLevel = 19;
          } else if (len < 100) {
            zoomLevel = 17;
          } else if (len < 300) {
            zoomLevel = 15;
          } else if (len < 500) {
            zoomLevel = 12;
          } else {
            zoomLevel = 10;
          }

          // map.setCurrentCity("重庆"); // 设置地图显示的城市 此项是必须设置的
          map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

          /**搜索 地址
           * login
           */
          // 百度地图API功能
          function G(id) {
            return document.getElementById(id);
          }

          let ac = new BMap.Autocomplete({
            input: "suggestId",
            location: map,
          }); //建立一个自动完成的对象

          ac.addEventListener("onhighlight", function (e) {
            //鼠标放在下拉列表上的事件
            let str = "";
            let _value = e.fromitem.value;
            let value = "";
            if (e.fromitem.index > -1) {
              value =
                _value.province +
                _value.city +
                _value.district +
                _value.street +
                _value.business;
            }
            str =
              "FromItem<br />index = " +
              e.fromitem.index +
              "<br />value = " +
              value;

            value = "";
            if (e.toitem.index > -1) {
              _value = e.toitem.value;
              value =
                _value.province +
                _value.city +
                _value.district +
                _value.street +
                _value.business;
            }
            str +=
              "<br />ToItem<br />index = " +
              e.toitem.index +
              "<br />value = " +
              value;
            G("searchResultPanel").innerHTML = str;
          });

          let myValue;
          ac.addEventListener("onconfirm", function (e) {
            //鼠标点击下拉列表后的事件
            let _value = e.item.value;
            myValue =
              _value.province +
              _value.city +
              _value.district +
              _value.street +
              _value.business;
            G("searchResultPanel").innerHTML =
              "onconfirm<br />index = " +
              e.item.index +
              "<br />myValue = " +
              myValue;

            setPlace();
          });

          function setPlace() {
            map.clearOverlays(); //清除地图上所有覆盖物
            function myFun() {
              let pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
              map.centerAndZoom(pp, 18);
              let myIcon = new BMap.Icon(
                address_location,
                new BMap.Size(85, 48)
              );
              map.addOverlay(new BMap.Marker(pp, { icon: myIcon })); //添加标注
            }
            let local = new BMap.LocalSearch(map, {
              //智能搜索
              onSearchComplete: myFun,
            });
            local.search(myValue);
          }
          /*----end -----*/

          map.setMapStyleV2({ styleJson: custom_map_config }); // 个性化地图
          let markers = [];
          let pointArray = [];
          let hitArray = []; // hitArry
          let opts = {
            width: 250,
            height: 80,
            title: "个人信息",
            enableMessage: true, //设置允许信息窗发送短息
          };
          // 状态统计
          let status = {
            personStatic: data.length,
            eletricStatic: 0,
            temperatureStatic: 0,
            onlineStatic: 0,
          };
          scaleStatic.managerPerson = data.length;
          database.onlineContent = data;
          database.temperatureContent = data;
          data.forEach((item) => {
            let gmtTime =
              new Date().getTime() - new Date(item.gmtCreate).getTime();
            let deviceOline = false;
            let step = deviceStep.step;
            if (gmtTime < step) {
              deviceOline = true;
            }
            // 地址逆解析
            let lng = item.longitude,
              lat = item.latitude;
            let pt = new BMap.Point(lng, lat);
            let geoc = new BMap.Geocoder();
            geoc.getLocation(pt, function (rs) {
              let addComp = rs.addressComponents;
              item.address =
                addComp.province +
                addComp.city +
                addComp.district +
                addComp.street +
                addComp.streetNumber;
            });

            let temperature = parseFloat(item.temperature);
            let electric = item.electric;
            let myIcon = new BMap.Icon(unLineIcon, new BMap.Size(32, 32));
            if (temperature > 37.3) {
              status.temperatureStatic++;
              myIcon = new BMap.Icon(dangerIcon, new BMap.Size(32, 32));
            }
            if (deviceOline) {
              status.onlineStatic++;
              myIcon = new BMap.Icon(onLineIcon, new BMap.Size(32, 32));
            }
            if (electric < 2) {
              status.eletricStatic++;
            }
            // 在线统计
            scaleStatic.online = status.onlineStatic;
            scaleStatic.unline = status.personStatic - scaleStatic.online;
            let point = new BMap.Point(item.longitude, item.latitude);
            let marker = new BMap.Marker(point, { icon: myIcon });
            // marker.setAnimation(BMAP_ANIMATION_BOUNCE);
            // let marker = new BMap.Marker(point);
            let content = `姓名: ${item.userName} \n温度: ${item.temperature}`;
            addClickHandler(content, marker);
            markers.push(marker);
            pointArray.push(point);
            if (item.temperature >= 37.3) {
              let hitObj = {
                lng: item.longitude,
                lat: item.latitude,
                count: item.temperature * 100,
              };
              hitArray.push(hitObj);
            }
          });
          online(status); // 统计表 比例
          loading.value = false;
          function addClickHandler(content, marker) {
            marker.addEventListener("click", function (e) {
              openInfo(content, e);
            });
          }
          function openInfo(content, e) {
            let p = e.target;
            let point = new BMap.Point(
              p.getPosition().lng,
              p.getPosition().lat
            );
            let infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
            map.openInfoWindow(infoWindow, point); //开启信息窗口
          }
          //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
          let markerClusterer = new BMapLib.MarkerClusterer(map, {
            markers: markers,
            minClusterSize: 2, //最小的聚合数量，小于该数量的不能成为一个聚合，默认为2
            styles: [
              {
                url: pointAggre,
                size: new BMap.Size(48, 48),
              },
            ],
          });
          // map.setViewport(pointArray);
          /*----------热力图 login---------*/
          var points = hitArray;

          if (!isSupportCanvas()) {
            alert(
              "热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~"
            );
          }
          //详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
          //参数说明如下:
          /* visible 热力图是否显示,默认为true
                    * opacity 热力的透明度,1-100
                    * radius 势力图的每个点的半径大小   
                    * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
                    *	{
                      .2:'rgb(0, 255, 255)',
                      .5:'rgb(0, 110, 255)',
                      .8:'rgb(100, 0, 255)'
                    }
                    其中 key 表示插值的位置, 0~1. 
                        value 为颜色值. 
                    */

          let heatmapOverlay = new BMapLib.HeatmapOverlay({
            radius: 20,
          });
          map.addOverlay(heatmapOverlay);
          heatmapOverlay.setDataSet({ data: points, max: 1000 });
          //是否显示热力图
          function openHeatmap() {
            // map.clearOverlays();
            markers.forEach((item) => {
              item.hide();
            });
            heatmapOverlay.show();
            loading.value = false;
          }
          window.openHeatmap = openHeatmap;
          function closeHeatmap() {
            //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
            // let markerClusterer = new BMapLib.MarkerClusterer(map, {
            //   markers: markers,
            //   minClusterSize: 2, //最小的聚合数量，小于该数量的不能成为一个聚合，默认为2
            //   styles: [
            //     {
            //       url: pointAggre,
            //       size: new BMap.Size(48, 48),
            //     },
            //   ],
            // });
            heatmapOverlay.hide();
            markers.forEach((item) => {
              item.show();
            });
            loading.value = false;
          }
          window.closeHeatmap = closeHeatmap;
          closeHeatmap();
          function setGradient() {
            /*格式如下所示:
                    {
                        0:'rgb(102, 255, 0)',
                      .5:'rgb(255, 170, 0)',
                        1:'rgb(255, 0, 0)'
                    }*/
            var gradient = {};
            var colors = document.querySelectorAll("input[type='color']");
            colors = [].slice.call(colors, 0);
            colors.forEach(function (ele) {
              gradient[ele.getAttribute("data-key")] = ele.value;
            });
            heatmapOverlay.setOptions({ gradient: gradient });
          }
          //判断浏览区是否支持canvas
          function isSupportCanvas() {
            var elem = document.createElement("canvas");
            return !!(elem.getContext && elem.getContext("2d"));
          }
          /*----------热力图 end---------*/
        });
      });
    }
    /**
     * 温度异常 abnormal
     */
    let onlineChart = null;
    const online = (status) => {
      let onlineChart = root.$echarts.init(
        document.getElementById("online"),
        "dark"
      );
      adaptionEchartsV2(onlineChart);
      // 处理点击事件并且跳转到相应的开始
      onlineChart.on("click", function (params) {
        if (params.name == "体温正常人数") {
          temperatureHandle("normal");
        } else {
          temperatureHandle("abnormal");
        }
      });
      let option = onlineOption;
      onlineOption.series[0].data[0].value =
        status.personStatic - status.temperatureStatic;
      onlineOption.series[0].data[1].value = status.temperatureStatic;
      // 使用刚指定的配置项和数据显示图表。
      onlineChart.setOption(option);
    };

    /**
     * 告警总量 alarm
     */
    const alarmData = reactive({
      newPSum: "",
      newPersonSum: "",
      newSum: "",
      newTSum: "",
      alarmSum: "",
      personSum: "",
      psum: "",
      tsum: "",
      date: "",
    });
    const alarm = () => {
      getView();
    };
    setInterval(getView, 6000000);
    function getView() {
      getAlarmView().then((res) => {
        let data = res.data;
        // time
        alarmData.date = data.date;
        // new
        alarmData.newPSum = data.newPSum;
        alarmData.newPersonSum = data.newPersonSum;
        alarmData.newSum = data.newSum;
        alarmData.newTSum = data.newTSum;
        // static
        alarmData.alarmSum = data.alarmSum;
        alarmData.personSum = data.personSum;
        alarmData.psum = data.psum;
        alarmData.tsum = data.tsum;
      });
    }
    /**
     * 告警历史 history
     */
    let historyChart = null;
    const history = () => {
      listAlarmView()
        .then((res) => {
          return res.data;
        })
        .then((data) => {
          // let darkEcharts = JSON.parse(dark);
          // echarts.registerTheme('dark', darkEcharts);
          historyChart = root.$echarts.init(
            document.getElementById("history"),
            "dark"
          );

          let alarmSum = [];
          let personSum = [];
          let psum = [];
          let tsum = [];
          let gmtCreate = [];
          data.forEach((item, index) => {
            gmtCreate.push(item.gmtCreate);
            if (index == 0) {
              alarmSum.push(item.alarmSum);
              personSum.push(item.personSum);
              psum.push(item.psum);
              tsum.push(item.tsum);
            } else {
              alarmSum.push(
                parseFloat(item.alarmSum) - parseFloat(data[index - 1].alarmSum)
              );
              personSum.push(
                parseFloat(item.personSum) -
                  parseFloat(data[index - 1].personSum)
              );
              psum.push(
                parseFloat(item.psum) - parseFloat(data[index - 1].psum)
              );
              tsum.push(
                parseFloat(item.tsum) - parseFloat(data[index - 1].tsum)
              );
            }
          });

          adaptionEchartsV2(historyChart);
          // 使用刚指定的配置项和数据显示图表。
          let option = historyOption;
          option.xAxis.data = gmtCreate;
          option.series[0].data = alarmSum;
          // option.series[1].data = personSum;
          option.series[1].data = psum;
          option.series[2].data = tsum;
          historyChart.setOption(option);
        });
    };

    /**
     * 统计 system
     */
    let systemChart = null;
    const system = () => {
      systemChart = root.$echarts.init(
        document.getElementById("system"),
        "dark"
      );
      adaptionEchartsV2(systemChart);
      let option = systemOption;
      systemChart.setOption(option);
    };
    watchEffect(() => {
      adaptionEchartsV2(systemChart);
      adaptionEchartsV2(historyChart);
      adaptionEchartsV2(onlineChart);
    });
    const loading = ref(true);

    /**工具箱
     *
     */
    const change_boolean = reactive({
      status: false,
    });
    const item_active = reactive({
      hitMap: false,
      cutFull: false,
      searchMeber: false,
      searchCity: false,
    });
    // 搜索切换
    const search_toggle = reactive({
      status: false,
      member: false,
      city: false,
      city_none: false,
      city_block: false,
      person_none: false,
      person_block: false,
    });
    const tool_active = () => {
      change_boolean.status = !change_boolean.status;
    };
    // 热力图
    const hit = ref(false);
    const hitMap = () => {
      loading.value = true;
      hit.value = !hit.value;
      item_active.hitMap = !item_active.hitMap;
      if (hit.value) {
        window.openHeatmap();
      } else {
        window.closeHeatmap();
      }
    };

    const cutFull = () => {
      loading.value = true;
      item_active.cutFull = !item_active.cutFull;
      alanysisStatus.status = !alanysisStatus.status;
      change_boolean.status = false;
      // 切换
      root.$store.commit("SET_FULL"); // commit 不用指向 map模块
      adaptionEchartsV2(systemChart);
      adaptionEchartsV2(onlineChart);
      adaptionEchartsV2(historyChart);
      if (alanysisStatus.status) {
        fullScreen(document.body);
        loading.value = false;
      } else {
        exitFullscreen();
        loading.value = false;
      }
    };
    function fullScreen(ele) {
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
      }
    }
    function exitFullscreen() {
      if (document.exitFullScreen) {
        document.exitFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (element.msExitFullscreen) {
        element.msExitFullscreen();
      }
    }
    // 搜索用户
    const searchMeber = () => {
      item_active.searchMeber = !item_active.searchMeber;
      member.value = "";
      // change_boolean.status = false;
      search_toggle.city = false;
      search_toggle.member = !search_toggle.member;
      refs.member_search.focus();
    };
    // 搜索地址
    const searchCity = () => {
      item_active.searchCity = !item_active.searchCity;
      address.value = "";
      // change_boolean.status = false;
      search_toggle.member = false;
      search_toggle.city = !search_toggle.city;
      refs.address_search.focus();
    };

    /**搜索
     *
     */
    //搜索 地址
    const address = ref("");
    const restaurants = reactive([]);
    const toogle_city = () => {
      search_toggle.city = false;
      search_toggle.member = true;
      refs.member_search.focus();
      address.value = "";
    };
    const city_close = () => {
      search_toggle.city = false;
    };

    //搜索 用户
    const member = ref("");
    const toogle_member = () => {
      search_toggle.member = false;
      search_toggle.city = true;
      refs.address_search.focus();
      member.value = "";
    };
    const member_close = () => {
      search_toggle.member = false;
    };
    const querySearch = (queryString, cb) => {
      let queryObj = {
        keyword: queryString,
        scope: "all",
      };
      fuzzySearch(queryObj).then((res) => {
        let data = res.data.list;
        data.forEach((item) => {
          item.value = item.name;
        });
        let restaurants = data;
        let results = queryString
          ? restaurants.filter(createFilter(queryString))
          : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      });
    };
    const createFilter = (queryString) => {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    };
    const handleSelect = (item) => {
      let id = [item.id];
      listDeviceAlarmInfoByUserId(id).then((res) => {
        if (res.code === 0) {
          let lng = res.data[0].longitude;
          let lat = res.data[0].latitude;
          map.centerAndZoom(new BMap.Point(lng, lat), 19); // 初始化地图,设置中心点坐标和地图级别
        } else {
          root.$message({
            type: "error",
            message: res.msg,
          });
        }
      });
    };
    /**
     * 生命周期函数 onMounted
     */
    onMounted(() => {
      alarm(); // 告警图表
      history(); // 历史图表
      system(); // 历史图表
      online({
        personStatic: 0,
        eletricStatic: 0,
        temperatureStatic: 0,
        onlineStatic: 0,
      });
      // baiduMap(); // 百度地图
      listAddAlarmUser().then((res) => {
        let data = res.data,
          code = res.code,
          msg = res.msg;
        if (code == 0) {
          database.personContent = data;
          // 地址逆解析
          database.personContent.forEach((item) => {
            let lng = item.longitude,
              lat = item.latitude;
            let pt = new BMap.Point(lng, lat);
            let geoc = new BMap.Geocoder();
            geoc.getLocation(pt, function (rs) {
              let addComp = rs.addressComponents;
              item.address =
                addComp.province +
                addComp.city +
                addComp.district +
                addComp.street +
                addComp.streetNumber;
            });
          });
        } else {
          root.$message({
            type: "error",
            message: msg,
          });
        }
      });
      listAddAlarmData().then((res) => {
        let data = res.data,
          code = res.code,
          msg = res.msg;
        if (code == 0) {
          database.alarmContent = data;
          // 地址逆解析
          database.alarmContent.forEach((item) => {
            let lng = item.longitude,
              lat = item.latitude;
            let pt = new BMap.Point(lng, lat);
            let geoc = new BMap.Geocoder();
            geoc.getLocation(pt, function (rs) {
              let addComp = rs.addressComponents;
              item.address =
                addComp.province +
                addComp.city +
                addComp.district +
                addComp.street +
                addComp.streetNumber;
            });
          });
        } else {
          root.$message({
            type: "error",
            message: msg,
          });
        }
      });
    });
    return {
      echarts_toggle,
      full,
      alarmData,
      alanysisStatus,
      echartsBorder,
      loading,
      scaleStatic,
      tool_active,
      change_boolean,
      hitMap,
      cutFull,
      searchMeber,
      searchCity,
      search_toggle,
      member,
      address,
      restaurants,
      querySearch,
      createFilter,
      handleSelect,
      toogle_city,
      city_close,
      toogle_member,
      member_close,
      item_active,
      database,
      lineHandle,
      handleSizeChange,
      handleCurrentChange,
      tableRowClassName,
      alarmHandle,
      personHandle,
    };
  },
};
</script>

<style lang="scss" scoped>
$mapHeight: 81%; // main的自适应高度

// 地图height、width的min，max 设置
$mapMinWidth: 1366px;
$mapMinHeight: 454px;

// alanysis 顶部模块 height、width的min，max 设置
$alanysisMinWidth_Top: 383px;
$alanysisMinHeight_Top: 454px;

// alanysis 底部模块 height、width的min，max 设置
$alanysisMinWidth_Bottom: 1915px;
$alanysisMinHeight_Bottom: 227px;

// echarts CSS
$echartsMargin: 1%;
$echartsBorder: 1px solid #146ede;

// 透明色
$transparency: rgba(11, 21, 50);
#map {
  height: 100vh;
  min-height: 757px;
  min-width: $layout-min-width;
  width: 100%;
  position: relative;
  background: $transparency;
  overflow: hidden;
  #mapShow {
    background-color: $transparency !important;
  }
  .map_main {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    @include webkit("transition", all 0.5s);
    background: $transparency;
  }
}
.tool {
  position: absolute;
  right: 16px;
  top: 108px;
  background: #fff;
  border-radius: 5px;
  width: 40px;
  height: 54px;
  cursor: pointer;
  z-index: 999;
  @include webkit("box-shadow", 0 1px 2px 0 rgba(0, 0, 0, 0.7));
  li {
    text-align: center;
    .mapMenu {
      display: block;
      margin: 5px auto;
      height: 25px;
      width: 25px;
    }
    i {
      font-size: 14px;
      font-style: normal;
      color: #4d4d4d;
    }
  }
}
.cutFullClass {
  height: $mapHeight !important;
}
.alanysisToggle {
  display: none;
}
.alanysisToggleShow {
  display: block;
}
.tool_top {
  top: 16px;
}

$transitionTime: 0.3s;
// 数据分析 alanysis 模块
.alanysis {
  height: 100%;
  overflow: hidden;
  padding-top: 80px;
  min-width: $layout-min-width;
  @include webkit("box-sizing", border-box);
  .echarts_hide {
    // z-index: -1;
    // width: 0 !important;
    // opacity: 0 !important;
    z-index: -1;
  }
  .alanysis_top {
    .alanysis-a {
      position: absolute;
      height: 18%;
      width: 20%;
      opacity: 1;
      left: $echartsMargin;
      transition: $transitionTime;
      background: $transparency;
    }
    .alanysis-b {
      position: absolute;
      top: 31%;
      left: $echartsMargin;
      height: 27%;
      width: 20%;
      opacity: 1;
      transition: $transitionTime;
    }
    .alanysis_top_a {
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      border: $echartsBorder;
      // overflow: hidden;
    }
    #abnormal {
      top: 0;
      // background: #0b1532;
      font-size: 20px;
      text-align: center;
      h1,
      .abnormal_top,
      .abnormal_bottom {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .abnormal_top {
        float: left;
        width: 50%;
        margin-top: 5px;
        cursor: pointer;
        span {
          display: inline-block;
          width: 50%;
          text-align: center;
          line-height: 20px;
          color: #95dbff;
          margin-bottom: 10px;
        }
        span:last-child {
          color: #dcb917;
        }
      }
      .abnormal_bottom {
        float: left;
        width: 50%;
        margin-top: 5px;
        cursor: pointer;
        span {
          display: inline-block;
          width: 50%;
          text-align: center;
          line-height: 20px;
          color: #95dbff;
          margin-bottom: 10px;
        }
        span:last-child {
          color: #dcb917;
        }
      }
      .onlineLine {
        display: inline-block;
        width: 80%;
        height: 1px;
        background: #0f9ae2;
        margin: 0 auto;
      }
      h1 {
        color: #0f9ae2;
        font-size: 19px;
        font-weight: 400;
        text-align: center;
        margin-top: 10px;
        div {
          margin-bottom: 5px;
          span {
            margin-right: 50px;
          }
        }
      }
    }
  }
  .alanysis_bottom {
    .alanysis_bottom_L {
      width: 20%;
      position: absolute;
      height: 38%;
      left: $echartsMargin;
      bottom: 10px;
      border: $echartsBorder;
      transition: $transitionTime;
      background: $transparency;
    }
    .alanysis_bottom_R {
      .case_close_right {
        right: 1%;
      }
      width: 76.9%;
      height: 38%;
      float: right;
      right: $echartsMargin;
      bottom: 10px;
      @include webkit("box-sizing", border-box);
      transition: $transitionTime;
      #history {
        height: 100%;
        width: 100%;
        border: $echartsBorder;
        float: right;
      }
    }
  }
  .alanysis_right {
    height: 48%;
    width: 20%;
    position: absolute;
    right: $echartsMargin;
    border: $echartsBorder;
    // background-color: #0b1532;
    transition: $transitionTime;
    .alanysis_right_content {
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}

// 工具栏
.alanysis {
  .search_box {
    width: 259px;
    height: 58px;
    position: absolute;
    top: 13%;
    left: 22%;
    opacity: 1;
    // display: none;
    .frame_operation_dep {
      height: 29px;
      color: #9e9e9e;
      width: 8px;
      background: #fff;
      height: 29px;
      line-height: 24px;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      padding: 0;
    }
  }
  .tool_box {
    height: 26px;
    position: absolute;
    top: 13%;
    right: 22%;
    .tool-common {
      display: inline-block;
      cursor: pointer;
      background: #fff;
      text-align: center;
      padding: 0 10px;
      line-height: 26px;
      font-size: 14px;
      span:nth-child(2) {
        margin-right: 8px;
        margin-left: 8px;
      }
    }
    .tool_left {
      width: 65px;
    }
    .tool_middle {
    }
    .tool_right {
      position: relative;
      .tool_list {
        position: absolute;
        width: 100%;
        right: 0;
        background-color: #fff;
        @include webkit("box-shadow", 1px 2px 1px rgba(0, 0, 0, 0.15));
        ul {
          li:hover {
            color: #1579f3;
          }
        }
        .item_active {
          color: #1579f3;
        }
      }
    }
    .tool_right_active {
      color: #1579f3;
    }
  }
  #search_city {
    position: absolute;
    left: 0px;
    top: -78px;
    opacity: 0;
    transition: 0.3s;
    .city-input {
      -webkit-appearance: none;
      background-color: #fff;
      background-image: none;
      border: 1px solid #dcdfe6;
      @include webkit("box-sizing", border-box);
      color: #606266;
      display: inline-block;
      font-size: 14px;
      height: 29px;
      line-height: 29px;
      outline: 0;
      padding: 0 15px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      width: 183px;
      border-right: 0;
    }
  }
  .city_show {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    opacity: 1 !important;
  }
  .city_none {
    display: none !important;
  }
  .city_block {
    display: block !important;
  }
  #search_person {
    position: absolute;
    left: 0;
    top: -78px;
    opacity: 0;
    transition: 0.3s;
  }
  .person_show {
    position: absolute !important;
    left: 0 !important;
    top: -1px !important;
    opacity: 1 !important;
  }
  .person_none {
    display: none !important;
  }
  .person_block {
    display: block !important;
  }
  #search_city,
  #search_person {
    .close_handle {
      width: 32px;
      height: 29px;
      display: inline-block;
      background: #fff;
      vertical-align: middle;
      text-align: center;
      padding: 5px 5px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .search_handle {
      width: 43px;
      height: 29px;
      display: inline-block;
      background: #1579f3;
      vertical-align: middle;
      text-align: center;
      padding: 5px 5px;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
}
.BMap_CityListCtrl.anchorTR {
  // top: 12%;
  // right: 18% !important;
  // line-height: 35px;
}

.echartsIndivi {
  // background: rgba(255,255,255,0.85);
  position: absolute;
  @include webkit("box-sizing", boder-box);
}

/**echartsBorder */

.case_top_left {
  width: 15px;
  height: 14px;
  background-image: url("../images/case_top_left.png");
  position: absolute;
  left: -8px;
  top: -8px;
  // left: -2px;
  // top: -2px;
  z-index: 1;
}
.case_top_right {
  width: 15px;
  height: 14px;
  background-image: url("../images/case_top_right.png");
  position: absolute;
  top: -7px;
  right: -8px;
  // top: -2px;
  // right: -2px;
  z-index: 1;
}
.case_bottom_left {
  width: 15px;
  height: 14px;
  background-image: url("../images/case_bottom_left.png");
  position: absolute;
  left: -7px;
  bottom: -7px;
  // bottom: -2px;
  // left: -2px;
  z-index: 1;
}
.case_bottom_right {
  width: 15px;
  height: 14px;
  background-image: url("../images/case_bottom_right.png");
  position: absolute;
  right: -9px;
  bottom: -7px;
  // bottom: -2px;
  // right: -2px;
  z-index: 1;
}
.case_close_right {
  position: absolute;
  right: 4%;
  top: 5%;
  z-index: 1;
  cursor: pointer;
  .closeIcon {
    width: 0.9em;
    height: 0.9em;
  }
}
.case_open_left-a {
  position: absolute;
  left: 2%;
  top: 10%;
  z-index: 2;
  cursor: pointer;
}
.case_open_left-b {
  position: absolute;
  left: 2%;
  top: 33%;
  z-index: 2;
  cursor: pointer;
}
.case_open_left-l {
  position: absolute;
  left: 2%;
  bottom: 35%;
  z-index: 2;
  cursor: pointer;
}
.case_open_left-r {
  position: absolute;
  right: 2%;
  bottom: 35%;
  z-index: 2;
  cursor: pointer;
}
.case_open_left-t {
  position: absolute;
  right: 2%;
  top: 13%;
  z-index: 2;
  cursor: pointer;
}
.case_header {
  height: 116px;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-image: url("../images/case_header.png");
  background-size: cover;
  h1 {
    text-align: center;
    color: #fff;
    line-height: 116px;
    font-weight: 700;
    letter-spacing: 3px;
  }
}

/*---------------------table login-----------------------*/
.tdBgc {
  background-color: #c05050;
  border-radius: 5px;
  color: #fff;
}

.tdcolor {
}

#grandTotal {
  margin-top: 10px;
  border: 1px solid #0b1532;
  margin: 9.2px auto;
  @include webkit("box-shadow", rgba(0, 0, 0, 0.1) 0 0 8px);
  min-height: 168.5px;
  min-width: 303px;
  padding-top: 8%;
  box-sizing: border-box;
  h1 {
    color: #008acd;
    font-weight: 700;
    font-size: 18px;
    margin-left: 15px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .totalContent {
    color: #000;
    padding: 0;
    font-size: 1.2vw;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    padding-bottom: 0;
    span {
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      width: 4vw;
      min-width: 55px;
    }
    .tb_top {
      line-height: 56px;
      span {
        display: inline-block;
      }
      span:nth-child(1) {
        color: #bf4739;
      }
      span:nth-child(2) {
        color: #cd6212;
      }
      span:nth-child(3) {
        color: #1089e7;
      }
      span:nth-child(4) {
        color: #35cbbf;
      }
    }
    .tb_middle {
      line-height: 56px;
      span {
        display: inline-block;
      }
      height: 20%;
      font-weight: 700;
      color: #2d2d2d;
      font-size: 0.7vw;
    }
    .tb_bottom {
      font-weight: 700;
      height: 55px;
      font-size: 0.9vw;
      height: 35px;
      line-height: 35px;
      strong {
        min-width: 55px;
        span {
          display: block;
        }
        color: rgb(178, 178, 178);
        display: inline-block;
        width: 4vw;
        // overflow: hidden;
        // white-space: nowrap;
        // text-overflow: ellipsis;
        // width: 4vw;
      }
    }
  }
}
/*---------------------table end-----------------------*/
</style>