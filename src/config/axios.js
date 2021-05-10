import Axios from 'axios';

const axios = Axios.create({
  withCredentials: true, // 用于支持跨域
});
axios.interceptors.request.use((request) => {
  return request;
}, (error) => {
  return Promise.reject(error);
});
// 返回过滤器
axios.interceptors.response.use((response) => {
  const result = response.data;
  return result;
}, (error) => {
  return Promise.reject(error);
});
export default axios;
export const get = axios.get.bind(axios);
export const post = axios.post.bind(axios);
export const options = axios.options.bind(axios);
export const request = axios.request.bind(axios);
