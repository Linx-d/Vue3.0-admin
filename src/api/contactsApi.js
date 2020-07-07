import service from "@/utils/request"

/**
 * 查询所有部门
 *
 * @export
 * @param url id = number;
 * @returns data
 */
export function listAllDepartment() {
  return service.request({
    method: "get",
    url: "/dept/listAllDepartment",
  });
}

/**
 * 添加部门
 *
 * @export
 * @param {
    "name": "部门名",
    "pid": 1
    }
 * @returns
 */
export function addDepartment(data) {
  return service.request({
    method: "post",
    url: "/dept/addDepartment",
    data,
  });
}

/**
 * 修改部门信息
 *
 * @export
 * @param {
    "id": 7,
    "name": "修改部门名字",
    "pid": 0,
    "displayOrder": 10001
  }
* @returns
*/
export function updateDepartment(data) {
  return service.request({
    method: "post",
    url: "/dept/updateDepartment",
    data,
  });
}

/**
 * 添加部门成员
 *
 * @export
 * @param {
    "userId": [1,2,7],
    "depId": 7
  }
* @returns
*/
export function addMember(data) {
  return service.request({
    method: "post",
    url: "/dept/addMember", //url: "/dept/addMember?userId="+data.userId+"&depId="+data.depId
    data,
  });
}

/**
 * 删除部门
 *
 * @export
 * @param {
  "id": 6
}
* @returns
*/
export function removeDepartment(data) {
  return service.request({
    method: "post",
    url: "/dept/removeDepartment",
    data,
  });
}

/**
 * 查询部门成员
 *
 * @export
 * @param {
  "id": 6
}
* @returns
*/
export function listUserByDepartment(data) {
  return service.request({
    method: "post",
    url: "/dept/listUserByDepartment",
    data,
  });
}

/**
 * 查询未分组用户
 *
 * @export
 * @param
 * @returns
 */
export function listUserByNoDepartment(pageNum, pageSize) {
  return service.request({
    method: "get",
    url: "/dept/listUserByNoDepartment?pageNum=" + pageNum + "&pageSize=" + pageSize
  });
}

/**
 * 删除部门成员
 *
 * @export
 * @param
 * @returns
 */
export function removeMember(data) {
  return service.request({
    method: "post",
    url: "/dept/removeMember",
    data,
  });
}

/**
 * 查询子部门
 *
 * @export
 * @param
 * @returns
 */
export function listDepartmentByPid(data) {
  return service.request({
    method: "post",
    url: "/dept/listDepartmentByPid",
    data,
  });
}

/**---------------------------------------- 用户管理 ----------------------------------------**/
/**
 * 根据用户id获取历史数据信息
 *
 * @export
 * @param {
    "userId": 49
  }
 * @returns
 */
export function listUserLocationById(data) {
  return service.request({
    method: "post",
    url: "/deviceData/listUserLocationById?pageNum=" + 1 + "&pageSize=10&userId=" + data.userId
    
  });
}

/**
 * 根据用户id获取设备最新数据和告警信息
 *
 * @export
 * @param [1, 2]
 * @returns
 */
export function listDeviceAlarmInfoByUserId(data) {
  return service.request({
    method: "post",
    url: "/device/listDeviceAlarmInfoByUserId",
    data
  });
}