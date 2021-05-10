import React from 'react';
import { Provider } from 'mobx-react';
import { toJS } from 'mobx';
import { Modal } from 'antd';
import Title from '@/components/Title';
import List from './components/List';
import store from '../service/store';
import CreateForm from './components/CreateForm';
import Operation from './components/Operation';

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleAdd = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    store.editInfo = {};
    this.setState({ visible: false });
  }

  render() {
    const app = toJS(store.appInfo);
    if (!app) {
      return null;
    }
    const path = [
      { name: app.name },
    ];
    return (
      <Provider store={store}>
        <div>
          <Title path={path} />
          <Operation handleAdd={this.handleAdd} />
          <List handleAdd={this.handleAdd} />
          <Modal
            title={'创建模块'}
            visible={this.state.visible}
            footer={null}
            onCancel={this.handleCancel}
            maskClosable={false}
          >
            {this.state.visible && <CreateForm onCencel={this.handleCancel} />}
          </Modal>
        </div>
      </Provider>
    );
  }
}
Group.defaultProps = {};
export default Group;
