import React, { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import history from '../../../../lib/history';
import { toJS } from 'mobx';
import { Table, Divider, Modal, Input, message, Tooltip } from 'antd';
import { FolderOutlined } from '@ant-design/icons';

const List = (props) => {
  console.log('123');
  const { list, loading, filter } = toJS(props.store);
  let val = '';
  useEffect(() => {
    props.store.getProjectList();
  }, [props.store]);
  const handleDel = (e, { code, name }) => {
    e.stopPropagation();
    Modal.confirm({
      title: '请再次确认删除项目名称',
      content: <Input onChange={e => val = e.target.value} />,
      okText: '确定',
      cancelText: '取消',
      onOk: (close) => {
        if (name != val) {
          message.error('名称不正确');
          return Promise.reject('名称不正确');
        }
        props.store.deleteProject(code).then(() => {
          val = '';
          close();
        });
        return Promise.reject();
      },
      onCancel: () => {
        val = '';
      },
    });
  };
  const columns = [
    {
      title: '',
      width: '80px',
      dataIndex: 'icon',
      align: 'right',
      render: () => {
        return <FolderOutlined style={{ fontSize: 18 }} />;
      },
    },
    {
      title: '项目名称',
      width: '20%',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'appCode',
      width: '120px',
      render: () => {
        return <div>目录</div>;
      },
    },
    {
      title: '项目编码',
      dataIndex: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: { showTitle: false },
      render: (text) => {
        return (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '250px',
      render: (t, record) => {
        return (
          <div>
            <a onClick={(e) => {
              e.stopPropagation();
              props.store.editInfo = record;
              props.handleAdd();
            }}
            >编辑
            </a>
            <Divider type="vertical" />
            <a onClick={(e) => handleDel(e, record)}>删除</a>
          </div>
        );
      },
    },
  ];
  const pagination = {
    current: filter.pageNum,
    pageSize: filter.pageSize,
    total: filter.total,
    size: 'large',
  };
  return (
    <Table
      loading={loading}
      className="pt20"
      dataSource={list}
      columns={columns}
      rowKey={(record) => record.code}
      pagination={pagination}
      rowClassName={'pointer'}
      onRow={record => {
        return {
          onClick: () => { // 点击行
            sessionStorage.setItem('app', JSON.stringify(record));
            history.push('/group');
          },
        };
      }}
    />
  );
};
export default inject('store', 'global')(observer(List));
