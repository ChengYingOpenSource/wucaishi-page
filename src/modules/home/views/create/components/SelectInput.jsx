import React, { Component } from 'react';
import { Select } from 'antd';

const { Option } = Select;


export default class SelectInput extends Component {
  constructor(props) {
    super(props);
    let options = []; let keys = [];
    if (props.options) {
      options = options.concat(props.options);
      keys = options.map(item => item.value);
    }
    if (props.value && !keys.includes(props.value)) {
      options.unshift({ name: props.value, key: props.value, value: props.value });
      keys.unshift(props.value);
    } else {
      options.unshift({});
      keys.unshift('');
    }
    this.state = {
      options,
      keys,
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      const props = nextProps;
      let options = []; let
        keys = [];
      if (props.options) {
        options = options.concat(props.options);
        keys = options.map(item => item.value);
      }
      if (props.value && keys.indexOf(props.value) < 0) {
        options.unshift({ value: props.value, key: props.value, name: props.value });
        keys.unshift(props.value);
      } else {
        options.unshift({});
        keys.unshift('');
      }
      this.setState({
        options,
        keys,
        value: props.value,
      });
    } else if (JSON.stringify(nextProps.options) !== JSON.stringify(this.props.options)) {
      const options = [...nextProps.options];
      const keys = options.map(item => item.value);
      if (this.state.value && keys.indexOf(this.state.value) < 0) {
        options.unshift({ value: this.state.value, key: this.state.value, name: this.state.value });
        keys.unshift(this.state.value);
      } else {
        options.unshift({});
        keys.unshift('');
      }
      this.setState({ options, keys });
    }
  }

  handleChange = (val, e) => {
    this.initOptions(val);
    this.props.onChange(e ? e.props.data : '');
  }

  handleFocus = (val) => {
    this.props.onFocus(val);
  }

  handleBlur = (val) => {
    // this.initOptions(val);
    this.props.onBlur(val);
  }

  handleSelect = (val, e) => {
    this.initOptions(val);
    this.props.onChange(e.props.data);
  }

  initOptions = (val) => {
    const keys = [...this.state.keys];
    const options = [...this.state.options];
    if (val !== keys[0] || keys.indexOf(val) > 0) {
      options[0] = {};
      keys[0] = '';
    }
    this.setState({ options, keys, value: val });
  }

  render() {
    const { style, placeholder, disabled, showArrow } = this.props;
    const { value } = this.state;

    return (
      <Select
        virtual={false}
        showSearch
        allowClear
        disabled={disabled}
        placeholder={placeholder}
        onSearch={(text) => {
          const options = [...this.state.options];
          const keys = [...this.state.keys];
          if (!keys.includes(text)) {
            options.splice(0, 1, { value: text, key: text, name: text });
            keys.splice(0, 1, text);
          } else {
            options.splice(0, 1, {});
            keys.splice(0, 1, '');
          }
          this.setState({ options, keys, value: text }, () => {
            this.props.onSearch(text);
          });
        }}
        optionFilterProp="children"
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onSelect={this.handleSelect}
        style={style}
        filterOption={(val, option) => new RegExp(val).test(option.key)}
        value={value || undefined}
        showArrow={showArrow}
      >
        {this.state.options && this.state.options.map((item) => {
          if (!item.key) return null;
          return (
            <Option key={item.key} data={item.value}>{item.name}</Option>
          );
        })}
      </Select>
    );
  }
}

SelectInput.defaultProps = {
  onChange: () => { },
  onFocus: () => { },
  onBlur: () => { },
  onSearch: () => { },
  style: { width: '100%' },
  value: '',
  placeholder: '请输入搜索',
  disabled: false,
  showArrow: true,
};
