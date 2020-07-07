<template>
  <div class="el-container">
    <div class="list">
      <div class="toolbar">
        <button>添加</button>
      </div>
      <div class="">
        <el-menu :default-openeds="['1']" default-active="2">
          <el-submenu
            :index="role.id + ''"
            v-for="(role, index) in roleList"
            :key="role.id"
            :value="role.id"
          >
            <template slot="title">
              <span>{{ role.name }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="employee in role.employees"
                :index="index + '-' + employee.id"
                :key="employee.id"
                :value="employee.id"
                @click="choose(employee.id)"
                >{{ employee.name }}</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
        <!-- <ul>
          <li v-for="employee in employees.list" :key="employee.id" :title="employee.name" @click="">{{employee.name}}</li>
        </ul> -->
      </div>
    </div>
    <div class="detail" v-if="employee.id !=null">
      <img :src="employee.photo" class="photo" />
      <el-form   label-width="100px">
        <el-form-item label="管理员姓名">
          <!-- <el-input v-model="employee.name" placeholder="请输入内容"></el-input> -->
          <label class="lable-info">{{employee.name}}</label>
        </el-form-item>
        <el-form-item label="联系电话">
          <label class="lable-info">{{employee.tel}}</label>
        </el-form-item>
        <el-form-item label="管理权限" v-if="!isEdit">
         <label class="lable-info">{{employee.role.name}}</label>
        </el-form-item>
        <el-form-item label="管理权限" v-else>
          <el-radio-group v-model="employee.role.id">
            <el-radio label="2">普通管理员</el-radio>
            <el-radio label="3">部门管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="管理范围">
          <div class="department-icon" v-for="department in employee.departments" :key="department.id">
            <i class="el-icon-folder icon"> </i>
            <label class="lable-info">{{department.depName}}</label>
            <i class="el-icon-close icon" v-if="isEdit" @click="deleteDepartment(department.departmentId)"></i>
          </div>  
          <div class="department-icon" v-if="isEdit" @click="showDepartments">
            <i class="el-icon-plus icon"> </i>
            <label class="lable-info">添加</label>
          </div> 
          <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="640px"
              center v-if="employee.role.id!=1" >
              <span>
                <el-transfer v-model="chooseDepartment" :data="allDepartment"></el-transfer>
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
              </span>
            </el-dialog>
        </el-form-item>
        <el-form-item label="注册时间">
          <label class="lable-info">{{employee.gmtCreate}}</label>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="edit()" v-if="!isEdit&&employee.role.id!=1" >编辑用户</el-button>
          <el-button type="primary" @click="submit()" v-else-if="isEdit">提交修改</el-button>
        </el-form-item>
        <el-form-item>
          <span>{{chooseDepartment}}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reactive, ref, watchEffect } from "@vue/composition-api";
import {
  listEmployee,
  listAllRole,
  listEmployeeByRole, 
  getEmployee,
  selectEmpDepRoleByEmpId,
  listAllDepartment
} from "@/api/employeeApi";
export default {
  name: "authority",
  setup(props, { root }) {

    /**
     * 部门列表显示
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
     * 角色集合
     */
    let roleList = reactive([]);

    
    let chooseDepartment = reactive([]) ;

    /**
     * 部门集合
     */
    let allDepartment =reactive([
      {
         key: 1,
        label: `备选项 1`,
        disabled: 1 % 4 === 0
      },{
         key: 2,
        label: `备选项2`,
        disabled: 2 % 4 === 0
      },{
        key: 3,
        label: `备选项 3`,
        disabled: 3 % 4 === 0
      }
    ]);
    /**
     * 员工信息集合
     */
    let employees = reactive({});

    
    /**
     * 员工信息详情
     */
    let employee = reactive({
      id:null,
      name:'123',
      role:{
        id:1,
        name:'role'
      },
      tel:'',
      gmtCreate:''
    });

    /**
     * 查询所有员工
     */
    const queryEmployees = (pageInfo) => {
      listEmployee(pageInfo).then((res) => {
        employees.list = reactive(res.data.list);
      });
    };


    
    const queryAllDepartment=()=>{
      listAllDepartment().then((res)=>{
        if(res.code==0){
          let data = res.data;
          let existDepartments = employee.departments;
          data.forEach(department => {
            if(existDepartments!=null){
              existDepartments.forEach(ed=>{
                if (department.id!=ed.id) {
                  allDepartment.push(department);
                }
              })
            }
          });
        }
      })
    }
    queryEmployees(pageInfo);
   
     /**
     * 查询所有角色及拥有该角色的员工
     */
    const queryAllRole = () => {
      listAllRole()
        .then((res) => {
          return res.data;
        })
        .then((data) => {1
          data.forEach((item) => {
            listEmployeeByRole(item.id).then((res) => {
              item.employees = res.data;
              roleList.push(item);
            });
          });
        });
    };
    /**
     * 修改员工信息
     */
    const submit=()=>{
      if(confirm("确定提交修改？")){
        edit.value=!edit.value;
      }
    }
    /**
     * 切换为修改界面
     */
    const edit =()=>{
      isEdit.value=!isEdit.value;
    };
    /**
     * 选择员工 获取详情
     */
    const choose =(id)=>{
      isEdit.value=false;
      getEmployee(id).then((res)=>{
        if(res.code==0){
          return res.data;
        }
        return null;
      })
      .then((data)=>{
        selectEmpDepRoleByEmpId(data.id).then((res)=>{
          if(res.code==0){
            data.departments =res.data;
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                employee[key] =data[key];       
              }
            }
          }
        })
        queryAllDepartment();
      })
    };
    const showDepartments=()=>{
      dialogVisible.value=!dialogVisible.value;
    }
    queryAllRole();
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
      chooseDepartment
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
.lable-info{
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  line-height: 1;
  font-size: 16px;
  font-weight:500;
}
.toolbar {
  height: 40px;
  width: 100%;
  border-bottom: $border;
}
.list {
  min-height: $corporationHeight;
  width: 23%;
  // height: 100%;
  border-right: $border;
}
.detail{
  min-height: $corporationHeight;
  width: 77%;
  // height: 100%;
  border-right: $border;
  padding: 40px;
}
.el-container {
  // height: $corporationHeight;
  min-height: $corporationHeight;
}
.el-form-item{
  margin-bottom: 22px;
}
.photo{
  height: 80px;
  border: 2px rgb(221, 221, 221) solid;
  margin: 50px 0;
}
.el-icon-folder,.el-icon-plus{
  color: rgb(0, 164, 240);
}
.el-icon-close:hover{
  color: rgb(0, 160, 235);
}
.department-icon{
  border: 1px rgb(221, 221, 221) solid;
  display:inline-block;
  height: 30px;
  line-height: 30px;
  margin-right: 20px;
  padding: 0 8px;
}
.department-icon:hover{
  border: 1px rgb(221, 221, 221) solid;
  background: rgb(240, 240, 240);
  display:inline-block;
  height: 30px;
  line-height: 30px;
  margin-right: 20px;
  padding: 0 8px;
}
.icon{
  margin:0 2px;
}
</style>