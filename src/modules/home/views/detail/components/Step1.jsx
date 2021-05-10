import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Form, Select, Input, Row, Col, Card, List } from 'antd';
import Funs from '../../create/components/Funs';
import styles from '../detail.less';

const initValue = {
  name: '',
  type: 'FORWARD',
  returnValues: [],
  arguments: [],
  requestPort: 80,
  javaScript: '(params, headerInfo) => {\n return params; \n}',
  argumentsJs: '(params) => {\n return {}; \n}',
  returnJs: '(res, params) => {\n return {}; \n}',
  header: '{\n  \n}',
};
const Step1 = (props) => {
  const [form] = Form.useForm();
  const funcNode = useRef();
  const [list, changeList] = useState(props.store.formValues.funs || [initValue]);
  const [current, changeCurrent] = useState(0);
  const [apiKey, setApiKey] = useState({ model: '', data: '' });
  useImperativeHandle(props.stepNode, () => ({
    formValidate: () => {
      return Promise.all([form.validateFields(['app', 'apiKey']), funcNode.current.formValidate()]);
    },
    setFieldsValue: form.setFieldsValue,
  }));
  useEffect(() => {
    if (props.store.formValues.funs &&
      JSON.stringify(props.store.formValues.funs) !== JSON.stringify(list)) {
      changeList(props.store.formValues.funs);
      funcNode.current.resetFields();
      funcNode.current.setFieldsValue(props.store.formValues.funs[current]);
    }
  }, [current, list, props.store.formValues.funs]);
  useEffect(() => {
    const apiKeyStr = props.store.formValues.apiKey || '';
    const apiKeyArr = [apiKeyStr.replace(/_(.*)$/, ''), apiKeyStr.replace(/^([0-9a-zA-Z]*)_/, '')];
    const apiKeyArr1 = Object.keys(apiKey).map(it => apiKey[it]);
    if (apiKeyArr.length > 0 && JSON.stringify(apiKeyArr) !== JSON.stringify(apiKeyArr1)) {
      setApiKey({
        model: apiKeyArr[0],
        data: apiKeyArr[1],
      });
    }
  }, [apiKey, props.store.formValues.apiKey]);
  useEffect(() => {
    const { app, description } = props.store.formValues;
    form.setFieldsValue({ app, description });
  }, [form, props.store.formValues]);
  useEffect(() => {
    funcNode.current.setFieldsValue(list[current]);
  }, [current, list]);
  const onValuesChange = (changedValues) => {
    props.store.changeFormValue(changedValues);
  };
  return (
    <Form.Provider
      onFormFinish={() => { }}
    >
      <Row gutter={20} style={{ height: '100%', overflow: 'hidden' }} className={'col pt20'}>
        <Col span={10} className={styles.step1Form}>
          <div className={styles.list}>
            <Card>
              <Form
                initialValues={props.store.formValues}
                form={form}
                onValuesChange={onValuesChange}
                labelAlign="left"
                className={styles.formBox}
              >
                <Form.Item label="接口应用" name="app" rules={[{ required: true, message: '请选择接口应用' }]}>
                  <Select disabled={!!props.store.formValues.id} onFocus={() => props.store.getApplicationList()} options={toJS(props.store.appOptions)} placeholder="请选择接口应用" />
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => prevValues.app !== currentValues.app}
                >
                  {({ getFieldValue }) => {
                    return (
                      <Form.Item
                        label="接口名称"
                        name="apiKey"
                        validateTrigger="onBlur"
                        rules={[
                          {
                            required: true,
                            validator: (rule, value, callback) => {
                              if (!apiKey.model) {
                                callback('请输入 模块/领域');
                              } else if (!apiKey.data) {
                                callback('请输入 数据[s]_[属性]_[属性]');
                              } else {
                                return props.store.getIsRename(`bff_${getFieldValue('app') || ''}_${value}`, props.store.formValues.id);
                              }
                            },
                          },
                        ]}
                      >
                        <Input.Group compact>
                          <Input
                            style={{ width: '50%' }}
                            addonBefore={`bff_${getFieldValue('app') || ''}_`}
                            placeholder="模块/领域"
                            value={apiKey.model}
                            disabled={!!props.store.formValues.id}
                            onChange={e => {
                              setApiKey({ ...apiKey, model: e.target.value });
                              form.setFieldsValue({ apiKey: `${e.target.value}_${apiKey.data}` });
                              onValuesChange({ apiKey: `${e.target.value}_${apiKey.data}` });
                            }}
                          />
                          <Input
                            style={{ width: '50%' }}
                            addonBefore={'_'}
                            value={apiKey.data}
                            disabled={!!props.store.formValues.id}
                            placeholder="数据[s]_[属性]_[属性]"
                            onChange={e => {
                              setApiKey({ ...apiKey, data: e.target.value });
                              form.setFieldsValue({ apiKey: `${apiKey.model}_${e.target.value}` });
                              onValuesChange({ apiKey: `${apiKey.model}_${e.target.value}` });
                            }}
                          />
                        </Input.Group>
                      </Form.Item>
                    );
                  }}
                </Form.Item>
                <Form.Item label="接口描述" name="description">
                  <Input.TextArea disabled placeholder="请输入接口描述" />
                </Form.Item>
              </Form>
            </Card>

            <List
              className="mt20"
              grid={{ column: 1 }}
              dataSource={list}
              renderItem={(item, index) => (
                <List.Item>
                  <Row justify="space-between" className={`${current === index && styles._active} ${styles.bar}`}>
                    <Col
                      flex={1}
                      onClick={() => {
                        funcNode.current.formValidate().then(() => {
                          if (index !== current) {
                            changeCurrent(index);
                            funcNode.current.resetFields();
                            funcNode.current.setFieldsValue(list[index]);
                          }
                        });
                      }}
                    >fun_{item.name}
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </div>
        </Col>
        <Col span={14} style={{ height: '100%' }}>
          <Funs
            funcNode={funcNode}
            onValuesChange={(changedValues) => {
              const val = [...list];
              val[current] = { ...val[current], ...changedValues };
              changeList(val);
              props.store.changeFormValue({ funs: val });
            }}
            formValues={list[current]}
            isRename={value => list.filter(it => it.name === value).length > 1}
            disabled
          />
        </Col>
      </Row>

    </Form.Provider>
  );
};
export default inject('store')(observer(Step1));
