import { getLoginEmployee } from "@/api/employeeApi";
if (!sessionStorage.getItem("adminInfo")) {
  getLoginEmployee().then((res) => {
    let data = JSON.stringify(res);
    sessionStorage.setItem("adminInfo", data);
  });
}
// 使用
//console.log(JSON.parse(root.$store.state.corporation.adminInfo));
const corporation = {
  state: {
    adminInfo: sessionStorage.getItem("adminInfo"),
  },
  getters: {
    adminInfo: (state) => state.adminInfo,
  },
  mutations: {
    SET_ADMININFO() {},
  },
  actions: {},
  modules: {},
};
export default corporation;
