import React, { useEffect, useImperativeHandle, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Form, Input, Tooltip, Row, Col } from 'antd';
import styles from '../create.less';

const Step1 = (props) => {
  const [form] = Form.useForm();
  useImperativeHandle(props.stepNode, () => ({
    formValidate: () => {
      return Promise.all([form.validateFields(['app', 'apiKeyModel', 'apiKeyData', 'apiKey', 'version']), (new Promise((resolve, reject) => {
        const res = form.getFieldsValue(['app', 'apiKeyModel', 'apiKeyData', 'version']);
        if (res.app && res.apiKeyModel && res.apiKeyData && res.version) {
          props.store.getIsRename(`bff_${res.app}_${res.apiKeyModel}_${res.apiKeyData}`, res.version).then(() => {
            resolve();
          }).catch(() => {
            reject('已经存在该接口');
          });
        } else {
          resolve();
        }
      }))]);
    },
    setFieldsValue: form.setFieldsValue,
  }));

  const onValuesChange = (changedValues) => {
    props.store.changeFormValue(changedValues);
  };
  return (
    <Form
      initialValues={{
        ...props.store.formValues,
      }}
      form={form}
      onValuesChange={onValuesChange}
      labelAlign="left"
      className={styles.formLabel}
      autoComplete="off"
    >
      <Form.Item label="接口应用" rules={[{ required: true, message: '请选择接口应用' }]}>
        <Input disabled value={(props.store.formValues.application || {}).name || props.store.appInfo.appName} />
      </Form.Item>
      {props.store.formValues.apiKey ?
        <Form.Item label="接口名称" name="apiKey">
          <Input disabled />
        </Form.Item>
        :
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.app !== currentValues.app}
        >
          {({ getFieldValue }) => {
            return (
              <Tooltip
                trigger={['focus']}
                title={'通用规则：bff_应用key_模块/领域_[数据]_[属性]_[属性]; 举例：配置测试组下的用户列表: bff_test_user_list_get'}
                placement="topLeft"
                overlayStyle={{ maxWidth: 370 }}
              >
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="接口名称"
                      name="apiKeyModel"
                      validateTrigger="onBlur"
                      rules={[
                        { required: true, message: '请输入模块/领域' },
                        { pattern: /^[a-zA-Z]*$/, message: '模块/领域 只能由大小写组成' },
                      ]}
                    >
                      <Input addonBefore={`bff_${getFieldValue('app') || ''}_`} placeholder="模块/领域" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="apiKeyData"
                      validateTrigger="onBlur"
                      rules={[
                        { required: true, message: '请输入数据[s]_[属性]_[属性]' },
                        { pattern: /^[a-zA-Z_]*$/, message: '数据[s]_[属性]_[属性] 只能由大小写或下划线组成' },
                      ]}
                    >
                      <Input addonBefore={'_'} placeholder="数据[s]_[属性]_[属性]" />
                    </Form.Item>
                  </Col>
                </Row>
              </Tooltip>
            );
          }}
        </Form.Item>
      }
      <Form.Item
        label="版本"
        name="version"
        validateTrigger="onBlur"
        rules={[
          { required: true, message: '请输入版本' },
          { pattern: /^(\d)*\.(\d)*\.(\d)*$/, message: '请输入正确的版本号 例如： 0.0.1' },
        ]}
      >
        <Input disabled={!!props.store.formValues.apiKey} placeholder="版本：x.y.z" />
      </Form.Item>
      <Form.Item label="接口描述" name="description">
        <Input.TextArea placeholder="请输入接口描述" rows={6} disabled={props.disabled} />
      </Form.Item>
    </Form>
  );
};
export default inject('store')(observer(Step1));
