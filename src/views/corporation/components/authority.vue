<template>
  <div class="el-container">
    <div class="list">
      <div class="toolbar">
        <el-row>
          <el-button class="addBtn" size="mini" @click="showEmployees()">添加管理员</el-button>
        </el-row>
        <el-dialog width="900px" title="选择用户" :visible.sync="dialogTableVisible" center>
          <el-table :data="employeesNotRole.list">
            <el-table-column property="name" label="姓名" width="150">
              <template slot-scope="scope">
                <p v-html="scope.row.name"></p>
              </template>
            </el-table-column>
            <el-table-column property="tel" label="电话" width="200"></el-table-column>
            <el-table-column property="gmtCreate" label="创建时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="chooseEmployee(scope.row.id)"
                  type="text"
                  size="small"
                >选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-pagination
              background
              layout="prev, pager, next"
              :current-page.sync="employeesNotRole.pageNum"
              :page-size.sync="employeesNotRole.pageSize"
              :total="employeesNotRole.total"
              @current-change="showEmployees()"
            ></el-pagination>
          </div>
        </el-dialog>
      </div>
      <el-menu @open="loadWWOpenData()" class="roleMenu">
        <el-submenu
          :index="role.id + ''"
          v-for="(role, index) in roleList"
          :key="role.id"
          :value="role.id"
          class="menu"
        >
          <template slot="title">
            <span>{{ role.name }}</span>
          </template>
          <el-menu-item
            v-for="employee in role.employees"
            :index="index + '-' + employee.id"
            :key="employee.id"
            :value="employee.id"
            :unique-opened="true"
            @click="choose(employee.id)"
          >
            <svg-icon iconClass="people" class="peopleSvg"></svg-icon>
            <span v-html="employee.name">{{ employee.name }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="detail" v-if="employee.id">
      <div class="cnt_tool">
        <a
          href="javascript:;"
          class="memberLink"
          @click="edit()"
          v-if="!isEdit&&employee.role.id!=1"
        >编辑管理员</a>
        <a
          href="javascript:;"
          class="memberLink"
          @click="delManager()"
          v-if="!isEdit&&employee.role.id!=1"
        >删除管理员</a>
      </div>
      <div class="group">
        <svg-icon iconClass="superManager" v-show="employee.role.id===1" class="managerHead"></svg-icon>
        <svg-icon iconClass="normalManager" v-show="employee.role.id===2" class="managerHead"></svg-icon>
        <svg-icon iconClass="departManager" v-show="employee.role.id===3" class="managerHead"></svg-icon>
      </div>
      <el-form label-width="120px" style="position: relative;">
        <div class="group">
          <el-form-item label="管理员姓名">
            <label class="label-info" v-html="employee.name"></label>
          </el-form-item>
          <el-form-item label="联系电话">
            <label class="label-info">{{employee.tel}}</label>
          </el-form-item>
        </div>

        <!-- <span
          style="height: 1px;
          width: 100%;
          border-bottom: 1px solid rgb(220, 225, 230);
          position: absolute;
          top: 111px;
          left: 0;"
        ></span>-->
        <div class="group">
          <el-form-item label="管理权限" v-if="!isEdit">
            <label class="label-info">{{employee.role.name}}</label>
          </el-form-item>
          <el-form-item label="管理权限" v-else>
            <el-radio-group v-model="roleId">
              <el-radio label="2" style="margin-right:20px;" v-if="loginEmployeeInfo.role.id==1">普通管理员</el-radio>
              <el-radio label="3">部门管理员</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="管理范围">
            <template v-if="roleId==3">
              <div
                v-show="employee.departments.length>=0"
                class="department-icon"
                :title="department.label"
                v-for="department in employee.departments"
                :key="department.id"
              >
                <svg-icon iconClass="depart" class="departSvg"></svg-icon>
                <label class="label-info">{{department.label}}</label>
              </div>
              <div v-show="employee.departments.length<=0">暂无</div>
              <br />
              <div class="department-icon" v-if="isEdit" @click="showDepartments">
                <i class="el-icon-edit icon"></i>
                <label class="label-info">编辑</label>
              </div>
              <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="640px"
                center
                v-if="employee.role.id!=1"
              >
                <span>
                  <el-transfer v-model="departmentList" :data="allDepartment"></el-transfer>
                </span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="chooseDepartments(departmentList)">完 成</el-button>
                </span>
              </el-dialog>
            </template>
            <template v-else>
              <label class="label-info">所有部门</label>
            </template>
          </el-form-item>
        </div>
        <div class="group-tail">
          <el-form-item label="注册时间">
            <label class="label-info">{{employee.gmtCreate}}</label>
          </el-form-item>
        </div>
        <el-form-item>
          <template v-if="isEdit">
            <el-button type="primary" @click="submit()">提 交</el-button>
            <el-button type="primary" @click="cancel()">取 消</el-button>
          </template>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reactive, ref, watchEffect, onMounted } from "@vue/composition-api";
