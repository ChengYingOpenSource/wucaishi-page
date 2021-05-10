import React from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Form, Input, Button, Select } from 'antd';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const Filter = (props) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    props.store.filterChange(values);
  };
  const onReset = () => {
    const filter = {
      apiKey: '',
      app: undefined,
      type: 'ALL',
    };
    form.setFieldsValue(filter);
    props.store.filterChange(filter);
  };
  const { filter } = toJS(props.store);
  return (
    <Form
      {...layout}
      form={form}
      onFinish={onFinish}
      initialValues={filter}
      layout="inline"
      className="w12"
      style={{ paddingTop: 20 }}
      autoComplete="off"
    >
      <Form.Item label="接口名称" name="name">
        <Input placeholder="请输入接口名称" style={{ width: '18vw' }} />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }}>
        <Button type="primary" htmlType="submit" className="mr8">查询</Button>
        <Button htmlType="button" onClick={onReset}>清空</Button>
      </Form.Item>
    </Form>
  );
};
export default inject('store')(observer(Filter));
