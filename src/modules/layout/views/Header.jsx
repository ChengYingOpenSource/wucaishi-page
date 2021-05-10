import React from 'react';
import { inject, observer } from 'mobx-react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import styles from './CommonFrame.less';


const Header = (props) => {
  return (
    <div className={styles.header}>
      <div className="flexac">
        <span className={styles.title} onClick={() => props.global.onTest()}>五彩石</span>
        <span className={styles.desc} ></span>
      </div>
      <div className="flexac">
        <div className={styles.help}>
          <QuestionCircleOutlined />
          <span
            onClick={() => {
              window.open('//github.com/ChengYingOpenSource/wucaishi/wiki');
            }}
            style={{ paddingLeft: 4 }}
          >帮助文档
          </span>
        </div>
      </div>

    </div>
  );
};

export default inject('global')(observer(Header));
