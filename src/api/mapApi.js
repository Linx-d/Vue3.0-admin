import service from "@/utils/request";

/**
 * 根据用户id获取历史数据信息
 *
 * @export
 * @param {
    "userId": 49
  }
 * @returns data
 */
export function listUserLocationById(data) {
  let pageNum = data.pageNum,
    pageSize = data.pageSize,
    content = data.params;
  return service.request({
    method: "post",
    url:
      "/deviceData/listUserLocationById?page=" + pageNum + "&limit=" + pageSize,
    content,
  });
}

/**
 * 修改用户信息
 *
 * @export
 * @param {
    "id": "1",
    "name": "用户名",
    "tel": "18888888888",
    "sex": "女",
    "age": "18",
    "address": "重庆市北碚区"
}
* @returns data
*/
export function updateUser(data) {
  return service.request({
    method: "post",
    url: "/user/updateUser",
    data,
  });
}

/**
 * 获取所有已经解绑用户
 *
 * @export
 * @param null
 * @returns data
 */
export function findAllUserUntie(data) {
  return service.request({
    method: "get",
    url: "/userUntie/findAllUserUntie",
    data,
  });
}

/**
 * 通过id获取解绑用户信息
 *
 * @export
 * @param null
 * @returns data
 */
export function getUserUntieById(data) {
  return service.request({
    method: "post",
    url: "/userUntie/getUserUntieById?userId=" + data,
  });
}

/**
 * 获取用户告警信息
 *
 * @export
 * @param {
    "userId": 49
  }
 * @returns data
 */
export function getAlarmByUserId(data) {
  return service.request({
    method: "post",
    url: "/alarm/getAlarmByUserId",
    data,
  });
}

/**
 * 获取告警统计
 *
 * @export
 * @param null
 * @returns data
 */
export function getAlarmView() {
  return service.request({
    method: "post",
    url: "/alarm/getAlarmView",
  });
}

/**
 * 获取历史告警数据
 *
 * @export
 * @param null
 * @returns data
 */
export function listAlarmView() {
  return service.request({
    method: "post",
    url: "/alarm/listAlarmView",
  });
}

/**
 * 获取用户最新位置信息
 *
 * @export
 * @param null
 * @returns data
 */
export function listUserLocation() {
  return service.request({
    method: "post",
    url: "/deviceData/listUserLocation",
  });
}
/**
 * 设备上传数据
 *
 * @export
 * @param {
    "imei": "ut1000001000000",
    "temperature": "39.8",
    "latitude": "29.490295",
    "type":"0",
    "longitude": "106.486654",
    "electric": "2"
}
 * @returns data
 */
export function add(data) {
  return service.request({
    method: "post",
    url: "/deviceData/add",
    data,
  });
}

/**
 * 模糊搜索用户
 *
 * @export
 * @param {
  "keyword": "",
  "scope": "all",
  "pageNum": 1,
  "pageSize": 10
}
* @returns data
*/
export function fuzzySearch(data) {
  return service.request({
    method: "get",
    url: "/user/fuzzySearch",
    data,
  });
}

/**
 * 根据用户id获取设备最新数据和告警信息
 *
 * @export
 * @param [10001]
* @returns data
*/
export function listDeviceAlarmInfoByUserId(data) {
  return service.request({
    method: "post",
    url: "/device/listDeviceAlarmInfoByUserId",
    data,
  });
}

/**
 * 查询当日新增告警用户
 *
 * @export
 * @param null
* @returns data
*/
export function listAddAlarmUser() {
  return service.request({
    method: "get",
    url: "/user/listAddAlarmUser",
  });
}

/**
 * 查询当日新增告警数据
 *
 * @export
 * @param null
* @returns data
*/
export function listAddAlarmData() {
  return service.request({
    method: "get",
    url: "/deviceData/listAddAlarmData",
  });
}