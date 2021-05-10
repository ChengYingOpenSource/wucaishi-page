import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Menu, Dropdown } from 'antd';
import styles from './CommonFrame.less';

@inject('global')
@observer
class environmentTigger extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.global.getEnvironment();
  }

  render() {
    const { currentEnvironment, environmentList } = toJS(this.props.global);
    if (currentEnvironment && currentEnvironment.name) {
      const menu = (
        <Menu>
          {environmentList && environmentList.map(item => {
            if (item.value === currentEnvironment.value) {
              return null;
            }
            return (
              <Menu.Item key={item.id}>
                <span onClick={() => {
                  window.open(`${item.value}`);
                }}
                >
                  <div>{item.name}</div>
                </span>
              </Menu.Item>
            );
          })}
        </Menu>
      );
      return (
        <Dropdown overlay={menu}>
          <div className={styles.tigger}>{currentEnvironment.name}</div>
        </Dropdown>
      );
    } else {
      return null;
    }
  }
}
environmentTigger.defaultProps = {
};

export default environmentTigger;
