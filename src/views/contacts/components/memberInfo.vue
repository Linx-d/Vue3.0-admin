<template>
  <div class="chunk_cnt">
    <div class="info_title">
      <span>成员详情</span>
    </div>
    <div class="cnt_tool">
      <a class="memberLink" href="javascript:;">
        <svg-icon iconClass="double_headed.svg" class="double_headed.svg"></svg-icon>返回
      </a>
      <a class="memberLink" href="javascript:;">编辑</a>
    </div>
    <div class="info_main">
      <div class="info_head">
        <div class="info_head_l">
          <svg-icon iconClass="info" class="info_svg"></svg-icon>
        </div>
        <div class="info_head_r">
          <p>
            Name
            <span>
              <svg-icon iconClass="info_small" class="info_small"></svg-icon>
            </span>
          </p>
          <div class="info_status">
            <span>online</span>
            <span>TMP</span>
          </div>
          <span>power</span>
        </div>
      </div>
      <div class="info_personal">
        <ul>
          <li>
            <span>电话：</span>
            <i>19922297443</i>
          </li>
          <li>
            <span>地址：</span>
            <i>如泰科技</i>
          </li>
          <li>
            <span>围栏：</span>
            <i>万寿公租房</i>
          </li>
          <li>
            <span>体温：</span>
            <i>51</i>
          </li>
          <li>
            <span>位置：</span>
            <i>68</i>
          </li>
        </ul>
      </div>
      <div class="info_temperature"></div>
      <div class="info_position"></div>
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
  setup(props, { root }) {
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
      });
    };

    onMounted(() => {});
    return { compileTool, changeModule };
  }
};
</script>
<style lang="scss" scoped>
$contactsHeight: 592px;
.chunk_cnt {
  height: $contactsHeight;
  padding: 16px 12px 24px;
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
}
.cnt_tool {
  height: 38px;
  width: 100%;
  background: #dfe9f5;
  padding: 6px 10px;
  border-bottom: 1px solid #bdc9d6;
  box-sizing: border-box;
  .double_headed.svg {
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
    @include webkit("box-sizing", border-box);
    .info_head_l {
      float: left;
      .info_svg {
        height: 70px;
        width: 70px;
        margin-right: 20px;
        vertical-align: middle;
      }
    }
    .info_head_r {
      float: left;
      p {
        font-size: 16px;
        margin-bottom: 10px;
        .info_small {
          margin-left: 5px;
          vertical-align: top;
        }
      }
      .infoStatus {
        span:first-child {
          color: #787878;
          margin-right: 5px;
        }
        span:last-child {
          color: #5090f1;
        }
        margin-bottom: 10px;
      }
    }
  }
  .info_personal {
    height: 200px;
    border-top: 1px dashed #e4e6e9;
    padding: 35px 25px 25px 25px;
    @include webkit('box-sizing', border-box);
    ul {
      li {
        font-size: 14px;
        span {
          color: #787878;
          margin-right: 15px;
        }
        i {
          font-style: normal;
        }
        margin-bottom: 15px;
      }
    }
  }
  .info_temperature {
    height: 200px;
    border-top: 1px dashed #e4e6e9;
    @include webkit('box-sizing', border-box);
  }
}
</style>