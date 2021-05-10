import React, { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import history from '@/lib/history';
import { Row, Col, Button, Steps, message } from 'antd';
import { queryURL } from '@/lib/utils';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import StepSuccess from './StepSuccess';
import styles from '../create.less';

const { Step } = Steps;

const CreateSteps = (props) => {
  const { step } = props.store;
  const stepNode = useRef();
  useEffect(() => {
    if (queryURL('apiKey')) {
      props.store.getApiDetail(queryURL('apiKey'), queryURL('version'));
    } else {
      const formValues = localStorage.getItem('createApi');
      let values = { app: props.store.appInfo.appKey };
      if (formValues) {
        const storageValues = JSON.parse(formValues);
        values = {
          ...values,
          ...storageValues,
        };
      }
      props.store.changeFormValue(values);
      stepNode.current && stepNode.current.setFieldsValue && stepNode.current.setFieldsValue(values);
    }
    return () => {
      // props.store.nextStep(0);
    };
  }, [props.store]);
  const submit = () => {
    stepNode.current.formValidate().then(() => {
      queryURL('apiKey') ? props.store.update(queryURL('apiKey'), queryURL('version')).then(()=>{
        message.success('编辑成功');
        props.store.nextStep(3);
      }) :  props.store.save().then(() => {
        message.success('保存成功');
        props.store.nextStep(3);
      });

    //   props.store.save().then(() => {
    //     message.success('保存成功');
    //     props.store.nextStep(3);
    //   });
    // }).catch(err => {
    //   message.error(err.message);
    });
  };
  const next = () => {
    stepNode.current.formValidate().then(() => {
      if (step === 2) {
        submit();
      } else {
        props.store.nextStep();
      }
    }).catch((err) => {
      message.warn(typeof err == 'string' ? err : '当前页面存在必填项未填');
    });
  };
  const prev = () => {
    props.store.prevStep();
  };
  const goList = () => {
    // props.store.initForm();
    history.push('/list');
  };

  return (
    <>
      <div className="title">{queryURL('apiKey') ? '编辑接口' : '创建接口'}</div>
      <Steps current={step} size="small" className="pt20 pb20">
        <Step title="基本信息" description="" />
        <Step title="数据视图" description="" />
        <Step title="数据组装" description="" />
        {/* <Step title="接口测试" description="" /> */}
        <Step title="完成" description="" />
      </Steps>
      {(!toJS(props.store.formValues).apiKey && queryURL('apiKey')) ? null :
      <div className={styles.content}>
        {step === 0 && <Step1 stepNode={stepNode} />}
        {step === 1 && <Step2 stepNode={stepNode} />}
        {step === 2 && <Step3 stepNode={stepNode} />}
        {/* {step === 3 && <Step4 stepNode={stepNode} />} */}
        {step === 3 && <StepSuccess />}
      </div>}
      {step < 3 &&
        <Row className="pt20">
          <Col flex={1}>
            <Button onClick={goList}>返回列表</Button>
          </Col>
          <Col>
            {(step > 1 && step < 3) && <Button onClick={submit} className={styles.saveBtn}>保存</Button>}
            <Button disabled={step == 0} onClick={prev} className={styles.prevBtn}>上一步</Button>
            <Button type="primary" onClick={next} className={styles.nextBtn}>下一步</Button>
          </Col>
        </Row>
      }
    </>
  );
};
export default inject('store')(observer(CreateSteps));
