import React from 'react';
import { Provider } from 'mobx-react';
import { toJS } from 'mobx';
import Title from '@/components/Title';
import List from './components/List';
import Filter from './components/Filter';
import ListTabs from './components/ListTabs';
import store from '../service/store';
import styles from './home.less';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const appInfo = toJS(store.appInfo);
    if (!appInfo) {
      return null;
    }
    const path = [
      { name: appInfo.name, path: '/group' },
      { name: appInfo.appName },
    ];
    return (
      <Provider store={store}>
        <div className={styles.home}>
          <Title path={path} />
          <Filter />
          <ListTabs />
          <List />
        </div>
      </Provider>
    );
  }
}
Home.defaultProps = {};
export default Home;
