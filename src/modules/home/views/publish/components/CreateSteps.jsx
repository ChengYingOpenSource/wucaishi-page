import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import history from '@/lib/history';
import { Row, Col, Button, message } from 'antd';
import { queryURL } from '@/lib/utils';
import PublishForm from './PublishForm';
import styles from '../publish.less';

const CreateSteps = (props) => {
  const stepNode = useRef();
  useEffect(() => {
    props.store.getApiDetail(queryURL('id'));
  }, [props.store]);
  const goList = () => {
    props.store.initForm();
    history.push('/list?status=2');
  };
  const pulishWebapi = () => {
    stepNode.current.formValidate().then(() => {
      props.store.gatewaySave().then(() => {
        message.success('部署成功');
        goList();
      }).catch(err => {
        message.error(err.message);
      });
    });
  };
  if (!toJS(props.store.formValues).id && queryURL('id')) {
    return null;
  }
  return (
    <>
      <div className="pb20 title">部署到网关</div>
      <div className={styles.content}>
        <PublishForm stepNode={stepNode} />
      </div>
      <Row className="pt20">
        <Col flex={1}>
          <Button onClick={goList}>返回列表</Button>
        </Col>
        <Col>
          <Button type="primary" onClick={pulishWebapi}>部署</Button>
        </Col>
      </Row>
    </>
  );
};
export default inject('store')(observer(CreateSteps));
