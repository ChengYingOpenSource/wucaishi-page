import { observable, action, runInAction, computed } from 'mobx';
import { queryURL, JSONParse } from '@/lib/utils';
import history from '@/lib/history';
import API from './index';
import { message } from 'antd';

class Store {
  @observable list = [];

  @observable loading = false;

  @observable filter = {
    pageNum: 1,
    pageSize: 10,
    total: 0,
    status: queryURL('status') === '1' ? '1' : '0',
  };

  @observable statusObj = {
    0: '待上线',
    1: '已上线',
  };

  @observable step = Number(localStorage.getItem('createStep') || 0);

  @observable formValues = {
    version: '0.0.1',
    scriptType: 'groovy',
    fk:false,
  };

  @observable datasourceList = [];

  @observable methodType = ['GET', 'POST', 'PUT', 'DELETE'];

  @computed get appInfo() {
    const app = JSONParse(sessionStorage.getItem('app') || '{}') || {};
    if (!app.code) {
      history.replace('/home');
      return {};
    }
    if (!app.appKey) {
      history.replace('/group');
      return {};
    }
    return app;
  }

  @action async getApiList() {
    runInAction(() => {
      this.loading = true;
    });
    const res = await API.getApiList(this.appInfo.appKey, {
      ...this.filter,
    });
    if (res.success) {
      runInAction(() => {
        this.list = res.data.list || [];
        this.loading = false;
        this.filter = {
          ...this.filter,
          ...res.data.pagination,
        };
      });
    } else {
      message.error(res.msg);
      history.replace('/group');
    }
  }

  @action async filterChange(filter = {}) {
    runInAction(() => {
      this.filter = {
        ...this.filter,
        pageNum: 1,
        ...filter,
      };
    });
    this.getApiList();
  }

  @action async changeFormValue(values, flag = true) {
    this.formValues = {
      ...this.formValues,
      ...values,
    };
    flag && localStorage.setItem('createApi', JSON.stringify(this.formValues));
  }

  @action async prevStep() {
    this.testResult = '';
    const newStep = this.step - 1;
    this.step = newStep;
    localStorage.setItem('createStep', newStep);
  }

  @action async nextStep(step) {
    this.testResult = '';
    let newStep = this.step;
    if (step) {
      newStep = step;
    } else {
      newStep = this.step + 1;
    }
    this.step = newStep;
    localStorage.setItem('createStep', newStep);
  }

  @action async save() {
    const { app, apiKey, funs, apiKeyModel, apiKeyData, version, scriptType, scriptContent, requestDataStructure, responseDataStructure, description } = this.formValues;
    const res = await API.saveApi(this.appInfo.appKey, {
      version,
      gatewayParam: {
        gatewayCode: apiKey || `bff_${app}_${apiKeyModel}_${apiKeyData}`,
      },
      dataViewMappingParams: funs.map(it => {
        let dataViewParams = {};
        switch (it.type) {
          case 'JDBC':
            dataViewParams.command = it.command;
            break;
          case 'HTTP':
            dataViewParams = {
              contextUrl: it.contextUrl,
              method: it.method,
            };
            break;
          default: break;
        }
        return {
          dataViewType: it.type,
          dataViewCode: `view_${it.dataViewCode}`,
          dataSourceCode: it.dataSourceCode || '',
          dataViewParams,
          requestDataStructure: it.requestDataStructure,
          responseDataStructure: it.responseDataStructure,
        };
      }),
      dataPackagerParam: {
        scriptType,
        scriptContent,
        requestDataStructure,
        responseDataStructure,
        dataPackagerCode: apiKey || `bff_${app}_${apiKeyModel}_${apiKeyData}`,
      },
    });
    if (res.success) {
      localStorage.removeItem('createApi');
      return Promise.resolve(res);
    } else {
      message.error(res.msg || '操作失败');
      return Promise.reject();
    }
  }

