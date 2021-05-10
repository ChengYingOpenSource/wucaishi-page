import React, { useImperativeHandle, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import _ from 'lodash';
import { Form, Radio, Row, Col, Button } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { getYaml, getPicture, JSONParse } from '@/lib/utils';
import CodeEditor from '@/components/CodeEditor';
import G6Editor from '@/components/G6Editor';
import TestModal from './TestModal';
import TreeTable from './TreeTable';
import styles from '../create.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const Step3 = (props) => {
  const [form] = Form.useForm();
  const responseDataStructureRef = useRef();
  const requestDataStructureRef = useRef();
  const { disabled } = props;
  useImperativeHandle(props.stepNode, () => ({
    formValidate: () => {
      return form.validateFields(['scriptType', 'requestDataStructure', 'responseDataStructure', 'scriptContent']);
    },
  }));
  const onValuesChange = (changedValues) => {
    props.store.changeFormValue(changedValues);
  };
  const handleTest = () => {
    const { app, apiKey, funs, apiKeyModel, apiKeyData, version, scriptType, scriptContent, requestDataStructure, responseDataStructure } = props.store.formValues;
    TestModal.init({
      api: 'getConsoleCode',
      params: {
        version,
        dataViewMappingParams: funs.map(it => {
          let dataViewParams = {};
          switch (it.type) {
            case 'JDBC':
              dataViewParams.command = it.command;
              break;
            case 'HTTP':
              dataViewParams = {
                contextUrl: it.contextUrl,
                method: it.method,
              };
              break;
            default: break;
          }
          return {
            dataViewCode: `view_${it.dataViewCode}`,
            dataSourceCode: it.dataSourceCode || 'test',
            dataViewParams,
            requestDataStructure: it.requestDataStructure,
            responseDataStructure: it.responseDataStructure,
          };
        }),
        dataPackagerParam: {
          scriptType,
          scriptContent,
          requestDataStructure,
          responseDataStructure,
        },
      },
    });
  }
  return (
    <Form
      {...layout}
      initialValues={{
        ...props.store.formValues,
      }}
      onValuesChange={onValuesChange}
      form={form}
      style={{ height: '100%', overflow: 'hidden' }}
    >
      <Row gutter={12} style={{ height: '100%' }}>
        <Col span={12} style={{ height: '100%', overflow: 'auto' }}>
          <Form.Item label="脚本类型" name="scriptType" rules={[{ required: true }]}>
            <Radio.Group size="small" className={styles.radio} disabled={props.disabled}>
              {props.global.scriptTypes.map(it => <Radio.Button key={it} value={it}>{it}</Radio.Button>)}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="入参定义"
            name="requestDataStructure"
            rules={[
              {
                required: true,
                validator: (rule, value) => {
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
            <TreeTable disabled={disabled} ref={requestDataStructureRef} />
          </Form.Item>
          <Form.Item
            label="出参定义"
            name="responseDataStructure"
            rules={[
              {
                required: true,
                validator: (rule, value) => {
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
        </Col>
        <Col span={12} style={{ height: '100%' }}>
          <Form.Item noStyle label="脚本内容" name="scriptContent" rules={[{ required: true, message: '请输入脚本内容' }]}>
            <CodeEditor buttons={[<Button key="test" type="link" icon={<PlayCircleOutlined />} onClick={handleTest} />]} title="脚本内容" readOnly={disabled} name="脚本内容" height={'calc(100% - 40px)'} language={form.getFieldValue('scriptType')} />
          </Form.Item>
        </Col>
      </Row>


    </Form>
  );
};
export default inject('store', 'global')(observer(Step3));
