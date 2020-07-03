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
