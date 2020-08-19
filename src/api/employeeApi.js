import service from "@/utils/request";

/**
 * 获取企业所有员工
 *
 */
export function listEmployee() {
  return service.request({
    method: "GET",
    url: "/employee/listEmployee",
  });
}
export function listAllDepartment() {
  return service.request({
    method: "GET",
    url: "/dept/listAllDepartment",
  });
}

export function listAllRole() {
  return service.request({
    method: "GET",
    url: "/auth/listAllRole",
  });
}
export function listEmployeeByRole(id) {
  return service.request({
    method: "GET",
    url: "/employee/listEmployeeByRole?roleId=" + id,
  });
}

export function getEmployee(id) {
  return service.request({
    method: "GET",
    url: "/employee/getEmployee?id=" + id,
  });
}

export function selectEmpDepRoleByEmpId(id) {
  return service.request({
    method: "GET",
    url: "/deptM/selectEmpDepRoleByEmpId?empId=" + id,
  });
}

/**获取当前登录的员工信息
 *
 */
export function getLoginEmployee() {
  return service.request({
    method: "GET",
    url: "/employee/getLoginEmployee",
  });
}

export function getLoginInfo(employeeInfo) {
  return getLoginEmployee().then((res) => {
    let data = res.data;
    let roleId = data.role ? data.role.id : null;
    employeeInfo.id = data.id;
    employeeInfo.name = data.name;
    employeeInfo.tel = data.tel;
    employeeInfo.gmtCreate = data.gmtCreate || "暂无";
    employeeInfo.gmtModified = data.gmtModified || "暂无";
    employeeInfo.corpUserId = data.corpUserId || "暂无";
    employeeInfo.identity = data.role ? data.role.name : "暂无";
    employeeInfo.role = data.role || "暂无";
    employeeInfo.roleId = employeeInfo.role.id;
    employeeInfo.corpId = employeeInfo.corpId;
    if (roleId === 1) {
      employeeInfo.departmentManagers = "所有部门";
      employeeInfo.photo = "superManager";
    } else if (roleId === 2) {
      employeeInfo.departmentManagers = "所有部门";
      employeeInfo.photo = "normalManager";
    } else if (roleId === null) {
      employeeInfo.departmentManagers = null;
      employeeInfo.photo = "departManager_no";
    } else {
      employeeInfo.photo = "departManager";
      let departManagers = data.departmentManagers;
      employeeInfo.departmentManagers = [];
      if (departManagers != null && departManagers.length > 0) {
        selectEmpDepRoleByEmpId(data.id).then((response) => {
          let len = response.data.length;
          if (len > 5) {
            employeeInfo.managersStatus = true;
          }
          response.data.forEach((item, index) => {
            employeeInfo.departmentManagers.push(item.depName);
          });
        });
      } else {
        employeeInfo.departmentManagers = null;
      }
    }
  });
}

export function editEmployee(data) {
  return service.request({
    method: "POST",
    url: "/employee/editEmployee",
    data: data,
  });
}

export function editAdmin(data) {
  return service.request({
    method: "POST",
    url: "/employee/editAdmin",
    data: data,
  });
}

export function listNotRoleEmployee(pageNum, pageSize) {
  let data = new URLSearchParams();
  data.append("pageNum", pageNum);
  data.append("pageSize", pageSize);
  return service.request({
    method: "GET",
    url:
      "/employee/listNotRoleEmployee?pageNum=" +
      pageNum +
      "&pageSize=" +
      pageSize,
  });
}

/**
 * 修改员工
 *
 * @export
 * @param {
   name: 'name'
}
* @returns data
*/
export function updateEmployee(data) {
  return service.request({
    method: "post",
    url: "/employee/updateEmployee",
    data,
  });
}

/**
 * 修改员工信息（无权限验证）
 *
 * @export
 * @param {
            id: 'id',
            name: 'name'
            }
* @returns data
*/
export function updateEmployeeNotAuth(data) {
  return service.request({
    method: "post",
    url: "/employee/updateEmployeeNotAuth",
    data,
  });
}
