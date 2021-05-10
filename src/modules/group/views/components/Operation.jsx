import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Operation = (props) => {
  const { handleAdd } = props;
  return (
    <div className="flexje">
      <Button className="ml8" type="primary" onClick={handleAdd} icon={<PlusOutlined />} >创建模块</Button>
    </div>
  );
};
export default inject('store')(observer(Operation));
