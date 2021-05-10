import { observable, action, runInAction, computed } from 'mobx';
import API from './index';

class Store {
  @observable dataviewesData = [];

  @observable scriptData = [];

  @observable datastructuresData = [];

  @observable test = 1;

  @action onTest() {
    runInAction(() => {
      this.test = this.test + 1;
    });
  }

  @computed get dataviewesTypes() {
    if (this.dataviewesData.length === 0) {
      this.getDataviewesType();
    }
    return this.dataviewesData;
  }

  @computed get scriptTypes() {
    if (this.scriptData.length === 0) {
      this.getScriptTypes();
    }
    return this.scriptData;
  }

  @computed get datastructuresTypes() {
    if (this.datastructuresData.length === 0) {
      this.getDatastructuresTypes();
    }
    return this.datastructuresData;
  }

  @action async getDataviewesType() {
    const res = await API.getDataviewesType();
    if (res.success) {
      runInAction(() => {
        this.dataviewesData = res.data;
      });
    }
  }

  @action async getScriptTypes() {
    const res = await API.getScriptTypes();
    if (res.success) {
      runInAction(() => {
        this.scriptData = res.data;
      });
    }
  }

  @action async getDatastructuresTypes() {
    const res = await API.getDatastructuresTypes();
    if (res.success) {
      runInAction(() => {
        this.datastructuresData = res.data;
      });
    }
  }
}

export default new Store();
