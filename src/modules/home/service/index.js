import axios from 'config/axios';
import { WEB_PREFIX } from 'config/apiConfig';

const apiUrl = {
  getApiList: (module, params) => axios.get(`${WEB_PREFIX}/api/v1/modules/${module}/gateways`, { params }), // 接口列表
  saveApi: (module, params) => axios.post(`${WEB_PREFIX}/api/v1/modules/${module}/gateways/pipelined`, params), // 创建接口
  editApi: (gatewayCode, params) => axios.put(`${WEB_PREFIX}/api/v1/pipelines/byGateway/${gatewayCode}`, params), // 更新接口
  changePublished: (gatewayCode, version) => axios.put(`${WEB_PREFIX}/api/v1/gateways/${gatewayCode}/${version}/published`, {}), // 发布
  changeOffline: (gatewayCode, version) => axios.put(`${WEB_PREFIX}/api/v1/gateways/${gatewayCode}/${version}/offline`, {}), // 下线
  deleteInterface: (gatewayCode, version, params) => axios.delete(`${WEB_PREFIX}/api/v1/gateways/${gatewayCode}/${version}`, { params }), // 删除
  getIsRename: (gatewayCode, version) => axios.get(`${WEB_PREFIX}/api/v1/gateways/${gatewayCode}/${version}/existed`, { }), // 判断接口是否重名
  getApiDetail: (gatewayCode, version) => axios.get(`${WEB_PREFIX}/api/v1/pipelines/byGateway/${gatewayCode}/${version}`, { }), // 接口详情
  getDataviewesCode: (params) => axios.post(`${WEB_PREFIX}/api/v1/dataviewes/debug`, params), // 获取debug Code视图DEBUG
  getConsoleCode: (params) => axios.post(`${WEB_PREFIX}/api/v1/datapackagers/debug`, params), // 获取debug Code
  getConsoleLog: (consoleCode) => axios.get(`${WEB_PREFIX}/api/v1/consoles/${consoleCode}/logs`, { }), // 获取控制台信息
  getDatasourceList: (projectCode, params) => axios.get(`${WEB_PREFIX}/api/v1/projects/${projectCode}/datasource`, { params }), // 获取数据源
  saveDatasource: (projectCode, params) => axios.post(`${WEB_PREFIX}/api/v1/projects/${projectCode}/datasource`, params), // 保存数据源
  testDatasource: (datasourceCode, params) => axios.post(`${WEB_PREFIX}/api/v1/datasource/${datasourceCode}/validated`, params), // 测试数据源
  updateApi:(module,gatewayCode,version, params) => axios.put(`${WEB_PREFIX}/api/v1/modules/${module}/gateways/${gatewayCode}/${version}/pipelined`, params),//修改Pipeline
};

export default apiUrl;
