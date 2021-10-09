import axios from 'axios';
import {ElMessage} from "element-plus";

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        config.withCredentials = true;
        return config;
    },
    error => {
        console.log(error);
        ElMessage.error(error);
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    response => {
        console.log(response);
        if (response.status === 200) {
            return response.data;
        } else if (response.status === 500) {
            ElMessage.error(response.data.msg);
            return Promise.reject(response);
        } else {
            ElMessage.error(response.data);
            return Promise.reject(response);
        }
    },
    error => {
        console.log(error);
        ElMessage.error(error);
        return Promise.reject(error);
    }
);

export default service;
