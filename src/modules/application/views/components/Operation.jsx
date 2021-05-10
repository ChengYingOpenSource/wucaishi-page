import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Operation = (props) => {
  const { handleAdd } = props;
  console.log(123, 'test');
  return (
    <div className="flexje">
      <Button className="ml8" type="primary" onClick={handleAdd} icon={<PlusOutlined />} >创建项目</Button>
    </div>
  );
};
export default inject('store', 'global')(observer(Operation));
