import React from 'react';
import { Tooltip, Row, Col } from 'antd';
import { ExpandOutlined, PlayCircleOutlined } from '@ant-design/icons';
import MonacoEditor from './MonacoEditor';
import CodeEditorFull from './CodeEditorFull';
import RunJs from './RunJs';

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleClick = () => {
    this.setState({ visible: true });
  }

  handleRun = () => {
    RunJs.run({
      js: this.props.value,
    }).then(res => res).catch(err => err);
  }

  render() {
    const { height = '100%', title = '', runJs = false, buttons = [], style = {} } = this.props;
    return (
      <div style={{ height, position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.15)', ...style }}>
        <Row justify="space-between" style={{ padding: 5, background: '#f5f5f5' }}>
          <Col>{title}</Col>
          <Col>
            {buttons.map(it => it)}
            {runJs && <Tooltip title="运行函数"><PlayCircleOutlined onClick={this.handleRun} style={{ marginRight: 10 }} /></Tooltip>}
            <Tooltip title="全屏"><ExpandOutlined onClick={this.handleClick} /></Tooltip>
          </Col>
        </Row>
        <MonacoEditor {...this.props} />
        <CodeEditorFull
          {...this.props}
          visible={this.state.visible}
          onClose={this.handleCancel}
        />
      </div>
    );
  }
}
export default CodeEditor;
