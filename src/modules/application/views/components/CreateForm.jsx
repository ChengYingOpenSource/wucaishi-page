import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Input, Button, message, Row, Col } from 'antd';

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const { code, name, description } = props.store.editInfo;
  const cencel = () => {
    form.resetFields();
    props.onCencel();
  };

  const onFinish = values => {
    const params = values;
    if (code) {
      props.store.editProject(params.code, {
        description: params.description,
        name: params.name,
      }).then(() => {
        cencel();
      });
    } else {
      props.store.saveProject(params).then(() => {
        cencel();
      });
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  return (
    <Form
      {...layout}
      form={form}
      labelAlign="left"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{ code, name, description }}
      autoComplete="off"
    >
      <Form.Item
        label="编码"
        name="code"
        rules={[
          { required: true, message: '请输入编码' },
          { pattern: /^[a-zA-Z_]*$/, message: '只能由大小写字母下划线组成' },
        ]}
      >
        <Input placeholder="请输入项目编码，例如：example" disabled={code} />
      </Form.Item>
      <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
        <Input placeholder="请输入名称，例如：示例" />
      </Form.Item>
      <Form.Item label="描述" name="description" rules={[{ required: false, message: '请输入描述' }]}>
        <Input.TextArea placeholder="请输入描述" />
      </Form.Item>
      <Row justify="end">
        <Col>
          <Button htmlType="button" onClick={cencel} style={{ marginRight: 20 }}>取消</Button>
          <Button type="primary" htmlType="submit">提交</Button>
        </Col>
      </Row>
    </Form>
  );
};
export default inject('store')(observer(CreateForm));
