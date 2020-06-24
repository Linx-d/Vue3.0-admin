const fullBollean = sessionStorage.getItem("full") === 'false' ? false : true;
const map = {
  state: {
    full: fullBollean
  },
  getters: {
    full: state => state.full
  },
  mutations: {
    SET_FULL(state){
      state.full = !state.full;
      sessionStorage.setItem('full', state.full);
    }
  },
  actions: {
  },
  modules: {
  }
}
export default map;