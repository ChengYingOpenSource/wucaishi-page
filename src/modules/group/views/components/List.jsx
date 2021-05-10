import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import history from '@/lib/history';
import { toJS } from 'mobx';
import { Table, Divider, Modal } from 'antd';
import { FolderOutlined } from '@ant-design/icons';

const List = (props) => {
  const { list, loading, filter } = toJS(props.store);
  const appInfo = toJS(props.store.appInfo);
  useEffect(() => {
    props.store.getModuleList();
  }, []);
  const handleDel = (e, moduleCode) => {
    e.stopPropagation();
    Modal.confirm({
      title: '请再次确认是否删除',
      content: '删除后会将当前组下未发布的接口都删除',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        props.store.deleteModule(moduleCode);
      },
      onCancel: () => {},
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
      title: '标题',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: '编码',
      dataIndex: 'moduleCode',
      width: '20%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: '100px',
      render: () => {
        return <div>目录</div>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '260px',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      width: '260px',
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
            <a onClick={(e) => handleDel(e, record.moduleCode)}>删除</a>
          </div>
        );
      },
    },
  ];
  const pagination = {
    current: filter.page,
    pageSize: filter.pageSize,
    total: filter.total,
    size: 'large',
  };
  const onChange = (pageInfo) => {
    props.store.filterChange({ pageNum: pageInfo.current, pageSize: pageInfo.pageSize });
  };
  return (
    <Table
      loading={loading}
      className="pt20 col"
      dataSource={list}
      columns={columns}
      rowKey={'code'}
      pagination={pagination}
      rowClassName={'pointer'}
      onChange={onChange}
      onRow={record => {
        return {
          onClick: () => { // 点击行
            sessionStorage.setItem('app', JSON.stringify({
              code: appInfo.code,
              name: appInfo.name,
              appName: record.name,
              appKey: record.moduleCode,
            }));
            history.push('/list?status=0');
          },
        };
      }}
    />
  );
};
export default inject('store')(observer(List));
