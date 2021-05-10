import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { Form, Input, Select, Button } from 'antd';

const Values = ({ form, disabled, global }) => {
  const datastructuresTypes = toJS(global.datastructuresTypes);
  return (
    <Form.List
      name="testList"
      initialValues={[]}
    >
      {(fileds, { add }) => {
        console.log(fileds, 999)
        return (
          <>
            <Form.Item label="出参定义">
              {fileds.map((it, index) => {
                return (
                  <div key={it.key}>
                    <Form.Item noStyle name={[index, 'field']}>
                      <Input
                        style={{ width: '100px' }}
                        placeholder={'参数名'}
                        disabled={disabled}
                      />
                    </Form.Item>
                    <Form.Item noStyle name={[index, 'dataType']}>
                      <Select
                        placeholder={'类型'}
                        style={{ width: '120px' }}
                        disabled={disabled}
                      >
                        {datastructuresTypes.map(item => {
                          return <Select.Option key={item} value={item}>{item}</Select.Option>;
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item noStyle name={[index, 'name']}>
                      <Input
                        style={{ width: '100px' }}
                        placeholder={'名称'}
                        disabled={disabled}
                      />
                    </Form.Item>
                    <Form.Item noStyle name={[index, 'required']}>
                      <Select
                        placeholder={'是否必填'}
                        style={{ width: '80px' }}
                        disabled={disabled}
                      >
                        <Select.Option value={1}>必填</Select.Option>
                        <Select.Option value={0}>选填</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                )
              })}
            </Form.Item>
            <Button disabled={disabled} onClick={() => add()}>添加参数</Button>
          </>
        );
      }}
    </Form.List>
  );
}
export default inject('store', 'global')(observer(Values));