import { cloneObjectToNull } from "@/utils/common";
import { jssdk } from "@/utils/wxwork";
import {
  listEmployee,
  listAllRole,
  listEmployeeByRole,
  getEmployee,
  selectEmpDepRoleByEmpId,
  listAllDepartment,
  editAdmin,
  editEmployee,
  listNotRoleEmployee,
  getLoginEmployee,
} from "@/api/employeeApi";
import { all } from "cookie_js";
export default {
  name: "authority",
  setup(props, { root }) {
    // -------------------------------------变量-------------------------------------------
    /**
     * 员工列表窗口
     */
    let dialogTableVisible = ref(false);
    /**
     * 当前登录用户
     */
    /**
     * 部门列表窗口
     */
    let dialogVisible = ref(false);
    /**
     * 页面状态  编辑 查看
     */
    let isEdit = ref(false);
    /**
     * 分页信息
     */
    let pageInfo = reactive({
      pageNum: 1,
      pageSize: 50,
    });
    /**
     * 修改后的role
     */
    let roleId = ref("2");
    /**
     * 角色集合
     */
    let roleList = reactive([]);
    /**
     * 拥有的部门
     */
    let departmentList = reactive([]);
    /**
     * 所有集合
     */
    let allDepartment = reactive([
      {
        key: 1,
        label: `备选项 1`,
      },
      {
        key: 2,
        label: `备选项2`,
      },
      {
        key: 3,
        label: `备选项 3`,
      },
    ]);
    /**
     * 员工集合
     */
    let employees = reactive([]);
    /**
     * 无角色员工集合
     */
    let employeesNotRole = reactive({
      pageNum: 1,
      pageSize: 5,
      list: [
        {
          id: null,
        },
      ],
    });

    /**
     * 员工信息详情
     */
    let employee = reactive({
      id: null,
      name: "123",
      role: {
        id: 1,
        name: "role",
      },
      tel: "",
      gmtCreate: ""
    });
    /**
     * 登录人员详情
     */
    let loginEmployeeInfo = reactive({
      id: null,
      name: "123",
      role: {
        id: 1,
        name: "role",
      },
      tel: "",
      gmtCreate: "",
    });
    getLoginEmployee()
      .then((res) => {
        let data = res.data;
        let roleId = data.role ? data.role.id : null;
        loginEmployeeInfo.id = data.id;
        loginEmployeeInfo.name = data.name;
        loginEmployeeInfo.tel = data.tel;
        loginEmployeeInfo.gmtCreate = data.gmtCreate || "暂无";
        loginEmployeeInfo.gmtModified = data.gmtModified || "暂无";
        loginEmployeeInfo.corpUserId = data.corpUserId || "暂无";
        loginEmployeeInfo.identity = data.role ? data.role.name : "暂无";
        loginEmployeeInfo.role = data.role || "暂无";
        loginEmployeeInfo.roleId = loginEmployeeInfo.role.id;
        loginEmployeeInfo.corpId = loginEmployeeInfo.corpId;
        if (roleId === 1) {
          loginEmployeeInfo.departmentManagers = "所有部门";
          loginEmployeeInfo.photo = "superManager";
        } else if (roleId === 2) {
          loginEmployeeInfo.departmentManagers = "所有部门";
          loginEmployeeInfo.photo = "normalManager";
        } else if (roleId === null) {
          loginEmployeeInfo.departmentManagers = null;
          loginEmployeeInfo.photo = "departManager_no";
        } else {
          loginEmployeeInfo.photo = "departManager";
          let departManagers = data.departmentManagers;
          loginEmployeeInfo.departmentManagers = [];
          if (departManagers != null && departManagers.length > 0) {
            selectEmpDepRoleByEmpId(data.id).then((response) => {
              let len = response.data.length;
              if (len > 5) {
                loginEmployeeInfo.managersStatus = true;
              }
              response.data.forEach((item, index) => {
                loginEmployeeInfo.departmentManagers.push(item.depName);
              });
            });
          } else {
            loginEmployeeInfo.departmentManagers = null;
          }
        }
      })
      .then((response) => {
        // choose(loginEmployeeInfo.id);
      });
    // -------------------------------------变量-------------------------------------------

    /**
     * 查询所有员工
     */
    const queryEmployees = (pageInfo) => {
      listEmployee(pageInfo).then((res) => {
        employees.list = reactive(res.data.list);
      });
    };

    /**
     * 查询所有部门
     */

    const queryAllDepartment = () => {
      allDepartment.splice(0, allDepartment.length);
      listAllDepartment().then((res) => {
        if (res.code == 0) {
          let data = res.data.list;
          let existDepartments = employee.departments;
          data.forEach((department) => {
            if (department.pid != null && department.pid != 0) {
              let dept = {
                key: department.id.toString(),
                label: department.name,
              };
              allDepartment.push(dept);
            }
          });
        }
      });
    };
    // queryEmployees(pageInfo);
    /**
     * 查询所有角色及拥有该角色的员工
     */
    const queryAllRole = () => {
      const that = this;
      roleList.splice(0, roleList.length);
      employee.id = null;
      listAllRole()
        .then((res) => {
          return res.data;
        })
        .then((data) => {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const item = data[key];
              roleList.push(item);
              listEmployeeByRole(item.id).then((res) => {
                item.employees = res.data.list;
                roleList.splice(key, 1, item);
              });
            }
          }
        });
      WWOpenData.bindAll(document.getElementsByTagName("ww-open-data"));
    };
    /**
     * 切换为修改界面
     */
    const edit = () => {
      let authorityId = loginEmployeeInfo.role.id;
      let employeeRoleId = employee.role.id;
      if (authorityId === 3 || authorityId === employeeRoleId) {
        root.$message({
          type: "warning",
          message: "没有访问权限",
        });
      } else {
        isEdit.value = !isEdit.value;
      }
    };
    /**
     * 选择员工 获取详情
     */
    const choose = (id) => {
      console.log(employee,'emp')
      departmentList.splice(0, departmentList.length);
      queryAllDepartment();
      isEdit.value = false;
      getEmployee(id)
        .then((res) => {
          if (res.code == 0) {
            return res.data;
          }
          return null;
        })
        .then((data) => {
          selectEmpDepRoleByEmpId(data.id).then((res) => {
            if (res.code == 0) {
              let departments = [];
              res.data.forEach((p) => {
                let department = {
                  key: p.departmentId,
                  label: p.depName,
                };
                departments.push(department);
                allDepartment.forEach((p1, index) => {
                  if (p1.key == department.key) {
                    departmentList.push(p1.key);
                    // allDepartment.splice(index,1);
                  }
                });
              });
              data.departments = departments;
              let role = data.role;
              if (data.role == null) {
                data.role = { id: 3 };
              }
              roleId.value = data.role.id.toString();
              for (const key in data) {
                if (data.hasOwnProperty(key)) {
                  employee[key] = data[key];
                }
                if (key === "tel") {
                  if (data[key]) {
                    employee[key] = data[key];
                  } else {
                    employee[key] = "暂无";
                  }
                }
              }
            }
          });
        });
      WWOpenData.bindAll(document.getElementsByTagName("ww-open-data"));
    };
    /**
     * 选择部门
     */
    const chooseDepartments = (arg) => {
      departmentList = arg;
      employee.departments.splice(0, employee.departments.length);
      departmentList.forEach((key) => {
        allDepartment.forEach((department) => {
          if (department.key == key) {
            employee.departments.push(department);
          }
        });
      });
      dialogVisible.value = false;
    };
    /**
     * 显示部门列表
     */
    const showDepartments = () => {
      dialogVisible.value = !dialogVisible.value;
    };
    /**
     * 查询所有角色
     */
    queryAllRole();
    /**
     * 取消修改
     */
    const cancel = () => {
      isEdit.value = false;
    };
    /**
     * 显示没有角色的员工集合
     */
    const showEmployees = () => {
      listNotRoleEmployee(
        employeesNotRole.pageNum,
        employeesNotRole.pageSize
      ).then((res) => {
        if (res.code == 0) {
          let notRoleEmployees = res.data;
          cloneObjectToNull(notRoleEmployees, employeesNotRole);
          // notRoleEmployees.forEach(notRoleEmployee=>{
          //   employeesNotRole.push(notRoleEmployees);
          // })
          // employeesNotRole =reactive(res.data.list)
          dialogTableVisible.value = true;
        } else {
          root.$alert(res.msg, "错误", { confirmButtonText: "确定" });
        }
      });
    };

    /**
     * 选择员工
     */
    const chooseEmployee = (id) => {
      if (confirm("确定将该用户添加为管理员？")) {
        dialogTableVisible.value = false;
        choose(id);
        isEdit.value = true;
      }
    };
    /**
     * 提交修改
     */
    const submit = () => {
      const that = this;
      if (confirm("确定提交修改？")) {
        let data = {
          id: employee.id,
          roleId: roleId.value,
          departments: departmentList,
        };
        if (roleId.value == 2 || employee.role.id == 2) {
          editAdmin(data).then((res) => {
            if (res.code == 0) {
              root.$alert("提交成功。", "成功", { confirmButtonText: "确定" });
              queryAllRole();
            } else {
              root.$alert(res.msg, "失败", { confirmButtonText: "确定" });
            }
          });
        } else {
          editEmployee(data).then((res) => {
            if (res.code == 0) {
              root.$alert("提交成功。", "成功", { confirmButtonText: "确定" });
              queryAllRole();
            } else {
              root.$alert(res.msg, "失败", { confirmButtonText: "确定" });
            }
          });
        }
        isEdit.value = !isEdit.value;
      }
    };
    /**
     * 删除管理员
     */
    const delManager = () => {
      let authorityId = loginEmployeeInfo.role.id;
      let employeeRoleId = employee.role.id;
      if (authorityId === 3 || authorityId === employeeRoleId) {
        root.$message({
          type: "warning",
          message: "没有访问权限",
        });
      } else {
        if (confirm("确定删除该管理员？")) {
          let data = {
            id: employee.id,
          };
          if (roleId.value == 2 || employee.role.id == 2) {
            editAdmin(data).then((res) => {
              if (res.code == 0) {
                root.$alert("删除成功。", "成功", {
                  confirmButtonText: "确定",
                });
                queryAllRole();
              } else {
                root.$alert(res.msg, "失败", { confirmButtonText: "确定" });
              }
            });
          } else {
            editEmployee(data).then((res) => {
              if (res.code == 0) {
                root.$alert("删除成功。", "成功", {
                  confirmButtonText: "确定",
                });
                queryAllRole();
              } else {
                root.$alert(res.msg, "失败", { confirmButtonText: "确定" });
              }
            });
          }
          isEdit.value = !isEdit.value;
        }
      }
    };
    // -------------------------企业微信--------------------------------
    const callSDK = () => {
      let jsApiList = [];
      let fun = () => {
        WWOpenData.bindAll(document.getElementsByTagName("ww-open-data"));
      };
      jssdk(jsApiList, fun);
    };
    callSDK();
    const loadWWOpenData = () => {
      WWOpenData.bindAll(document.getElementsByTagName("ww-open-data"));
    };
    return {
      employees,
      roleList,
      choose,
      employee,
      isEdit,
      edit,
      submit,
      showDepartments,
      dialogVisible,
      allDepartment,
      departmentList,
      cancel,
      chooseDepartments,
      dialogTableVisible,
      employeesNotRole,
      showEmployees,
      chooseEmployee,
      delManager,
      roleId,
      loadWWOpenData,
      loginEmployeeInfo
    };
  },
};
</script>
<style lang="scss" scoped>
/**
 * main 中右侧的样式
 */
