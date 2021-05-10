import React from 'react';
import { Provider } from 'mobx-react';
import CreateSteps from './components/CreateSteps';
import store from '../../service/store';
import styles from './create.less';

class Create extends React.Component {
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
Create.defaultProps = {};
export default Create;
