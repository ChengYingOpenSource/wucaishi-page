import React, { useImperativeHandle, useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Spin, message } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import CodeEditor from '@/components/CodeEditor';
import { JSONParse } from '@/lib/utils';
import API from '../../../service/index';
import styles from '../create.less';

let timer = null;

const Step4 = (props) => {
  const [form] = Form.useForm();
  const [testResult, setTestResult] = useState('');
  let testValue = '';
  useImperativeHandle(props.stepNode, () => ({
    formValidate: () => {
      return form.validateFields(['variables']);
    },
  }));
  const onValuesChange = (changedValues) => {
    props.store.changeFormValue(changedValues);
  };
  const getConsoleLog = (code) => {
    API.getConsoleLog(code).then(res => {
      if (res.code === 0) {
        setTestResult(testValue + res.data.join('\n'));
        testValue += res.data.join('\n');
        timer = setTimeout(() => {
          getConsoleLog(code);
        }, 1000);
      } else {
        throw new Error(res.msg);
      }
      if(res.data.length==0){
        clearTimeout(timer);
      }
    }).catch((err) => {
      message.error(err.message || '出错了~');
    });
  };

  const postTest = () => {
    const { funs, version, scriptType, scriptContent, requestDataStructure, responseDataStructure ,apiKey, apiKeyModel, apiKeyData} = props.store.formValues;
    API.getConsoleCode({
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
        dataPackagerCode:apiKey || `bff_${app}_${apiKeyModel}_${apiKeyData}`,
        scriptType,
        scriptContent,
        requestDataStructure,
        responseDataStructure,
      },
      executionParams: JSONParse(form.getFieldValue('variables')),
    }).then(res => {
      if (res.code === 0) {
        getConsoleLog(res.data);
      } else {
        throw new Error(res.msg);
      }
    }).catch((err) => {
      message.error(err.message || '出错了~');
    });
  };
  useEffect(() => {
    return () => {
      timer && clearTimeout(timer);
      timer = null;
    };
  }, []);
  return (
    <Form
      onValuesChange={onValuesChange}
      form={form}
      style={{ height: '100%' }}
    >
      <div className={styles.testbox}>
        <div className={styles.left}>
          <Form.Item name="variables" noStyle>
            <CodeEditor name="参数" title="参数" language="json" />
          </Form.Item>
        </div>
        <div className={styles.center}>
          <div className={styles.testBtn} onClick={postTest}>
            <CaretRightOutlined style={{ fontSize: 32 }} />
            <div>测试</div>
          </div>
        </div>
        <div className={styles.right}>
          <CodeEditor
            name="结果"
            title="结果"
            readOnly
            value={testResult}
            language="json"
          />
        </div>
      </div>
    </Form>
  );
};
export default inject('store')(observer(Step4));
