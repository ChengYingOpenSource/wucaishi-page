import React, { useImperativeHandle, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Form, Select, Input, Row, Col, Card, Switch, Button, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';
import CodeEditor from '@/components/CodeEditor';
import TreeTable from './TreeTable';
import TestModal from './TestModal';
import Values from './Values';
import styles from '../create.less';

const { Option } = Select;

const Funs = (props) => {
  const { disabled = false } = props;
  const [form] = Form.useForm();
  const responseDataStructureRef = useRef();
  const requestDataStructureRef = useRef();
  const [datasourceValue, setDatasourceValue] = useState('');
  const formValidate = () => {
    return form.validateFields(['dataViewCode', 'type', 'command', 'dataSourceCode', 'contextUrl', 'method', 'requestDataStructure', 'responseDataStructure', 'testList']).catch(errorInfo => {
      console.log(errorInfo, 'errorInfo')
      form.scrollToField(errorInfo.errorFields[0].name[0]);
      throw errorInfo;
    });
  };
  const handleTest = () => {
    formValidate().then(res => {
      const { dataViewCode, command, dataSourceCode, requestDataStructure, responseDataStructure, type, contextUrl, method } = res;
      const params = {
        dataViewCode: 'view_' + dataViewCode,
        dataSourceCode,
        requestDataStructure,
        responseDataStructure,
      };
      switch (type) {
        case 'JDBC':
          params.dataViewParams = {
            command,
          };
          break;
        case 'HTTP':
          params.dataViewParams = {
            contextUrl,
            method,
          };
          break;
        default: break;
      }
      TestModal.init({
        params,
      });
    }).catch(err => {
      message.error('存在必填项未填写');
    });
  };
  useImperativeHandle(props.funcNode, () => ({
    formValidate,
    resetFields: form.resetFields,
    setFieldsValue: form.setFieldsValue,
    scrollToField: form.scrollToField,
    handleTest,
  }));

  return (
    <>
      <Card style={{ height: '100%', overflow: 'auto' }} name="funs" className={styles.funcard}>
        <Form
          onValuesChange={props.onValuesChange}
          form={form}
          labelAlign="left"
        >
          <Form.Item
            label="名称"
            name="dataViewCode"
            rules={[
              { required: true, message: '请输入名称' },
              () => ({
                validator(rule, value) {
                  if (props.isRename(value)) {
                    return Promise.reject('名称不能重复');
                  }
                  return Promise.resolve();
                },
              })]}
          >
            <Input addonBefore={'view_'} placeholder="请输入名称" disabled={disabled} autoComplete="off" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea placeholder="请输入描述" disabled={disabled} autoComplete="off" />
          </Form.Item>
          <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
            <Select
              virtual={false}
              disabled={disabled}
              onChange={() => {
                form.setFieldsValue({ contextUrl: '', method: undefined, command: '', dataSourceCode: undefined });
              }}
            >
              {toJS(props.global.dataviewesTypes).map(it => (<Option key={it} value={it}>{it}</Option>))}
            </Select>
          </Form.Item>
          <Row>
            <Col flex={1}>
              <Form.Item label="数据源" name="dataSourceCode" rules={[{ required: true, message: '请选择数据源' }]} trigger="onSelect" validateTrigger="onSelect">
                <Select
                  disabled={disabled}
                  showSearch
                  value={datasourceValue}
                  placeholder={'请输入名称进行搜索'}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  onFocus={() => {
                    props.store.getDatasourceList({ type: form.getFieldValue('type') });
                  }}
                  onSearch={(value) => {
                    props.store.getDatasourceList({ type: form.getFieldValue('type'), name: value || '' });
                  }}
                  onChange={setDatasourceValue}
                >
                  {toJS(props.store.datasourceList).map(it => (<Option key={it.code} value={it.code}>{it.name}</Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Button onClick={() => props.setModalVisible(true)}>添加</Button>
            </Col>
          </Row>
          {/* <Values form={form} disabled={disabled} /> */}
          <Form.Item
            label="入参定义"
            name="requestDataStructure"
            rules={[
              {
                required: true,
                validator: () => {
                  const msg = requestDataStructureRef.current.isRequired();
                  if (msg.length > 0) {
                    return Promise.reject(msg[0]);
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <TreeTable ref={requestDataStructureRef} disabled={disabled} />
          </Form.Item>
          <Form.Item
            label="出参定义"
            name="responseDataStructure"
            rules={[
              {
                required: true,
                validator: () => {
                  const msg = responseDataStructureRef.current.isRequired();
                  if (msg.length > 0) {
                    return Promise.reject(msg[0]);
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <TreeTable ref={responseDataStructureRef} disabled={disabled} />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              switch (getFieldValue('type')) {
                case 'HTTP':
                  return (
                    <div>
                      <Row>
                        <Col span={9}>
                          <Form.Item label="请求路径" name="method" rules={[{ required: true, message: '请选择请求类型' }]}>
                            <Select virtual={false} disabled={disabled} placeholder="请求类型">
                              {toJS(props.store.methodType).map(it => (
                                <Option key={it} value={it}>{it}</Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={15}>
                          <Form.Item label="" name="contextUrl" rules={[{ required: true, message: '请输入请求路径' }]}>
                            <Input disabled={disabled} placeholder="请求路径" autoComplete="off" addonAfter={<PlayCircleOutlined onClick={handleTest} />} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  );
                case 'JDBC':
                  return (
                    <Form.Item label="SQL语句" name="command" rules={[{ required: true, message: '请输入SQL语句' }]}>
                      <CodeEditor buttons={[<Button key="test" type="link" icon={<PlayCircleOutlined />} onClick={handleTest} />]} readOnly={disabled} name="SQL语句" height={160} language="sql" />
                    </Form.Item>
                  );
                default: return null;
              }
            }}
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};
export default inject('store', 'global')(observer(Funs));
