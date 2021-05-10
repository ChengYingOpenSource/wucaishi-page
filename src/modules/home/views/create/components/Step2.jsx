import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Row, Col, Button, List, message, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Funs from './Funs';
import DataSourceForm from './DataSourceForm';
import styles from '../create.less';

const Step2 = (props) => {
  const initValue = {
    dataViewCode: '',
    type: 'JDBC',
    description: '',
    responseDataStructure: [],
    requestDataStructure: [],
    dataSource: undefined,
    method: undefined,
    contextUrl: '',
    dataSourceCode: undefined,
    command: '',
  };
  const [form] = Form.useForm();
  const funcNode = useRef();
  const leftListNode = useRef();
  const [list, changeList] = useState(props.store.formValues.funs || [initValue]);
  const [current, changeCurrent] = useState(0);
  const [del, setDel] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  useImperativeHandle(props.stepNode, () => ({
    formValidate: () => {
      return funcNode.current.formValidate();
    },
    setFieldsValue: form.setFieldsValue,
  }));
  useEffect(() => {
    if (props.store.formValues.funs &&
      JSON.stringify(props.store.formValues.funs) !== JSON.stringify(list)) {
      changeList(props.store.formValues.funs);
      funcNode.current.resetFields();
      funcNode.current.setFieldsValue(props.store.formValues.funs[current]);
    }
  }, [current, list, props.store.formValues.funs]);
  useEffect(() => {
    funcNode.current.setFieldsValue(list[current]);
  }, [current, list]);

  return (
    <Row gutter={20} style={{ height: '100%' }}>
      <Col span={10} className={styles.step1Form}>
        <div className={styles.list} ref={leftListNode}>
          <List
            grid={{ column: 1 }}
            dataSource={list}
            renderItem={(item, index) => (
              <List.Item>
                <Row
                  justify="space-between"
                  className={`${current === index && styles._active} ${styles.bar}`}
                  onMouseEnter={() => setDel(index)}
                  onMouseLeave={() => setDel('')}
                >
                  <Col
                    flex={1}
                    onClick={() => {
                      if (current !== index) {
                        funcNode.current.formValidate().then(() => {
                          if (index !== current) {
                            changeCurrent(index);
                            funcNode.current.resetFields();
                            funcNode.current.setFieldsValue(list[index]);
                          }
                        }).catch(() => {
                          message.warn('当前视图存在必填项未填');
                        });
                      }
                    }}
                  >view_{item.dataViewCode}
                  </Col>
                  {((current === index || del === index) && list.length > 1 && !props.disabled) &&
                    <Col>
                      {/* {current === index && <Button type="link" icon={<PlayCircleOutlined />} onClick={() => funcNode.current.handleTest()} />} */}
                      <DeleteOutlined
                        onClick={() => {
                          changeList(list.filter((it, i) => i !== index));
                          if (index === 0) {
                            funcNode.current.setFieldsValue(list[1]);
                          } else {
                            changeCurrent(0);
                          }
                          props.store.changeFormValue({
                            funs: list.filter((it, i) => i !== index),
                          });
                        }}
                      />
                    </Col>
                  }
                </Row>
              </List.Item>
            )}
          />
        </div>
        <Button
          disabled={props.disabled}
          onClick={() => {
            funcNode.current.formValidate().then(() => {
              changeList([...list, initValue]);
              props.store.changeFormValue({ funs: [...list, initValue] });
              changeCurrent(list.length);
              funcNode.current.setFieldsValue(initValue);
              setTimeout(() => {
                const height = leftListNode.current.scrollHeight;
                leftListNode.current.scrollTop = height;
              });
            }).catch(() => {
              message.warn('当前视图存在必填项未填');
            });
          }}
          icon={<PlusOutlined />}
        >添加视图
        </Button>
      </Col>
      <Col span={14} style={{ height: '100%' }}>
        <Funs
          funcNode={funcNode}
          onValuesChange={(changedValues) => {
            const val = [...list];
            val[current] = { ...val[current], ...changedValues };
            changeList(val);
            props.store.changeFormValue({ funs: val });
          }}
          formValues={list[current]}
          isRename={value => list.filter(it => it.dataViewCode === value).length > 1}
          disabled={props.disabled}
          setModalVisible={setModalVisible}
        />
      </Col>
      <Modal
        title="添加数据源"
        visible={isModalVisible}
        footer={false}
        width={680}
        onCancel={() => setModalVisible(false)}
      >
        <DataSourceForm onCencel={setModalVisible} />
      </Modal>
    </Row>
  );
};
export default inject('store')(observer(Step2));
