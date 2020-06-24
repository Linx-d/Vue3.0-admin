<template>
  <div class="chunk_cnt">
    <div class="cnt_top">
      <div class="cnt_top_l">
        <span>{{ currentDepart.label }}</span>
        <span>({{ currentDepart.length }}人)</span>
      </div>
      <div class="cnt_top_r">
        <a href="javascript:;">修改名称</a>
        <span class="frame_operation_separator">|</span>
        <a href="javascript:;">添加子部门</a>
      </div>
    </div>
    <div class="cnt_bottom">
      <div class="has_member" v-if="changeModule.status">
        <div class="cnt_tool">
          <a class="memberLink" href="javascript:;">添加成员</a>
          <a class="memberLink" href="javascript:;">删除</a>
          <a class="memberLink" href="javascript:;">设置所在部门</a>
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
              <th>地址</th>
              <th>电话</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in memberData" :key="member.id" @click="compileTool">
              <td>
                <input type="checkbox" name="memberChoose" class="memberSelect" />
              </td>
              <td :title="member.name">{{ member.name }}</td>
              <td :title="member.sex">{{ member.sex }}</td>
              <td :title="member.age">{{ member.age }}</td>
              <td :title="member.temperature">{{ member.temperature }}</td>
              <td :title="member.address">{{ member.address }}</td>
              <td :title="member.tel">{{ member.tel }}</td>
              <td class="tdTool">
                <svg-icon class="tdMenuRight" iconClass="compileInfo"></svg-icon>
              </td>
            </tr>
          </tbody>
        </table>
        <p></p>
        <div class="cnt_tool">
          <a class="memberLink" href="javascript:;">添加成员</a>
          <a class="memberLink" href="javascript:;">删除</a>
          <a class="memberLink" href="javascript:;">设置所在部门</a>
        </div>
      </div>
      <div class="no_member" v-if="changeModule.null">
        <div class="no_member_top">
          <svg-icon iconClass="member"></svg-icon>
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
import { onMounted, computed } from "@vue/composition-api";
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
    }
  },
  setup(props, {root}) {
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
     *  td mouseenter事件
     */
    // fn: tdActive ref: tdTool
    const compileTool = () => {
      root.$router.push({
        path: "/contacts/memberInfo"
      })
    };

    onMounted(() => {});
    return { compileTool, changeModule };
  }
};
</script>
<style lang="scss" scoped>
$contactsHeight: 592px;
.chunk_cnt {
  padding: 16px 12px 24px;
  height: $contactsHeight;
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
            opacity: 1;
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
    .memberLink {
      font-size: 12px;
      color: #000;
      display: inline-block;
      margin-right: 6px;
      line-height: 24px;
      padding: 0 12px;
      border: 1px solid #aaaaaa;
      background: #fff;
      cursor: pointer;
    }
    .memberLink:hover {
      background: #f0f0f0;
    }
  }
}

/**Icon menuRight */
.tdMenuRight {
  color: #0c4c7f;
}
</style>