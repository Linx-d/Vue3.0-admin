import service from "@/utils/request";

/**
 * 获取所有围栏信息
 *
 * @export
 * @param { pageSize: 10, pageNum: 1}
 * @returns data
 */
export function listRail(data) {
  let pageNum = data.pageNum,
    pageSize = data.pageSize;
  return service.request({
    method: "post",
    url: "/rail/listRail?pageNum=" + pageNum + "&pageSize=" + pageSize,
  });
}

/**
 * 增加围栏
 *
 * @export
 * @param {
      latitude: "1212.21",
      longitude: "32125.2134",
      radius: "200",
      railName: "围栏6",
      railAddr: "万寿福居",
      gmtCreate: new Date(),
      gmtModified: new Date(),
      personSum: 0
    }
 * @returns data
 */
export function addRail(data) {
  let latitude = data.latitude,
    longitude = data.longitude,
    radius = data.radius,
    railName = data.railName,
    railAddr = data.railAddr,
    gmtCreate = data.gmtCreate,
    gmtModified = data.gmtModified,
    personSum = data.personSum;
  return service.request({
    method: "post",
    url:
      "/rail/addRail?latitude=" +
      latitude +
      "&longitude=" +
      longitude +
      "&radius=" +
      radius +
      "&railName=" +
      railName +
      "&railAddr=" +
      railAddr +
      "&gmtCreate=" +
      gmtCreate +
      "&gmtModified=" +
      gmtModified +
      "&personSum=" +
      personSum,
    data,
  });
}

/**
 * 删除围栏
 *
 * @export
 * @param {
    "id": 2
  }
* @returns data
*/
export function deleteRail(data) {
  return service.request({
    method: "post",
    url: "/rail/deleteRail",
    data,
  });
}

/**
 * 修改围栏信息
 *
 * @export
 * @param {
    "latitude": "1212.21",
    "longitude": "32125.2134",
    "radius": "200",
    "railName": "围栏1",
    "id": 2,
    "railAddr": "null"
}
* @returns data
*/
export function updateRail(data) {
  return service.request({
    method: "post",
    url: "/rail/updateRail",
    data,
  });
}

/**
 * 围栏批量绑定用户
 *
 * @export
 * @param {railId: 1, userId: [10000,10001,10002,10003]}
 * @returns data
 */
export function batchUpdateUser(data) {
  let railId = data.railId,
    userId = data.userId;
  return service.request({
    method: "post",
    url: "/rail/batchUpdateUser?railId=" + railId + "&userId=" + userId
  });
}

/**
 * 获取指定用户的所有围栏
 *
 * @export
 * @param {userId: 10001}
 * @returns data
 */
export function queryRailByUserId(data) {
  return service.request({
    method: "post",
    url: "/rail/queryRailByUserId?userId=" + data
  });
}

/**
 * 获取指定围栏的所有用户
 *
 * @export
 * @param {railId: 1}
 * @returns data
 */
export function listUserByRail(data) {
  return service.request({
    method: "post",
    url: "/rail/listUserByRail?railId=" + data
  });
}

/**
 * 获取未绑定围栏的所有用户
 *
 * @export
 * @param {pageSize, pageNum}
 * @returns data
 */
export function listUserByNoRail(data) {
  let pageNum = data.pageNum,
  pageSize = data.pageSize;
  return service.request({
    method: "post",
    url: "/rail/listUserByNoRail?pageNum=" + pageNum + "&pageSize=" + pageSize
  });
}

/**
 * 查询围栏名称是否可用
 *
 * @export
 * @param {railName: '围栏1'}
 * @returns data
 */
export function queryRailByName(data) {
  let railName = data.railName;
  return service.request({
    method: "post",
    url: "/rail/queryRailByName?railName=" + railName
  });
}

/**
 * 获取指定围栏的用户信息和设备信息
 *
 * @export
 * @param {railName: '围栏1'}
 * @returns data
 */
export function listUserInfoByRail(data) {
  return service.request({
    method: "post",
    url: "/rail/listUserInfoByRail?railId=" + data
  });
}