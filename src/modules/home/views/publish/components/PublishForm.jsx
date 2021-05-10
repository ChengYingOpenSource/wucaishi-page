import React, { useEffect, useImperativeHandle, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Form, Select, Input, Row, Col } from 'antd';
import styles from '../publish.less';

const PublishForm = (props) => {
  const [form] = Form.useForm();
  const [apiKey, setApiKey] = useState({ model: '', attr: '', version: '' });
  const { formValues, enums } = toJS(props.store);
  useImperativeHandle(props.stepNode, () => ({
    formValidate: () => {
      const filterConfigList = [];
      const obj = form.getFieldsValue([...(enums.handlerName.map(handler => handler.value.replace(/\./g, '-')))]);
      Object.keys(obj).map(it => {
        filterConfigList.push({
          handlerName: it.replace(/-/g, '.'),
          parameter: {
            pass: obj[it] === 1,
          },
        });
        return it;
      });
      props.store.changeWebapiFormValues({
        ...form.getFieldsValue(['apiKey', 'description', 'requestPath', 'requestType', 'parameterType']),
        filterConfigList,
      });
      return form.validateFields(['apiKey', 'description', 'requestPath', 'requestType', 'parameterType', ...(enums.handlerName.map(handler => handler.value.replace(/\./g, '-')))]);
    },
  }));
  useEffect(() => {
    props.store.getGateway();
    const prev = `bff.${formValues.application.group}.${formValues.app}.`;
    // eslint-disable-next-line no-useless-escape
    setApiKey({
      model: formValues.app,
      attr: formValues.apiKey.replace(/\_/g, '.').replace(prev, ''),
      version: `v${formValues.version || 1}`,
    });
  }, [formValues.apiKey, formValues.app, formValues.version, props.store]);
  useEffect(() => {
    form.setFieldsValue({
      apiKey: `api.${formValues.application.group.replace('bff_', '')}.${apiKey.model}.${apiKey.attr}.${apiKey.version}`,
    });
  }, [apiKey, form, formValues.application.group]);
  return (
    <Form
      initialValues={props.store.webapiFormValues}
      form={form}
      // onValuesChange={onValuesChange}
      className={styles.formLabel}
      labelAlign="left"
    >

      <Form.Item
        label="api名称"
        name="apiKey"
        rules={[
          {
            required: true,
            validator: () => {
              if (!apiKey.model) {
                return Promise.reject('请选择或者输入 模块/领域');
              } else if (!apiKey.attr) {
                return Promise.reject('请输入 数据[s].[属性].[属性].操作');
              } else if (!apiKey.version) {
                return Promise.reject('请输入 版本');
              } else {
                return Promise.resolve();
              }
            },
          },
        ]}
      >
        <Input.Group compact>
          <Input style={{ width: '16%' }} value={`api.${formValues.application.group.replace('bff_', '')}.`} disabled />
          <Input
            style={{ width: '24%' }}
            placeholder="模块/领域(可输入)"
            value={apiKey.model}
            onChange={(e) => setApiKey({ ...apiKey, model: e.target.value })}
            disabled
          />
          <Input style={{ width: '4%' }} value={'.'} readOnly />
          <Input
            style={{ width: '36%' }}
            placeholder={'数据[s].[属性].[属性].操作'}
            onChange={(e) => setApiKey({ ...apiKey, attr: e.target.value })}
            value={apiKey.attr}
          />
          <Input style={{ width: '4%' }} value={'.'} readOnly />
          <Input
            style={{ width: '16%' }}
            placeholder="版本"
            onChange={(e) => setApiKey({ ...apiKey, version: e.target.value })}
            value={apiKey.version}
          />
        </Input.Group>
      </Form.Item>
      <Form.Item label="描述" name="description" initialValue={formValues.description}>
        <Input.TextArea placeholder="请输入" rows={4} maxLength={1000} />
      </Form.Item>
      <Form.Item label="请求路径" name="requestPath" rules={[{ required: true, message: '请输入请求路径' }]} initialValue={`${formValues.apiKey}`}>
        <Input placeholder="请输入请求路径" disabled />
      </Form.Item>
      <Row gutter={30}>
        <Col span={12}>
          <Form.Item label="请求类型" name="requestType" rules={[{ required: true, message: '请选择请求类型' }]} initialValue={1}>
            <Select disabled placeholder="请选择请求类型">
              {enums.requestType && enums.requestType.map((item) => (
                <Select.Option value={item.value} key={item.value} > {item.text}</Select.Option>))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="参数类型" name="parameterType" rules={[{ required: true, message: '请选择参数类型' }]} initialValue={0}>
            <Select disabled placeholder="请选择参数类型">
              {enums.parameterType && enums.parameterType.map((item) => (
                <Select.Option value={item.value} key={item.value} > {item.text}</Select.Option>))}
            </Select>
          </Form.Item>
        </Col>
        {enums.handlerName && enums.handlerName.map((handler) => {
          return (
            <Col span={12} key={handler.value} >
              <Form.Item label={handler.text} name={handler.value.replace(/\./g, '-')} rules={[{ required: true, message: `请选择${handler.text}` }]} initialValue={handler.text === '权限校验' ? 0 : 1}>
                <Select placeholder={`请选择${handler.text}`}>
                  <Select.Option value={0} key={0}> False</Select.Option>
                  <Select.Option value={1} key={1}> True</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    </Form>
  );
};
export default inject('store')(observer(PublishForm));
