import React, { Component } from 'react';
import browserHistory from './lib/history';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import CommonFrame from './modules/layout/views/CommonFrame';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
// import 'antd/dist/antd.css';
import './styles/common.less';

const routes = [];

export default class App extends Component {
  static registerRoute(moduleRoute) {
    if (moduleRoute instanceof Array) {
      routes.push(...moduleRoute);
    } else {
      routes.push(moduleRoute);
    }
  }

  render() {
    return (
      <ConfigProvider componentSize="middle" locale={zhCN}>
        <Router history={browserHistory}>
          <Switch>
            <Route render={({ location }) => (
              <CommonFrame location={location}>
                <Router history={browserHistory}>
                  <Route render={() => {
                    return (
                      <Switch>
                        <Route exact path="/" render={() => (<Redirect to={'/home'} />)} />
                        {routes.map((item) => (
                          <Route
                            exact
                            location={location}
                            path={item.path}
                            component={item.comp}
                            key={item.path}
                          />
                        ))}
                        <Redirect to={'/home'} />
                      </Switch>
                    );
                  }}
                  />
                </Router>
              </CommonFrame>
            )}
            />
          </Switch>
        </Router>
      </ConfigProvider>
    );
  }
}
