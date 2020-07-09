const isLogin = sessionStorage.getItem("isLogin") === 'true' ? true:false;
const login = {
    state:{
        isLogin:isLogin,
        token:""
    },
    getters:{
        isLogin:state=>state.isLogin,
        token:state=>state.token
    },
    mutations:{
        SET_IS_LOGIN(state){
            state.isLogin=!state.isLogin;
            sessionStorage.setItem("isLogin",state.isLogin);
        },
        SET_TOKEN(state,token){
            state.token=token;
            sessionStorage.setItem("token",state.token);
        }
    },actions:{
    },
    modules:{
    }
}
export default login;
