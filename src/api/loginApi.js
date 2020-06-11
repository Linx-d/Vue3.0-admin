import service from "@/utils/request";
export function getSms(data) {
  // 为给定 ID 的 user 创建请求
  service.request({
    method: "post",
    url: "/dept/listUserByDepartment?id=" + data
  });
}