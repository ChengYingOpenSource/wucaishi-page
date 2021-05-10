import React from 'react';
import { inject, observer } from 'mobx-react';
import { Result, Button, Row, Col } from 'antd';
import history from '@/lib/history';
import styles from '../create.less';

const StepSuccess = (props) => {
  const { apiKey, description, fk,app, apiKeyModel, apiKeyData, version } = props.store.formValues;
  return (
    <div>
      <Result
        status="success"
        title={fk ? '接口编辑完成' : '接口创建完成'}
        subTitle=""
        extra={[
          <Button
            type="primary"
            key="create"
            onClick={() => {
              props.store.initForm();
              history.replace('/create');
            }}
          >
            继续创建
          </Button>,
          <Button
            key="back"
            onClick={() => {
              props.store.initForm();
              history.replace('/list');
            }}
          >
            返回列表
          </Button>,
        ]}
      />
      <div className={styles.result}>
        <div className={styles.desc}>
          <Row>
            <Col span={3}>接口应用：</Col>
            <Col span={21}>{props.store.appInfo.appName}</Col>
          </Row>
          <Row>
            <Col span={3}>接口名称：</Col>
            <Col span={21}>{apiKey || `bff_${app}_${apiKeyModel}_${apiKeyData}`}</Col>
          </Row>
          <Row>
            <Col span={3}>版本：</Col>
            <Col span={21}>{version}</Col>
          </Row>
          <Row>
            <Col span={3}>接口描述：</Col>
            <Col span={21}>{description}</Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default inject('store')(observer(StepSuccess));
