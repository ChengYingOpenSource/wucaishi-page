import React from 'react';
import MonacoEditor from 'react-monaco-editor';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  editorDidMount = (editor) => {
    const { editorFlag } = this.props;
    this.editor = editor;
    editorFlag && editor.focus();
  }

  onHandleChange = (newValue) => {
    const { onChange } = this.props;
    onChange && onChange(newValue);
  }

  render() {
    const { width = '100%', height = '100%', language = 'javascript', theme = 'vs-light',
      value, minimapEnable = false, readOnly = false } = this.props;
    const options = {
      tabSize: 2,
      selectOnLineNumbers: true,
      minimap: {
        enabled: minimapEnable,
      },
      automaticLayout: true,
      renderWhitespace: 'all',
      readOnly,
      scrollBeyondLastColumn: 0,
      lineNumbersMinChars: 3,
    };
    return (
      <MonacoEditor
        width={width}
        height={height}
        language={language}
        theme={theme}
        value={value}
        options={options}
        onChange={this.onHandleChange}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}
export default Editor;
