import service from "@/utils/request"

/**
 * 获取企业信息
 *
 * @export
 * @param 
 * @returns data
 */
export function getCorpInfo() {
  return service.request({
    method: "post",
    url: "/corp/getCorpInfo"
  });
}

/**
 * 修改企业
 *
 * @export
 * @param {
  name: 'name'}
 * @returns data
 */
export function updateCorporation(data) {
  return service.request({
    method: "post",
    url: "/corp/updateCorporation",
    data
  });
}