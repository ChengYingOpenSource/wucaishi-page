import { observable, action, runInAction, computed } from 'mobx';
import { JSONParse } from '@/lib/utils';
import history from '@/lib/history';
import { message } from 'antd';
import API from './index';

class Store {
  @observable list = [];

  @observable filter = {
    pageNum: 1,
    pageSize: 10,
    total: 0,
  };

  @observable loading = false;

  @observable editInfo = {};

  @computed get appInfo() {
    const app = JSONParse(sessionStorage.getItem('app') || '{}') || {};
    if (!app.code) {
      history.replace('/home');
      return null;
    }
    return app;
  }

  @action initList() {
    runInAction(() => {
      this.filter.pageNum = 1;
    });
    this.getModuleList();
  }

  @action async getModuleList() {
    runInAction(() => {
      this.loading = true;
    });
    const res = await API.getModuleList(this.appInfo.code, {
      ...this.filter,
    });
    if (res.success) {
      runInAction(() => {
        this.list = res.data.list;
        this.filter = {
          ...this.filter,
          ...res.data.pagination,
        };
        this.loading = false;
      });
    } else {
      this.loading = false;
      message.error(res.msg || '操作失败');
    }
  }

  @action async deleteModule(moduleCode) {
    const res = await API.deleteModule(this.appInfo.code, moduleCode);
    if (res.success) {
      message.success('删除成功');
      this.initList();
    } else {
      message.error(res.msg || '操作失败');
    }
  }

  @action async saveModule(params) {
    return API.saveModule(this.appInfo.code, {
      ...params,
    }).then(res => {
      if (res.success) {
        message.success('保存成功');
        this.initList();
      } else {
        message.error(res.msg || '操作失败');
        throw new Error(res.msg);
      }
    });
  }

  @action async editModule(params) {
    return API.editModule(this.appInfo.code, params.code, {
      name: params.name,
      description: params.description,
    }).then(res => {
      if (res.success) {
        message.success('编辑成功');
        this.initList();
      } else {
        message.error(res.msg || '操作失败');
        throw new Error(res.msg);
      }
    });
  }
}

export default new Store();
