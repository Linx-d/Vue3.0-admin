<template>
  <div class="el-container">
    <div class="list">
      <div class="toolbar">
        <el-row>
          <el-button style="width:70%;" size="mini">添加管理员</el-button>
        </el-row>
      </div>
      <el-menu >
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
    </div>
    <div class="detail" v-if="employee.id !=null">
      <div class="cnt_tool">
        <a href="javascript:;" class="memberLink"  @click="edit()" v-if="!isEdit&&employee.role.id!=1">编辑用户</a>
      </div>
      <el-image :src="employee.photo" class="photo">
      </el-image>
      <el-form   label-width="100px">
        <el-form-item label="管理员姓名">
          <label class="label-info">{{employee.name}}</label>
        </el-form-item>
        <el-form-item label="联系电话">
          <label class="label-info">{{employee.tel}}</label>
        </el-form-item>
        <el-form-item label="管理权限" v-if="!isEdit">
         <label class="label-info">{{employee.role.name}}</label>
        </el-form-item>
        <el-form-item label="管理权限" v-else>
          <el-radio-group v-model="roleId">
            <el-radio label=2 style="margin-right:20px;">普通管理员</el-radio>
            <el-radio label=3 >部门管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="管理范围">
          <template v-if="roleId==3">
            <div class="department-icon" style="width:50px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" :title="department.label" v-for="department in employee.departments" :key="department.id">
              <i class="el-icon-folder icon"> </i>
              <label class="label-info">{{department.label}}</label>
            </div>  
            <br/>
            <div class="department-icon" v-if="isEdit" @click="showDepartments">
              <i class="el-icon-edit icon"> </i>
              <label class="label-info">编辑</label>
            </div> 
            <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="640px"
              center v-if="employee.role.id!=1" >
              <span>
                <el-transfer 
                  v-model="departmentList"  
                  :data="allDepartment"
                  ></el-transfer>
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="chooseDepartments(departmentList)">完  成</el-button>
              </span>
            </el-dialog>
          </template>
          <template v-else>
            <label class="label-info">所有部门</label>
          </template>
        </el-form-item>
        <el-form-item label="注册时间">
          <label class="label-info">{{employee.gmtCreate}}</label>
        </el-form-item>
        <el-form-item>
          <template v-if="isEdit">
              <el-button type="primary" @click="submit()" >提  交</el-button>
              <el-button type="primary" @click="cancel()" >取  消</el-button>
          </template>
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
  listAllDepartment,
  editAdmin,
  editEmployee
} from "@/api/employeeApi";
import { all } from 'cookie_js';
export default {
  name: "authority",
  setup(props, { root }) {
    /**
     * 修改后的role
     */
    let roleId = ref('2');

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

    /**
     * 拥有的部门
     */
    let departmentList = reactive([]) ;
    /**
     * 部门集合
     */
    let allDepartment =reactive([
      {
         key: 1,
        label: `备选项 1`
      },{
         key: 2,
        label: `备选项2`
      },{
        key: 3,
        label: `备选项 3`
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
      console.log("================================queryAllDepartment===============================")
      allDepartment.splice(0,allDepartment.length);
      listAllDepartment().then((res)=>{
        if(res.code==0){
          let data = res.data;
          let existDepartments = employee.departments;
            data.forEach(department => {
              let dept = {
                 key:department.id.toString(),
                 label:department.name
              }
              allDepartment.push(dept);
            });
            console.log(allDepartment,"allDepartment");
        }
      })
    }
    // queryEmployees(pageInfo);
   
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
              item.employees = res.data.list;
              roleList.push(item);
            });
          });
        });
    };
    /**
     * 提交修改
     */
    const submit=()=>{
      const that = this;
      if(confirm("确定提交修改？")){
        let data = {
            id:employee.id,
            roleId:roleId.value,
            departments:departmentList
          }
          console.log(roleId.value==2||employee.role.id==2,roleId,"roleId",employee.role.id)
        if(roleId.value==2||employee.role.id==2){
          editAdmin(data).then(res=>{
            if(res.code==0){
              root.$alert('提交成功。', '成功', {confirmButtonText: '确定'});
            }else{
              root.$alert(res.msg, '失败', {confirmButtonText: '确定'});
            }
          })
        }else{
          editEmployee(data).then(res=>{
            if(res.code==0){
              root.$alert('提交成功。', '成功', {confirmButtonText: '确定'});
            }else{
              root.$alert(res.msg, '失败', {confirmButtonText: '确定'});
            }
          })
        }
        isEdit.value=!isEdit.value;
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
      departmentList.splice(0,departmentList.length);
      queryAllDepartment();
      
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
            let departments =[];
            res.data.forEach(p => {
              let department = {
                key:p.departmentId,
                label:p.depName
              };
              departments.push(department);
              allDepartment.forEach((p1,index)=>{ 
                if(p1.key==department.key){
                  departmentList.push(p1.key)
                  // allDepartment.splice(index,1);
                }
              });
            });
            data.departments = departments;
            roleId.value = data.role.id.toString();
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                employee[key] = data[key];
              }
            }
          }
        })
        
      })
    };

    /**
     * 选择部门
     */
    const chooseDepartments =(arg)=>{
      departmentList = arg;
      employee.departments.splice(0,employee.departments.length);
      console.log(departmentList,"departmentList")
      departmentList.forEach(key=>{
        allDepartment.forEach(department=>{
            if(department.key==key){
              employee.departments.push(department);
            }
        })
      })
      dialogVisible.value=false;
    }
    const showDepartments=()=>{
      dialogVisible.value=!dialogVisible.value;
    }
    queryAllRole();
    const cancel=()=>{
       isEdit.value=false;
    }
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
      roleId
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
.label-info{
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  line-height: 1;
  font-size: 16px;
  font-weight:500;
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
.detail{
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
.el-form-item{
  margin-bottom: 22px;
}
.photo{
  min-width: 80px;
  height: 80px;
  border: 2px rgb(221, 221, 221) solid;
  margin: 50px 0;
}
.image-slot,.el-icon-picture-outline{
  min-width: 80px;
  height: 80px;
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
.cnt_tool {
  height: 38px;
  width: 100%;
  background: #dfe9f5;
  padding: 6px 10px;
  border-bottom: 1px solid #bdc9d6;
  box-sizing: border-box;
}
</style>