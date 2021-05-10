import Axios from 'axios';


const axios = Axios.create({
  withCredentials: true, // 用于支持跨域
});

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const request = (url, data, method) => {
  return axios({
    method,
    url,
    data,
  });
};

export const post = (url, data) => {
  return request(url, data, 'post');
};

export const put = (url, data) => {
  return request(url, data, 'put');
};

export const get = (url, data) => {
  return request(url, data, 'get');
};
