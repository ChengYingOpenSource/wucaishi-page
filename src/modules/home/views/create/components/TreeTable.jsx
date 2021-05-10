import React, { } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import _ from 'lodash';
import { Select, Button, Input, Table, Checkbox } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import styles from '../create.less';

const { Option } = Select;
const initValue = {
  name: '',
  dataType: 'INT',
  field: '',
  required: 0,
};
const isAddType = ['COLLECTION', 'ARRAY', 'OBJECT'];
@inject('store', 'global')
@observer

export default class TreeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: toJS(props.value) || [],
      expandedRowKeys: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(toJS(this.state.changeVal)) != JSON.stringify(toJS(nextProps.value))) {
      this.setState({ values: toJS(nextProps.value) });
    }
  }

  hasRename = (arr, name) => {
    return arr.filter(it => it.field === name).length > 1;
  };

  isValues = (arr, msg) => {
    for (let i = 0; i < arr.length; i++) {
      const it = arr[i];
      if (!it.field) {
        return msg.push('参数名不能为空');
      }
      if (this.hasRename(arr, it.field)) {
        return msg.push(it.field + '参数名不能重复');
      }
      if (it.fields && it.fields.length > 0) {
        this.isValues(it.fields, msg);
      }
    }
  };

  isRequired = () => {
    const msg = [];
    this.isValues(this.state.values, msg);
    return msg;
  }

  setValues = (values) => {
    this.setState({ values });
  }

  onExpand = (expandedRowKeys) => {
    this.setState({ expandedRowKeys });
  }

  handleAdd = () => {
    const { values } = this.state;
    this.setValues([...values, { ...initValue }]);
  }

  onChangeValue = (key, type, val) => {
    const { values, expandedRowKeys } = this.state;
    const indexs = key.split('_'); const
      len = indexs.length;
    const value = [...values];
    const change = (list, level) => {
      const i = indexs[level];
      if (level < len - 1) {
        change(list[i].fields, level + 1);
      } else if (level === len - 1) {
        if (type === 'add') {
          if (!list[i].fields) {
            list[i].fields = [];
          }
          list[i].fields.push({ ...initValue });
          this.onExpand([...new Set([...expandedRowKeys, key])]);
        } else if (type === 'minus') {
          list.splice(i, 1);
        } else {
          list[i][type] = val;
        }
      }
    };
    change(value, 0);
    this.setValues(value);
    this.props.onChange && this.props.onChange(value);
  }

  getChangeVal = (values) => {
    const data = [];
    const getVal = (arr, list, key = '') => {
      arr.map((it, i) => {
        if (!_.find(list, ['name', it.name]) && it.name) {
          list.push({ ...it });
        }
        if (it.fields && it.fields.length > 0) {
          list[i].fields = [];
          getVal(it.fields, list[i].fields, `${key + i}_`);
        }
        return it;
      });
    };
    getVal(values, data);
    return data;
  }

  getDataSource = (values) => {
    const data = [];
    const getVal = (arr, list, key = '') => {
      arr.map((it, i) => {
        list.push({
          ...it,
          key: key + i,
        });
        if (it.fields && it.fields.length > 0) {
          list[i].fields = [];
          getVal(it.fields, list[i].fields, `${key + i}_`);
        }
        return it;
      });
    };
    getVal(values, data);
    return data;
  }

  render() {
    const { values, expandedRowKeys } = this.state;
    const { disabled } = this.props;
    const datastructuresTypes = toJS(this.props.global.datastructuresTypes);
    const columns = [
      {
        dataIndex: 'name',
        className: 'flexac',
        render: (text, record) => {
          const { field, dataType, name, required, fields = [] } = record;
          return (
            <div>
              <Input.Group compact>
                <Input
                  style={{ width: '100px' }}
                  placeholder={'参数名'}
                  value={field}
                  disabled={disabled}
                  onChange={e => this.onChangeValue(record.key, 'field', e.target.value)}
                />
                <Select
                  placeholder={'类型'}
                  value={dataType}
                  style={{ width: '134px' }}
                  disabled={disabled}
                  onChange={e => this.onChangeValue(record.key, 'dataType', e)}
                >
                  {datastructuresTypes.map(item => {
                    return <Option disabled={!isAddType.includes(item) && fields.length > 0} key={item} value={item}>{item}</Option>;
                  })}
                </Select>
                <Input
                  style={{ width: '100px' }}
                  placeholder={'名称'}
                  disabled={disabled}
                  value={name}
                  onChange={e => this.onChangeValue(record.key, 'name', e.target.value)}
                />
                <Select
                  placeholder={'是否必填'}
                  value={required}
                  style={{ width: '80px' }}
                  disabled={disabled}
                  onChange={e => this.onChangeValue(record.key, 'required', e)}
                >
                  <Option value={1}>必填</Option>
                  <Option value={0}>选填</Option>
                </Select>
              </Input.Group>
            </div>

          );
        },

      },
      {
        dataIndex: 'action',
        width: '80px',
        render: (text, record) => {
          return (
            <div style={{ width: 80 }}>
              <Button disabled={disabled || !isAddType.includes(record.dataType)} size="small" onClick={() => this.onChangeValue(record.key, 'add')}><PlusOutlined style={{ color: '#666' }} /></Button>
              <Button disabled={disabled} size="small" onClick={() => this.onChangeValue(record.key, 'minus')}><MinusOutlined style={{ color: '#666' }} /></Button>
            </div>
          );
        },
      },
    ];

    return (
      <div>
        {(values && values.length > 0) && <Table
          className={styles.treeTable}
          columns={columns}
          dataSource={this.getDataSource(values)}
          showHeader={false}
          pagination={false}
          rowKey={(record) => record.key}
          expandable={{
            childrenColumnName: 'fields',
            expandedRowKeys,
            onExpandedRowsChange: (expandedRows) => {
              this.setState({ expandedRowKeys: expandedRows });
            },
            indentSize: 10,
          }}
        />}
        <Button disabled={disabled} onClick={this.handleAdd}>添加参数</Button>
        {this.props.children}
      </div>
    );
  }
}
