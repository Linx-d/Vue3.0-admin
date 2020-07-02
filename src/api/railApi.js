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
    url: "/rail/listRail?pageNum=" + pageNum + "&pageSize=" + pageSize
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
    url: "/rail/addRail?latitude="+latitude+"&longitude="+longitude+"&radius="+radius+"&railName="+railName+"&railAddr="+railAddr+"&gmtCreate="+gmtCreate+"&gmtModified="+gmtModified+"&personSum="+personSum,
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
