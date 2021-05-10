import axios from 'config/axios';
import { WEB_PREFIX, MOCK_PREFIX } from 'config/apiConfig';

const apiUrl = {
  getDataviewesType: () => axios.get(`${WEB_PREFIX}/api/v1/dataviewes/types`), // 获取视图类型枚举
  getScriptTypes: () => axios.get(`${WEB_PREFIX}/api/v1/datapackagers/scriptTypes`), // 可执行脚本类型
  getDatastructuresTypes: () => axios.get(`${WEB_PREFIX}/api/v1/datastructures/types`), // 数据格式类型
};
export default apiUrl;
