import React from 'react';
import { inject, observer } from 'mobx-react';
import { Select, Spin, message } from 'antd';
import debounce from 'lodash/debounce';

const { Option } = Select;

@inject('store')
@observer
export default class SelectApi extends React.Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchData = debounce(this.fetchData, 800);
  }

  state = {
    data: [],
    value: this.props.value || '',
    fetching: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value && nextProps.value) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  fetchData = value => {
    this.setState({ data: [], fetching: true }, () => {
      this.props.store.getApiOptions(value).then(data => {
        this.setState({ data, fetching: false });
      }).catch(err => {
        this.setState({ fetching: false });
        message.error(err.message);
      });
    });
  };

  handleChange = value => {
    console.log(value, 'val');
    this.setState({
      value,
      data: [],
      fetching: false,
    });
    this.props.onChange && this.props.onChange(value);
  };

  render() {
    const { fetching, data, value } = this.state;
    return (
      <Select
        value={value || undefined}
        placeholder="请输入apiKey查询"
        notFoundContent={fetching ? <Spin size="small" /> : '暂无数据'}
        filterOption={false}
        onSearch={this.fetchData}
        onChange={this.handleChange}
        style={{ width: '100%' }}
        onFocus={() => this.fetchData(value || '')}
        showSearch
        virtual={false}
        onBlur={() => {
          console.log(value)
        }}
      >
        {data.map(d => (
          <Option key={d.apiKey}>{d.apiKey}</Option>
        ))}
      </Select>
    );
  }
}