$border: 1px rgb(230, 230, 230) solid;
$corporationHeight: 655px;
.managerHead {
  width: 215px;
  height: 65px;
}
.label-info {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  line-height: 1;
  font-size: 16px;
  font-weight: 500;
}
.toolbar {
  text-align: center;
  line-height: 50px;
  height: 50px;
  width: 100%;
  border-bottom: $border;
}
.list {
  min-height: $corporationHeight;
  width: 23%;
  // height: 100%;
  border-right: $border;
}
.detail {
  min-height: $corporationHeight;
  width: 77%;
  // height: 100%;
  border-right: $border;
  padding: 25px;
}
.el-container {
  // height: $corporationHeight;
  min-height: $corporationHeight;
}
.el-form-item {
  margin-bottom: 22px;
}
.photo {
  min-width: 80px;
  height: 80px;
  border: 2px rgb(221, 221, 221) solid;
  // margin: 20px 0;
}
.image-slot,
.el-icon-picture-outline {
  min-width: 80px;
  height: 80px;
}
.el-icon-folder,
.el-icon-plus {
  color: rgb(0, 164, 240);
}
.el-icon-close:hover {
  color: rgb(0, 160, 235);
}
.department-icon {
  border: 1px rgb(221, 221, 221) solid;
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin-right: 20px;
  padding: 0 8px;
  cursor: pointer;
  width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .departSvg {
    margin-right: 5px;
  }
}
.department-icon:hover {
  border: 1px rgb(221, 221, 221) solid;
  background: rgb(240, 240, 240);
  display: inline-block;
  height: 30px;
  line-height: 30px;
  margin-right: 20px;
  padding: 0 8px;
}
.icon {
  margin: 0 2px;
}
.cnt_tool {
  height: 38px;
  width: 100%;
  background: #dfe9f5;
  padding: 6px 10px;
  border-bottom: 1px solid #bdc9d6;
  box-sizing: border-box;
}
.addBtn {
  width: 70%;
  background: #fff;
  color: #aaa;
  border-radius: 0;
  border-color: #aaa;
  font-weight: 700;
}
.addBtn:hover {
  background: #ededed;
}
.peopleSvg {
  width: 1.5em;
  height: 1.5em;
  margin-right: 10px;
}
.group {
  min-height: 94px;
  border-bottom: 1px solid #e4e6e9;
  padding: 30px 0 0;
}
.group-tail {
  min-height: 60px;
  // border-bottom: 1px solid #e4e6e9;
  padding: 30px 0 0;
}
</style>