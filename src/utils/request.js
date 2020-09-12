//引入axios
import axios from 'axios';
import { Message } from 'element-ui';

const BASEURL =  process.env.NODE_ENV === "production" ? "" : "/api";
//创建实例拦截器
const service = axios.create({
    baseURL:BASEURL,
    timeout: 1000
});

//打印开发环境情况
console.log(process.env.NODE_ENV);

console.log(process.env.VUE_APP_TEST)

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
    // 判断响应的数据的resCode
    let data = response.data;
    if(data.resCode != 0 ){
       Message.error(data.message);
       return Promise.reject(data);
    }
   console.log(response);
   return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

 // 为给定 ID 的 user 创建请求
            // axios.get('/user?ID=12345')
            // .then(function (response) {
            //     console.log(response);
            // })
            // .catch(function (error) {
            //     console.log(error);
            // });
            //axios的POST请求
            // axios.post('/user', {
            //     firstName: 'Fred',
            //     lastName: 'Flintstone'
            // })
            // .then(function (response) {
            //     console.log(response);
            // })
            // .catch(function (error) {
            //     console.log(error);
            // });
            //实战项目中常用的axios请求方式
            // axios.request({
            //     method: 'get',
            //     url: '/user/12345',
            //     data: {
            //     firstName: 'Fred',
            //     lastName: 'Flintstone'
            //     }
            // });

//导出
export default service;