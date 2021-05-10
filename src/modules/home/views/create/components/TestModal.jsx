import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Form, message } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import { JSONParse } from '@/lib/utils';
import CodeEditor from '@/components/CodeEditor';
import API from '../../../service/index';
import styles from './TestModal.less';

const Dom = document.body;

const Statics = {
  init(opts) {
    return new Promise((resolve) => {
      const div = document.createElement('div');
      Dom.appendChild(div);
      opts = {
        params: {},
        api: 'getDataviewesCode',
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
      ReactDOM.render(<TestModal {...opts} />, div);
    });
  },
};

class TestModal extends React.Component {
  static init = Statics.init;

  timer = null;

  state = {
    visible: this.props.visible,
    testResult: '',
    executionParams: '',
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
    this.timer = null;
  }

  getConsoleLog = (code) => {
    API.getConsoleLog(code).then(res => {
      if (res.code === 0) {
        this.setState({
          testResult: this.state.testResult + res.data.join('\n'),
        });
        this.timer = setTimeout(() => {
          this.getConsoleLog(code);
        }, 1000);
      } else {
        throw new Error(res.msg);
      }
      if(res.data.length==0){
        clearTimeout(this.timer);
      }
    }).catch((err) => {
      message.error(err.message || '出错了~');
    });
  }

  postTest = () => {
    const { api, params } = this.props;
    this.setState({
      testResult: '',
    }, () => {
      API[api]({
        ...params,
        executionParams: JSONParse(this.state.executionParams),
      }).then(res => {
        if (res.code === 0) {
          this.getConsoleLog(res.data);
        } else {
          throw new Error(res.msg);
        }
      }).catch((err) => {
        message.error(err.message || '出错了~');
      });
    });
  }

  render() {
    const { title = '测试', onClose } = this.props;
    const { visible, testResult, executionParams } = this.state;
    return (
      <Modal
        visible={visible}
        width={'90%'}
        onCancel={() => onClose(false)}
        footer={false}
        title={title}
      >
        <div className={styles.testbox}>
          <div className={styles.left}>
            <CodeEditor name="参数" title="参数" language="json" value={executionParams} onChange={(val) => this.setState({ executionParams: val })} />
          </div>
          <div className={styles.center}>
            <div className={styles.testBtn} onClick={this.postTest}>
              <CaretRightOutlined style={{ fontSize: 32 }} />
              <div>测试</div>
            </div>
          </div>
          <div className={styles.right}>
            <CodeEditor
              name="结果"
              title="结果"
              readOnly
              value={testResult}
              language="json"
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default TestModal;
