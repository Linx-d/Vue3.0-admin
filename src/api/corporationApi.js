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