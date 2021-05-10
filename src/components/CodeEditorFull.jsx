import React from 'react';
import { Modal } from 'antd';
import MonacoEditor from './MonacoEditor';

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { name, visible, onClose } = this.props;
    return (
      <Modal
        placement="bottom"
        mask
        maskClosable={false}
        visible={visible}
        title={name || '静态数据编辑'}
        onCancel={onClose}
        footer={null}
        width={'95vw'}
      >
        <MonacoEditor
          {...this.props}
          height={window.innerHeight - 300}
        />
      </Modal>
    );
  }
}
export default CodeEditor;
