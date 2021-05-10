import React from 'react';
import { Provider } from 'mobx-react';
import { Modal } from 'antd';
import Title from '@/components/Title';
import store from '../service/store';
import List from './components/List';
import Operation from './components/Operation';
import CreateForm from './components/CreateForm';

class Home extends React.Component {
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
    console.log(123);
    return (
      <Provider store={store}>
        <div>
          <div className={'flexsb flexac'}>
            <Title />
          </div>
          <Operation handleAdd={this.handleAdd} />
          <List handleAdd={this.handleAdd} />
          <Modal
            title={'创建项目'}
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
Home.defaultProps = {};
export default Home;
