<template>
  <main id="contacts" class="frame_center">
    <div class="contacts_main frame_center_main">
      <div class="chunk_title">contacts</div>
      <div class="chunk_cnt">
        <el-button :plain="true" @click="open4">成功</el-button>
      </div>
    </div>
  </main>
</template>

<script>
import {
  addDepartment,
  listAllDepartment,
  updateDepartment,
  addMember,
  removeDepartment,
  listUserByDepartment,
  listUserByNoDepartment,
  removeMember,
  listDepartmentByPid
} from "@/api/contactsApi";
import { onMounted } from "@vue/composition-api";
export default {
  name: "contacts",
  setup(props, { root }) {
    let open4 = () => {
      //查询部门成员
      let listUserId = new URLSearchParams();
      listUserId.append("id", 7);
      listUserByDepartment(listUserId)
      .then(response => {
        root.$message.success(response.msg);
      });
    };
    onMounted(() => {
      console.log("挂载完成");

      //查询所有部门
      listAllDepartment();


      //添加部门
      addDepartment({
        name: "部门名",
        pid: 7
      });

      //修改部门信息
      updateDepartment({
        id: 7,
        name: "修改部门名字",
        pid: 0,
        displayOrder: 10001
      });

      //添加部门成员
      let params = new URLSearchParams();
      params.append("userId", [1, 2, 7]);
      params.append("depId", 7);
      addMember(params);

      //删除部门
      let removeDepartmentId = new URLSearchParams();
      removeDepartmentId.append("id", 72);
      //removeDepartment(removeDepartmentId);

      //查询部门成员
      let listUserId = new URLSearchParams();
      listUserId.append("id", 7);
      listUserByDepartment(listUserId);

      //查询未分组用户
      listUserByNoDepartment();

      //删除部门成员
      let removeMemberParams = new URLSearchParams();
      removeMemberParams.append("userIds", [1, 2, 7]);
      removeMemberParams.append("depId", 7);
      removeMember(removeMemberParams);

      //移动部门成员

      //查询子部门
      let listPidParams = new URLSearchParams();
      listPidParams.append("id", 1);
      listDepartmentByPid(listPidParams);
    });
    return { open4 };
  }
};
</script>

<style lang="scss" scoped>
</style>