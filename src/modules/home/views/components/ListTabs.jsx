import React from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import history from '@/lib/history';
import { Radio, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


const ListTabs = (props) => {
  const { filter, statusObj } = toJS(props.store);
  const goCreate = () => {
    props.store.initForm();
    history.push('/create');
  };

  return (
    <div className="pt20">
      <Row justify="space-between">
        <Col>
          <Radio.Group
            onChange={e => {
              props.store.filterChange({ status: e.target.value });
              history.replace(`/list?status=${e.target.value}`);
            }}
            value={filter.status}
          >
            {Object.keys(statusObj).map(it => (
              <Radio.Button key={it} value={it}>{statusObj[it]}</Radio.Button>
            ))}
          </Radio.Group>
        </Col>
        <Col>
          {filter.status === '0' && <Button type="primary" icon={<PlusOutlined />} onClick={goCreate}>创建接口</Button>}
        </Col>
      </Row>
    </div>
  );
};
export default inject('store')(observer(ListTabs));
