import React from 'react';
import { Provider } from 'mobx-react';
import store from '../../service/store';
import CreateSteps from './components/CreateSteps';
import styles from '../create/create.less';

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Provider store={store}>
        <div className={styles.create}>
          <CreateSteps />
        </div>
      </Provider>
    );
  }
}
Test.defaultProps = {};
export default Test;
