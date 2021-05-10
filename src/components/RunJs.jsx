import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CodeEditor from './CodeEditor';
import { Modal, Alert } from 'antd';

const Dom = document.body;
let Statics = {};
Statics = {
  init(opts = {}) {
    return new Promise((resolve) => {
      const div = document.createElement('div');
      Dom.appendChild(div);
      opts = {
        ...opts,
        visible: true,
        onCloseSoon: () => {
          ReactDOM.unmountComponentAtNode(div);
          Dom.removeChild(div);
        },
        onSure: (res) => {
          opts.onCloseSoon();
          resolve(res);
        },
        onClose: (res) => {
          opts.onCloseSoon();
          resolve(res);
        },
      };
      ReactDOM.render(<RunJs {...opts} />, div);
    });
  },
  run(opts = {}) {
    return Statics.init(opts);
  },
};
class RunJs extends Component {
  static run = Statics.run;

  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: props.visible,
      value: '[\n  \n]',
    };
  }

  onHandleChange = (value) => {
    this.setState({ value });
  }

  handleClose = () => {
    this && this.props.onClose && this.props.onClose();
  }

  handleOk = () => {
    try {
      const result = eval(this.props.js)(...JSON.parse(this.state.value));
      console.log(result);
    } catch (err) {
      console.error(err.message);
    }
  }

  render() {
    const { visible, value } = this.state;
    return (
      <Modal
        visible={visible}
        width={600}
        onCancel={this.handleClose}
        onOk={this.handleOk}
        okText={'运行'}
        cancelText={'关闭'}
        title="请输入函数入参"
      >
        <Alert
          message="请打开控制台查看执行结果"
          type="info"
        />
        <CodeEditor
          height={500}
          value={value}
          onChange={this.onHandleChange}
          language={'JSON'}
        />
      </Modal>
    );
  }
}


export default RunJs;
