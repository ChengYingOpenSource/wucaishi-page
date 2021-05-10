import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import history from '@/lib/history';
import { queryURL } from '@/lib/utils';
import { Row, Col, Button, message } from 'antd';
import Step4 from '../../create/components/Step4';
import styles from '../../create/create.less';

const CreateSteps = (props) => {
  const stepNode = useRef();
  useEffect(() => {
    props.store.getApiDetail(queryURL('apiKey'), queryURL('version'));
  }, [props.store]);
  const goList = () => {
    props.store.formValues = {};
    props.store.testResult = '';
    history.push(`/list?status=${queryURL('status') || 1}`);
  };
  if (!toJS(props.store.formValues).apiKey && !queryURL('apiKey')) {
    return null;
  }
  return (
    <>
      <div className="pb20 title">测试: {props.store.formValues.apiKey} {props.store.formValues.version}</div>
      <div className={styles.content}>
        <Step4 stepNode={stepNode} />
      </div>
      <Row className="pt20">
        <Col flex={1}>
          <Button onClick={goList}>返回列表</Button>
        </Col>
      </Row>
    </>
  );
};
export default inject('store')(observer(CreateSteps));
