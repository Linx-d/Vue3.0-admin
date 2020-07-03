<template>
  <main id="customer" class="frame_center">
    <div class="customer_main frame_center_main">
      <div class="chunk_cnt">
        <div class="cnt_top">
          <div class="cnt_top_l">
            <span>围栏名称</span>
            <span>&nbsp;共({{railData.total}})个围栏</span>
          </div>

          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[15, 20, 30, 40]"
              :page-size="railListPaging.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="railData.total"
              class="pagingConfig"
            ></el-pagination>
          </div>
          <div class="cnt_top_r">
            <a href="javascript:;"></a>
            <!--<span class="frame_operation_separator" v-if="currentDepart.id!==currentDepart.topId">|</span>-->
          </div>
        </div>
        <div class="cnt_bottom">
          <div class="has_depart">
            <div class="cnt_tool">
              <a class="memberLink" href="javascript:;" @click="addRailFn">增加围栏</a>
            </div>
            <table class="memberTable mm_tabel">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>人数</th>
                  <th>创建时间</th>
                  <th>修改时间</th>
                  <th>半径(m)</th>
                  <th>中心坐标</th>
                  <th>地址</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(rail, index) in railData.data" :key="rail.id">
                  <td :title="rail.railName">{{ rail.railName }}</td>
                  <td :title="rail.personSum">{{ rail.personSum }}</td>
                  <td :title="rail.gmtCreate">{{ rail.gmtCreate }}</td>
                  <td :title="rail.gmtModified">{{ rail.gmtModified }}</td>
                  <td :title="rail.radius">{{ rail.radius }}</td>
                  <td :title="rail.latitude">({{ rail.longitude }},{{ rail.latitude }})</td>
                  <td :title="rail.railAddr">{{ rail.railAddr }}</td>
                  <td class="tdTool">
                    <a href="javascript:;" @click.stop="modifyRailFn()">修改</a>
                    <a href="javascript:;" @click.stop="delRailFn(rail.id, index)">删除</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="cnt_tool">
              <a class="memberLink" href="javascript:;" @click="addRailFn">增加围栏</a>
            </div>
          </div>
          <div class="no_depart" v-if="changeModule.null">
            <div class="no_depart_top">
              <svg-icon iconClass="rail" class="rail"></svg-icon>
              <p>暂无围栏</p>
            </div>
            <div class="no_depart_bottom">
              <a class="memberLink" @click="addRail">增加围栏</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { listRail, addRail, deleteRail } from "@/api/railApi";
import { reactive, ref } from "@vue/composition-api";
import { Message } from "element-ui";
export default {
  name: "rail",
  setup(props, { root }) {
    /**
     * data
     */
    // 切换模块
    const changeModule = reactive({
      null: false
    });

    /**
     * 函数
     */

    // 增加围栏 data
    const addRailData = reactive({
      latitude: "1212.21",
      longitude: "32125.2134",
      radius: "200",
      railName: "围栏6",
      railAddr: "万寿福居",
      gmtCreate: new Date(),
      gmtModified: new Date(),
      personSum: 0
    });
    const addRailFn = () => {
      let num = Math.random() * 10;
      num = num.toFixed(1);
      addRailData.railName = `围栏${num}`;
      addRail(addRailData).then(response => {
        let code = response.code;
        if (code === 0) {
          //railData.data.push(addRailData);
          selectRailList(railListPaging);
          Message.success("增加成功");
        } else {
          Message.error(response.msg);
        }
      });
    };
    // 修改围栏
    const modifyRailFn = () => {
      console.log("修改");
    };
    // 删除围栏
    const delRailFn = (id, index) => {
      let params = {
        id
      };
      deleteRail(params).then(response => {
        let code = response.code;
        if (code === 0) {
          railData.data.splice(index, 1);
          selectRailList(railListPaging);
          Message.success("删除成功");
        } else {
          Message.error(response.msg);
        }
      });
    };

    /**查询所有围栏信息 */
    let railListPaging = reactive({
      pageNum: 1,
      pageSize: 15 
    });
    // 围栏信息
    let railData = reactive({
      total: 10,
      lastPage: 2,
      data: []
    });
    // 查询所有围栏信息 selectRailList
    const selectRailList = railListPaging => {
      listRail(railListPaging).then(response => {
        console.log(response);
        let data = response.data.list ? response.data.list : response.data;
        railData.total = response.data.total; // 总围栏数
        railData.lastPage = response.data.lastPage; // 最后一页的页码
        console.log(data);
        console.log(railData);

        railData.data.splice(0, railData.data.length);
        data.forEach(item => {
          railData.data.push(item);
        });
      });
    };
    selectRailList(railListPaging);

    /**当前页变动时候触发的事件 */
    const handleCurrentChange = val => {
      railListPaging.pageNum = val;
      selectRailList(railListPaging);
    };
    const handleSizeChange = val => {
      railListPaging.pageSize = val;
      selectRailList(railListPaging);
    };

    return {
      railData, // 围栏信息
      changeModule, // 切换模块
      modifyRailFn, // 修改围栏
      delRailFn, // 删除围栏
      addRailFn, // 增加围栏
      handleCurrentChange, // 当前页变动时候触发的事件
      handleSizeChange, // 每页条数
      railListPaging // 分页配置
    };
  }
};
</script>

<style lang="scss" scoped>
$customerHeight: 648px;
.customer_main {
}
.chunk_title {
  height: $customerHeight;
}
.chunk_cnt {
  height: $customerHeight;
  width: 1080px;
  padding-bottom: 45px !important;
  position: relative;
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
      span:last-child {
        font-size: 14px;
        color: #787878;
      }
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
    .has_depart {
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
        tbody {
          input {
            cursor: pointer;
          }
          tr:hover {
            background: #f5f5f5;
          }
          tr:hover .tdTool {
          }
          .tdTool {
            a {
              text-decoration: underline;
              margin-right: 5px;
              color: #466b96;
            }
          }
          .tdTool {
            a:hover {
              color: $tabNav_color;
            }
          }
        }
      }
    }
    .no_depart {
      .no_depart_top {
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
      .no_depart_bottom {
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
.rail {
  color: #ddd;
}
.mm_tabel th {
  padding-top: 4px;
}
.mm_tabel th:last-child:before {
  width: 1px;
}

//* pagingConfig 分页配置
.pagingConfig {
  position: absolute;
  right: 10px;
  top: 20px;
}
</style>