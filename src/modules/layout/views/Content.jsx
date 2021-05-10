import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './CommonFrame.less';


const Content = (props) => {
  return (
    <div className={styles.content}>
      {props.children}
    </div>
  );
};

export default inject('global')(observer(Content));
