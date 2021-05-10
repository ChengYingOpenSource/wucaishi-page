import React from 'react';
import { Provider } from 'mobx-react';
import store from '../../service/store';
import CreateSteps from './components/CreateSteps';
import styles from './publish.less';

class Publish extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Provider store={store}>
        <div className={styles.publish}>
          <CreateSteps />
        </div>
      </Provider>
    );
  }
}
Publish.defaultProps = {};
export default Publish;
