import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Input, Button, message, Row, Col, Select } from 'antd';
import { values } from 'lodash';

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const [flags,setFlags]=useState(true);
  const cencel = () => {
    form.resetFields();
    props.onCencel(false);
  };
 
  // const onFinish = values => {
  //   const { dataSourceCode, dataSourceName, dataSourceType, url, username, password, driverClass ,host,port} = values;
  //   const params = {
  //     dataSourceCode,
  //     dataSourceName,
  //     dataSourceType,
  //   };
  //   switch (dataSourceType) {
  //     case 'JDBC':
  //       params.dataSourceProperties = {
  //         url,
  //         username,
  //         password,
  //         driverClass,
  //       };
  //       break;
  //     case 'HTTP':
  //       params.dataSourceProperties = {
  //         host,
  //         port,
  //       };
  //       break;
  //     default: break;
  //   }
  //   props.store.saveDatasource(params).then(() => {
  //     cencel();
  //   });
  // };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
    setFlags(true);
  };
  
  const onTest=()=>{
    const res=form.getFieldsValue(['dataSourceType', 'url', 'username', 'password','driverClass','host','port']);
    const params = {
      dataSourceType: res.dataSourceType,
    };
    switch ( res.dataSourceType) {
      case 'JDBC':
        params.dataSourceProperties = {
          url: res.url,
          username: res.username,
          password:res.password,
          driverClass: res.driverClass,
        };
        break;
      case 'HTTP':
        params.dataSourceProperties = {
          host: res.host,
          port: res.port,
        };
        break;
      default: break;
    }
    props.store.testDatasource(params).then((ret)=>{
      if(ret.ok){
        message.success('测试成功');
        setFlags(false);
      }else{
        message.error(ret.msg);
        setFlags(true);
      }
      // cencel();
    });
  };
  const onSubmit=()=>{
    const res=form.getFieldsValue(['dataSourceCode', 'dataSourceName','dataSourceType', 'url', 'username', 'password','driverClass','host','port']);
    const bcparams = {
      dataSourceName: res.dataSourceName,
      dataSourceCode: res.dataSourceCode,
      dataSourceType: res.dataSourceType,
    };
    switch ( res.dataSourceType) {
      case 'JDBC':
        bcparams.dataSourceProperties = {
          url: res.url,
          username: res.username,
          password:res.password,
          driverClass: res.driverClass,
        };
        break;
      case 'HTTP':
        bcparams.dataSourceProperties = {
          host: res.host,
          port: res.port,
        };
        break;
      default: break;
    }
    props.store.saveDatasource(bcparams).then((res) => {
      if(res.success){
        message.success('添加成功');
        cencel();
      }else{
        message.error(res.msg);
      }
        
        
    });
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
      // onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{}}
      autoComplete="off"
    >
      <Form.Item
        label="编码"
        name="dataSourceCode"
        rules={[
          { required: true, message: '请输入' },
          { pattern: /^[a-zA-Z_]*$/, message: '只能由大小写字母下划线组成' },
        ]}
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item label="名称" name="dataSourceName" rules={[{ required: true, message: '请输入名称' }]}>
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item label="类型" name="dataSourceType" rules={[{ required: true, message: '请选择类型' }]}>
        <Select>
          <Select.Option value="JDBC">JDBC</Select.Option>
          <Select.Option value="HTTP">HTTP</Select.Option>
        </Select>
      </Form.Item>
       <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.dataSourceType !== currentValues.dataSourceType}
          >
            {({ getFieldValue }) => {
              switch (getFieldValue('dataSourceType')) {
                case 'JDBC':
                  return (
                    <div>
                      <Form.Item label="url" name="url" rules={[{ required: true, message: '请输入' }]}>
                        <Input placeholder="请输入" />
                      </Form.Item>
                      <Form.Item label="username" name="username" rules={[{ required: true, message: '请输入' }]}>
                        <Input placeholder="请输入" />
                      </Form.Item>
                      <Form.Item label="password" name="password" rules={[{ required: true, message: '请输入' }]}>
                        <Input placeholder="请输入" />
                      </Form.Item>
                      <Form.Item label="driverClass" name="driverClass" rules={[{ required: true, message: '请输入' }]}>
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </div>
                  );
                case 'HTTP':
                  return (
                    <div>
                      <Form.Item label="host" name="host" rules={[{ required: true, message: '请输入' }]}>
                        <Input placeholder="请输入" />
                      </Form.Item>
                      <Form.Item label="port" name="port" rules={[{ required: true, message: '请输入' }]}>
                        <Input placeholder="请输入" />
                      </Form.Item>
                    </div>
                  );
                default: return null;
              }
            }}
          </Form.Item>
      <Row justify="end">
        <Col>
          <Button htmlType="button" onClick={cencel} style={{ marginRight: 20 }}>取消</Button>
          <Button type="primary" htmlType="submit"  onClick={onSubmit} disabled={flags}>提交</Button>
          <Button type="primary" htmlType="button"  onClick={onTest} style={{ marginLeft: 20 }}>测试</Button>
        </Col>
      </Row>
    </Form>
  );
};
export default inject('store')(observer(CreateForm));
