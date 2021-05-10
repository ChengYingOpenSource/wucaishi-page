import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import history from '@/lib/history';
import { Table, Divider, Popconfirm, Tooltip, Modal, Input, message } from 'antd';
import FunctionTable from './FunctionTable';

const List = (props) => {
  const { list, filter, loading } = toJS(props.store);
  let val = '';
  useEffect(() => {
    props.store.getApiList();
    return () => {
      props.store.list = [];
      props.store.filter.status = '0';
    };
  }, []);

  const handleDel = (e, { apiKey, version }) => {
    e.stopPropagation();
    Modal.confirm({
      title: '请再次确认删除项目名称',
      content: <Input onChange={e => val = e.target.value} />,
      okText: '确定',
      cancelText: '取消',
      onOk: (close) => {
        if (apiKey != val) {
          message.error('apiKey不正确');
          return Promise.reject('apiKey不正确');
        }
        props.store.deleteInterface(apiKey, version, { apiKey: val }).then(() => {
          val = '';
          console.log(1)
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
      title: '接口名称',
      dataIndex: 'apiKey',
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
      title: '接口描述',
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
      title: '版本',
      dataIndex: 'version',
      width: '80px',
      render: (text) => {
        return (
          <span>v{text}</span>
        );
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: '165px',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '250px',
      render: (t, record) => {
        return (
          <div>
            <a onClick={() => {
              history.push(`/detail?apiKey=${record.apiKey}&version=${record.version}&status=${filter.status || '0'}`);
            }}
            >详情
            </a>
            {(String(record.status) === '0') &&
              <>
                <Divider type="vertical" />
                <a
                  onClick={() => {
                    props.store.initForm();
                    history.push(`/create?apiKey=${record.apiKey}&version=${record.version}&status=${filter.status || '0'}`);
                  }}
                >编辑
                </a>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定要上线吗?"
                  onConfirm={() => props.store.changePublished(record.apiKey, record.version)}
                ><a>上线</a>
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定要删除吗?"
                  onConfirm={(e) => handleDel(e, record)}
                ><a>删除</a>
                </Popconfirm>
              </>
            }
            {(String(record.status) === '1') &&
              <>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定要下线吗?"
                  onConfirm={() => props.store.changeOffline(record.apiKey, record.version)}
                ><a>下线</a>
                </Popconfirm>
              </>
            }
            <Divider type="vertical" />
            <a
              onClick={() => {
                history.push(`/testRun?apiKey=${record.apiKey}&version=${record.version}&status=${filter.status || '0'}`);
              }}
            >
              测试
            </a>
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
      rowKey={(record) => record.apiKey + record.version}
      pagination={pagination}
      onChange={onChange}
      expandable={{
        expandedRowRender: record => <FunctionTable record={record} />,
        rowExpandable: record => record.type === 'GROUP',
        indentSize: 10,
      }}
    />
  );
};
export default inject('store')(observer(List));