  @action async update(gatewayCode, v) {
    const { app, apiKey, funs, apiKeyModel, apiKeyData, version, scriptType, scriptContent, requestDataStructure, responseDataStructure, description} = this.formValues;
    const res = await API.updateApi(this.appInfo.appKey,gatewayCode, v, {
      version,
      gatewayParam: {
        gatewayCode: apiKey || `bff_${app}_${apiKeyModel}_${apiKeyData}`,
      },
      dataViewMappingParams: funs.map(it => {
        let dataViewParams = {};
        switch (it.type) {
          case 'JDBC':
            dataViewParams.command = it.command;
            break;
          case 'HTTP':
            dataViewParams = {
              contextUrl: it.contextUrl,
              method: it.method,
            };
            break;
          default: break;
        }
        return {
          dataViewType: it.type,
          dataViewCode: `view_${it.dataViewCode}`,
          dataSourceCode: it.dataSourceCode || '',
          dataViewParams,
          requestDataStructure: it.requestDataStructure,
          responseDataStructure: it.responseDataStructure,
        };
      }),
      dataPackagerParam: {
        scriptType,
        scriptContent,
        requestDataStructure,
        responseDataStructure,
        dataPackagerCode: apiKey || `bff_${app}_${apiKeyModel}_${apiKeyData}`,
      },
    });
    if (res.success) {
      localStorage.removeItem('createApi');
      runInAction(()=>{
        this.formValues.fk=true;
      })
      return Promise.resolve(res);
    } else {
      message.error(res.msg || '操作失败');
      return Promise.reject();
    }
  }
  @action async changePublished(gatewayCode, version) {
    return API.changePublished(gatewayCode, version).then(res => {
      if (res.success) {
        this.filterChange();
        return res;
      } else {
        return Promise.reject(new Error(res.msg));
      }
    }).catch(err => {
      message.error(err.message);
    });
  }

  @action async changeOffline(gatewayCode, version) {
    return API.changeOffline(gatewayCode, version).then(res => {
      if (res.success) {
        this.filterChange();
        return res;
      } else {
        return Promise.reject(new Error(res.msg));
      }
    }).catch(err => {
      message.error(err.message);
    });
  }

  @action async deleteInterface(gatewayCode, version, params) {
    return API.deleteInterface(gatewayCode, version, params).then(res => {
      if (res.success) {
        this.filterChange();
        return res;
      } else {
        return Promise.reject(new Error(res.msg));
      }
    }).catch(err => {
      message.error(err.message);
    });
  }

  @action async getIsRename(apiKey, version, id) {
    const res = await API.getIsRename(apiKey, version, id);
    if (res.success && !res.data) {
      return Promise.resolve();
    } else {
      return Promise.reject(res.msg);
    }
  }

  @action async getApiDetail(gatewayCode, version) {
    runInAction(() => {
      this.formValues = {};
    });
    const res = await API.getApiDetail(gatewayCode, version);
    if (res.success) {
      runInAction(() => {
        const { gatewayParam, dataViewMappingParams, dataPackagerParam } = res.data;
        this.formValues = {
          ...res.data,
          apiKey: gatewayParam.gatewayCode,
          ...dataPackagerParam,
          funs: dataViewMappingParams.map(it => ({
            ...it,
            command: it.dataViewParams.command,
            method: it.dataViewParams.method,
            contextUrl: it.dataViewParams.contextUrl,
            dataViewCode: it.dataViewCode.replace(/^view_/, ''),
            type: it.dataViewType,
          })),
        };
      });
    } else {
      message.error(res.msg || '连接失败');
    }
  }

  @action async getConsoleLog(params) {
    return API.getConsoleLog(params).then(res => {
      if (res.success) {
        return res.data;
      } else {
        return Promise.reject(res.msg);
      }
    }).catch(err => {
      message.error(err.message);
    });
  }

  @action async initForm() {
    this.formValues = { app: this.appInfo.appKey, version: '0.0.1', scriptType: 'groovy' };
    this.step = 0;
    localStorage.removeItem('createStep');
    localStorage.removeItem('createApi');
  }

  @action async getDatasourceList(filter = {}) {
    return API.getDatasourceList(this.appInfo.code, { pageSize: 10, pageNum: 1, ...filter }).then(res => {
      if (res.success) {
        runInAction(() => {
          this.datasourceList = res.data.list.filter(it => it);
        });
      } else {
        return Promise.reject(res.msg);
      }
    }).catch(err => {
      message.error(err.message);
    });
  }

  @action async saveDatasource(params) {
    // return API.saveDatasource(this.appInfo.code, params);
    return API.saveDatasource(this.appInfo.code, params);

  }
  @action async testDatasource(params){
    const res=await API.testDatasource(this.appInfo.code, params)
    if(res.success){
      return res.data
    }else{
      message.error('添加失败')
    }
  }
}
export default new Store();
