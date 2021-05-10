import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Table, message } from 'antd';

const List = (props) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    props.store.getFunctionList(props.record.apiKey, props.record.version).then(res => {
      setList(res);
    }).catch(err => {
      message.error(err.message);
    });
  }, [props.record.apiKey, props.record.version, props.store]);

  const columns = [
    {
      title: '视图名称',
      dataIndex: 'name',
    },
    {
      title: '视图类型',
      dataIndex: 'type',
    },
    {
      title: '视图描述',
      dataIndex: 'description',
    },
  ];
  return (
    <Table
      style={{ paddingLeft: 5 }}
      dataSource={list}
      columns={columns}
      rowKey={(record) => record.id}
      pagination={false}
    />
  );
};
export default inject('store')(observer(List));
