import axios from "axios";
import { Message } from 'element-ui';
import { getParemter } from "@/utils/common" 
//使用自定义配置新建一个 axios 实例
const service = axios.create({
  baseURL: "http://111.231.188.211:8888/api" // http://iot.chinautech.com/api http://192.168.0.192:8888/api http://192.168.0.180:8888/api 林
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    let token = getParemter("auth_token");
    if(token==null){
      token = sessionStorage.getItem("auth_token");
    }else{
      sessionStorage.setItem("auth_token",token);
    }
    config.headers.auth_token=token;
    // 在发送请求之前做些什么
    return config;
  },
  (error) => {
    console.log(error)
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    let data = response.data;
    if (data.code !== 0) {
      //console.log(data);
      Message.error(data.msg);
      return Promise.resolve(data);  //return Promise.reject(data);
    } else {
      //return response; //所有相应数据
      //console.log(data);
      //Message.success(data.msg);
      return Promise.resolve(data); //只有data数据
    }
  },
  function(error) {
    let status = error.response.status;
    if(status==403){
      const url = window.location.href;
      Message.error("请先登录！");
      window.location.href="http://iot.chinautech.com/api/qywx/login?redirectUrl="+url;
    }
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
export default service;
