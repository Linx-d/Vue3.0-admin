<template>
  <div class="chunk_cnt">
    <div class="cnt_top">
      <div class="cnt_top_l">
        <span>{{ currentDepart.label }}</span>
        <span>({{ currentDepart.length }}人)</span>
      </div>
      <div class="cnt_top_r">
        <a href="javascript:;"></a>
        <!--<span class="frame_operation_separator" v-if="currentDepart.id!==currentDepart.topId">|</span>-->
      </div>
    </div>
    <div class="cnt_bottom">
      <div class="has_member" v-if="changeModule.status">
        <div class="cnt_tool">
          <a class="memberLink" href="javascript:;" @click="addMember">添加成员</a>
          <a class="memberLink" href="javascript:;" @click="delMember">删除</a>
        </div>
        <table class="memberTable mm_tabel">
          <thead>
            <tr>
              <th>
                <input type="checkbox" name="memberChooseAll" class="memberAllSlect" />
              </th>
              <th>姓名</th>
              <th>性别</th>
              <th>年龄</th>
              <th>温度</th>
              <th>电话</th>
              <th>地址</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in memberData" :key="member.id" @click="compileTool(member)">
              <td @click.stop="checkChild">
                <input type="checkbox" name="memberChoose" class="memberSelect" />
              </td>
              <td :title="member.name">{{ member.name }}</td>
              <td :title="member.sex">{{ member.sex }}</td>
              <td :title="member.age">{{ member.age }}</td>
              <td :title="member.temperature">{{ member.temperature }}</td>
              <td :title="member.tel">{{ member.tel }}</td>
              <td :title="member.address">{{ member.address }}</td>
              <td class="tdTool">
                <svg-icon class="tdmenu_right" iconClass="compile_info"></svg-icon>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="cnt_tool">
          <a class="memberLink" href="javascript:;" @click="addMember">添加成员</a>
          <a class="memberLink" href="javascript:;" @click="delMember">删除</a>
        </div>
      </div>
      <div class="no_member" v-if="changeModule.null">
        <div class="no_member_top">
          <svg-icon iconClass="member" class="member"></svg-icon>
          <p>当前部门无任何成员</p>
        </div>
        <div class="no_member_bottom">
          <a class="memberLink">添加成员</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, computed, ref, watchEffect } from "@vue/composition-api";
import { switchModule } from "@/utils/common";
import {
  listUserLocationById,
  listDeviceAlarmInfoByUserId
} from "@/api/contactsApi";
import { Message } from "element-ui";
export default {
  name: "memberList",
  props: {
    currentDepart: {
      // 不用在setup中重新声明一次变量
      type: Object,
      default: () => {} // default值 需要使用箭头函数回调
    },
    memberData: {
      type: Array,
      default: () => []
    },
    contactsModule: {
      type: Object,
      default: () => []
    },
    currentMemberInfo: {
      type: Object,
      default: () => {}
    },
    tmpHistory: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { root }) {
    let currentDepart = props.currentDepart; // 当前部门信息
    let changeModule = computed({
      get: () => {
        // 有无成员显示不同模块
        let len = props.memberData.length;
        if (len !== 0) {
          return { status: true, null: false };
        } else {
          return { status: false, null: true };
        }
      },
      set: () => {}
    });
    /**
     *  tr click事件
     */
    const compileTool = data => {
      // 切换模块
      let contactsModule = props.contactsModule;
      switchModule(contactsModule, "memberInfo");

      // 获得成员个人信息
      let currentMemberInfo = props.currentMemberInfo;
      for (let key in currentMemberInfo) {
        currentMemberInfo[key] = data[key];
      }

      let tmpHistory = props.tmpHistory;
      /**根据用户id获取历史数据信息 */
      let currentObj = {
        userId: currentMemberInfo.userId
      };
      listUserLocationById(currentObj).then(response => {
        let array = Array.isArray(response.data.list)
          ? response.data.list
          : response.data; // 服务器与local切换
        let newArr_time = [],
          newArr_tmp = [];
        array.forEach(item => {
          newArr_time.push(item.gmtCreate);
          let temperature = Number(item.temperature).toFixed(1);
          newArr_tmp.push(temperature); //Number().toFiexd(1)
        });
        tmpHistory.newArr_time = newArr_time;
        tmpHistory.newArr_tmp = newArr_tmp;
      });
      /**根据用户id获取设备最新数据和告警信息 */
      let currentArray = [currentMemberInfo.userId];
      listDeviceAlarmInfoByUserId(currentArray).then(response => {
        let data = response.data[0] ? response.data[0] : [];
        for(let key in data) {
          currentMemberInfo[key] = data[key];
        }
        for(let key in currentMemberInfo) {
          let verify = currentMemberInfo[key] == null || currentMemberInfo[key] == undefined || currentMemberInfo[key] == ''; // 验证值是否为空
          if(verify) {
            currentMemberInfo[key] = "暂无数据";
          }
        }
      });
    };

    /**选择单个成员 */
    const checkChild = () => {
      console.log("1");
    };
    /**
     * 添加成员
     */
    const addMember = () => {
      let verifyTopDepart = currentDepart.id !== currentDepart.topId; // 验证是否为顶级部门
      if (!verifyTopDepart) {
        Message.warning("顶级部门不能添加成员"); // 顶级部门不能添加成员
      }
    };
    /**
     * 移除成员
     */
    const delMember = () => {
      let verifyTopDepart = currentDepart.id !== currentDepart.topId; // 验证是否为顶级部门
      if (!verifyTopDepart) {
        Message.warning("顶级部门不能移除成员"); // 顶级部门不能移除成员
      }
    };
    onMounted(() => {});
    return {
      compileTool,
      changeModule,
      checkChild,
      addMember, // Fn 添加部门成员
      delMember // Fn 移除部门成员
    };
  }
};
</script>
<style lang="scss" scoped>
$contactsHeight: 592px;
.chunk_cnt {
  height: $contactsHeight;
  padding-bottom: 45px !important;
  .cnt_top {
    font-weight: 700;
    overflow: hidden;
    padding-bottom: 10px;
    line-height: 28px;
    border-bottom: 1px solid #e4e6e9;
    .cnt_top_l {
      font-size: 18px;
      float: left;
      color: #000;
    }
    .cnt_top_r {
      font-size: 14px;
      span {
        color: #0c4c7f;
      }
      a {
        color: #0c4c7f;
      }
      float: right;
    }
  }
  .cnt_bottom {
    .has_member {
      .cnt_tool {
        height: 38px;
        width: 100%;
        background: #dfe9f5;
        padding: 6px 10px;
        border-bottom: 1px solid #bdc9d6;
        box-sizing: border-box;
      }
      .memberTable {
        width: 100%;
        text-align: left;
        thead {
          input {
            cursor: pointer;
          }
        }
        tbody {
          input {
            cursor: pointer;
          }
          tr:hover {
            background: #f5f5f5;
          }
          tr:hover .tdTool {
            opacity: 0;
          }
        }
      }
    }
    .no_member {
      .no_member_top {
        padding-top: 150px;
        text-align: center;
        .svg-icon {
          width: 100px;
          height: 100px;
        }
        p {
          font-size: 14px;
          margin-top: 20px;
          color: #787878;
        }
      }
      .no_member_bottom {
        text-align: center;
        margin-top: 20px;
      }
    }
  }
}

/**Icon menu_right */
.tdmenu_right {
  color: #0c4c7f;
}
.member {
  color: #ddd;
}
.mm_tabel td:last-child {
  width: 20px;
  opacity: 0;
}
</style>