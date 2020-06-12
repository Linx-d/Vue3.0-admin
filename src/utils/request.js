import axios from "axios";
import { Message } from 'element-ui'; // 单独引入 Message：
//使用自定义配置新建一个 axios 实例
const service = axios.create({
  baseURL: "http://iot.chinautech.com/api",
  timeout: 1000
});

// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  let data = response.data;
  if(data.code !== 0) {
    console.log(data);
    Message.error(data.msg);
    return Promise.reject(data);
  }else {
    //return response; //所有相应数据
    console.log(data);
    Message.success(data.msg);
    return Promise.resolve(data); //只有data数据
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
export default service;