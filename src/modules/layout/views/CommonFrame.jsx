import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import store from '../service/store';
import Header from './Header';
import Content from './Content';
import styles from './CommonFrame.less';

class CommonFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps, 'nextProps')
  }

  render() {
    return (
      <Provider global={store}>
        <div className={styles.layout} style={{ height: '100vh', minHeight: 460 }}>
          <Header />
          <Content>
            {this.props.children}
          </Content>
          <div className={styles.bottom}>Copyright © 2020 前端与设计</div>
        </div>
      </Provider>

    );
  }
}
CommonFrame.defaultProps = {
};

export default CommonFrame;
