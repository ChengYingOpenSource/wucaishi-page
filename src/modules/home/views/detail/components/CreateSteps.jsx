import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import history from '@/lib/history';
import { Row, Col, Button, Steps, message, Select } from 'antd';
import { queryURL } from '@/lib/utils';
import Step1 from '../../create/components/Step1';
import Step2 from '../../create/components/Step2';
import Step3 from '../../create/components/Step3';
// import Step4 from '../../create/components/Step4';
import styles from '../../create/create.less';

const { Step } = Steps;

const CreateSteps = (props) => {
  const { step } = props.store;
  const stepNode = useRef();
  const isRollBack = queryURL('type') === 'rollBack';
  useEffect(() => {
    props.store.step = 0;
    if (isRollBack) {
      props.store.getVersionList(queryURL('apiKey'));
    } else {
      props.store.getApiDetail(queryURL('apiKey'), queryURL('version'));
    }
  }, [isRollBack, props.store]);
  const next = () => {
    props.store.nextStep();
  };
  const prev = () => {
    props.store.prevStep();
  };
  const goList = () => {
    props.store.initForm();
    history.push(`/list?status=${queryURL('status') || 1}`);
  };

  const rollBack = () => {
    props.store.rollBack(toJS(props.store.formValues).apiKey);
    history.push('/list?status=1');
  };
  console.log(props.store.formValues, 'props.store.formValues')
  return (
    <>
      <div className={styles.title}>
        <div>{isRollBack ? '回滚操作' : '详情'}</div>
        {isRollBack &&
          <Row align="middle" gutter={20}>
            <Col>请选择版本:</Col>
            <Col>
              <Select
                style={{ width: 100 }}
                value={props.store.currentVersion}
                virtual={false}
                onChange={(e) => {
                  props.store.currentVersion = e;
                  props.store.getApiDetail(e);
                }}
              >
                {toJS(props.store.versionList).map(it => (
                  <Select.Option key={it.id} value={it.id}>v{it.version}</Select.Option>))}
              </Select>
            </Col>
            <Col><Button type="primary" onClick={rollBack}>回滚</Button></Col>
          </Row>}
      </div>
      <Steps current={step} size="small" className="pt20 pb20">
        <Step title="基本信息" description="" />
        <Step title="数据视图" description="" />
        <Step title="数据组装" description="" />
      </Steps>
      {(!toJS(props.store.formValues).apiKey) ? null :
      <div className={styles.content}>
        {step === 0 && <Step1 stepNode={stepNode} disabled />}
        {step === 1 && <Step2 stepNode={stepNode} disabled />}
        {step === 2 && <Step3 stepNode={stepNode} disabled />}
        {/* {step === 3 && <Step4 stepNode={stepNode} disabled />} */}
      </div>}
      <Row className="pt20" gutter={20}>
        <Col flex={1}>
          <Button onClick={goList}>返回列表</Button>
        </Col>
        <Col>
          <Button disabled={step === 0} onClick={prev} className={styles.prevBtn}>上一步</Button>
          <Button disabled={step === 2} type="primary" onClick={next} className={styles.nextBtn}>下一步</Button>
        </Col>
      </Row>
    </>
  );
};
export default inject('store')(observer(CreateSteps));
