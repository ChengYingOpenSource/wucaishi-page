import axios from 'config/axios';
import { WEB_PREFIX } from 'config/apiConfig';

const apiUrl = {
  getModuleList: (projectCode, params) => axios.get(`${WEB_PREFIX}/api/v1/projects/${projectCode}/modules`, { params }), // 列表
  saveModule: (projectCode, params) => axios.post(`${WEB_PREFIX}/api/v1/projects/${projectCode}/modules`, params), // 添加
  editModule: (projectCode, moduleCode, params) => axios.put(`${WEB_PREFIX}/api/v1/projects/${projectCode}/modules/${moduleCode}`, params), // 编辑
  deleteModule: (projectCode, moduleCode) => axios.delete(`${WEB_PREFIX}/api/v1/projects/${projectCode}/modules/${moduleCode}`, { }), // 删除
};

export default apiUrl;
