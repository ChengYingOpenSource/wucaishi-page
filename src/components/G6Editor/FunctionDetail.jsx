import React, { useState } from 'react';
import { Input, Row, Col, Button, Divider, Popover } from 'antd';
import { MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { isJSON } from '@/lib/utils';
import styles from './index.less';

const KeyValue = (props) => {
  const { key, value, index } = props.info;
  return (
    <Input.Group compact>
      <Input placeholder="KEY" disabled={props.disabled} style={{ width: '50%' }} value={key} onChange={e => props.onChange({ key: e.target.value, value, index })} />
      <Input placeholder="VALUE" disabled={props.disabled} style={{ width: '50%' }} value={value} onChange={e => props.onChange({ key, value: e.target.value, index })} />
    </Input.Group>
  );
};

const KeyValueList = (props) => {
  const values = Object.keys(props.value).map((it, index) => ({ key: it, value: props.value[it], index }));
  const [list, setList] = useState(values);
  const onChange = (type, index, value) => {
    const newList = [...list];
    if (type == 'add') {
      newList.push({ key: '', value: '', index: list.length });
    } else if (type == 'minus') {
      newList.splice(index, 1);
    } else if (type == 'change') {
      newList[index] = value;
    }
    setList(newList);
    const obj = {};
    newList.map(it => {
      if (it.value && it.key) {
        obj[it.key] = it.value;
      }
    });
    props.onChange(JSON.stringify(obj));
  };
  return (
    <div>
      {list.map((it, index) => {
        return (
          <div key={it.index} className={styles.line}>
            <KeyValue
              info={it}
              onChange={e => onChange('change', index, e)}
              disabled={props.disabled}
            />
            {!props.disabled && <MinusCircleOutlined
              onClick={() => onChange('minus', index)}
            />}
          </div>
        );
      })}
      <div style={!props.disabled ? { paddingRight: 22 } : {}}>
        <Button disabled={props.disabled} type="dashed" block onClick={() => onChange('add')} icon={<PlusOutlined />}>添加参数</Button>
      </div>
    </div>
  );
};

const FunctionDetail = (props) => {
  const { onChange, model, disabled } = props;
  const { label, params, returnValues, returnValue } = model;
  const [values, changeValues] = useState({ params, returnValues, returnValue });
  const onValuesChange = (changedValues) => {
    const JsonStr = ['params', 'returnValues'];
    const key = Object.keys(changedValues)[0];
    changeValues({ ...values, ...changedValues });
    if (JsonStr.includes(key)) {
      if (isJSON(changedValues[key])) {
        onChange(changedValues);
      }
    } else {
      onChange(changedValues);
    }

  };
  return (
    <Row className={styles.functionDetail}>
      <Col span={4}>函数名:</Col>
      <Col span={20}>{label}</Col>
      <Divider />
      <Col span={4}>
        <Popover
          placement="topLeft"
          content={<div>别名：查询结果赋值给该字段，默认函数名</div>}
        >
          <QuestionCircleOutlined color={''} />
        </Popover>
        映射:
      </Col>
      <Col span={20}>
        <Input
          placeholder="如果不填，默认以函数名为返回结果字段"
          value={values.returnValue}
          onChange={e => onValuesChange({ returnValue: e.target.value })}
          disabled={disabled}
        />
      </Col>
      <Divider />
      <Col span={4}>入参:</Col>
      <Col span={20}>
        {/* <CodeEditor
          name="入参"
          title="入参"
          language="json"
          height={180}
          value={values.params}
          onChange={e => onValuesChange({ params: e })}
        /> */}
        <KeyValueList onChange={e => onValuesChange({ params: e })} value={isJSON(values.params) ? JSON.parse(values.params) : {}} disabled={disabled} />
      </Col>
      <Divider />
      <Col span={4}>出参:</Col>
      <Col span={20}>
        {/* <CodeEditor
          name="入参"
          title="入参"
          language="json"
          height={180}
          value={values.params}
          onChange={e => onValuesChange({ returnValues: e })}
        /> */}
        <KeyValueList onChange={e => onValuesChange({ returnValues: e })} value={isJSON(values.returnValues) ? JSON.parse(values.returnValues) : {}} disabled={disabled} />
      </Col>
    </Row>
  );
};

export default FunctionDetail;
