import axios from 'config/axios';
import { WEB_PREFIX } from 'config/apiConfig';

const apiUrl = {
  getProjectList: (params) => axios.get(`${WEB_PREFIX}/api/v1/projects`, { params }), // 项目列表
  saveProject: (params) => axios.post(`${WEB_PREFIX}/api/v1/projects`, params), // 添加项目
  editProject: (projectCode, params) => axios.put(`${WEB_PREFIX}/api/v1/projects/${projectCode}`, params), // 编辑项目
  deleteProject: (projectCode) => axios.delete(`${WEB_PREFIX}/api/v1/projects/${projectCode}`), // 删除项目
};

export default apiUrl;
