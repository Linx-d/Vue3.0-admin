sessionStorage.setItem('modifyCorporationInfo', 'false');
const corporation = {
  state: {
    corporInfo: sessionStorage.getItem("modifyCorporationInfo"),
  },
  getters: {
    corporInfo: (state) => state.CorporInfo,
  },
  mutations: {
    SET_CORPORINFO(state) {
      state.corporInfo = 'true';
      sessionStorage.setItem('modifyCorporationInfo', state.corporInfo);
    },
    SET_CORPORINFOFALSE(state) {
      state.corporInfo = 'false';
      sessionStorage.setItem('modifyCorporationInfo', state.corporInfo);
    },
  },
  actions: {},
  modules: {},
};
export default corporation;
