import { observable, action, runInAction } from 'mobx';
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

  @action initList() {
    runInAction(() => {
      this.filter.pageNum = 1;
    });
    this.getProjectList();
  }

  @action async getProjectList() {
    runInAction(() => {
      this.loading = true;
    });
    const res = await API.getProjectList(this.filter);
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

  @action async deleteProject(code) {
    return API.deleteProject(code).then(res => {
      if (res.success && res.data) {
        message.success('删除成功');
        this.initList();
      } else {
        message.error(res.msg || '操作失败');
        throw new Error(res.msg);
      }
    });
  }

  @action async saveProject(params) {
    return API.saveProject(params).then(res => {
      if (res.success) {
        message.success('保存成功');
        this.initList();
      } else {
        message.error(res.msg || '操作失败');
        throw new Error(res.msg);
      }
    });
  }

  @action async editProject(projectCode, params) {
    return API.editProject(projectCode, params).then(res => {
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
