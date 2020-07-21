import service from "@/utils/request"

/**
 * 获取企业所有员工
 * 
 */
export function listEmployee(){
    return service.request({
        method:"GET",
        url:"/employee/listEmployee"
    })
}
export function listAllDepartment(){
    return service.request({
        method:"GET",
        url:"/dept/listAllDepartment"
    })
}

export function listAllRole(){
    return service.request({
        method:"GET",
        url:"/auth/listAllRole"
    })
}
export function listEmployeeByRole(id){
    return service.request({
        method:"GET",
        url:"/employee/listEmployeeByRole?roleId="+id
    })
}

export function getEmployee(id){
    return service.request({
        method:"GET",
        url:"/employee/getEmployee?id="+id
    })
}

export function selectEmpDepRoleByEmpId(id){
    return service.request({
        method:"GET",
        url:"/deptM/selectEmpDepRoleByEmpId?empId="+id
    })
}

/**获取当前登录的员工信息
 * 
 */
export function getLoginEmployee(){
    return service.request({
        method:"GET",
        url:"/employee/getLoginEmployee"
    })
}

export function editEmployee(data){
    return service.request({
        method:"POST",
        url:"/employee/editEmployee",
        data:data
    })
}

export function editAdmin(data){
    return service.request({
        method:"POST",
        url:"/employee/editAdmin",
        data:data
    })
}

export function listNotRoleEmployee(pageNum,pageSize){
    let data = new URLSearchParams();
    data.append("pageNum",pageNum);
    data.append("pageSize",pageSize);
    return service.request({
        method:"GET",
        url:"/employee/listNotRoleEmployee?pageNum="+pageNum+"&pageSize="+pageSize
    })
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
    data
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
    data
  });
}