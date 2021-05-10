import view from './views/home';
import Create from './views/create/create';
import TestRun from './views/test/test';
import Detail from './views/detail/detail';
import App from '../../app';

App.registerRoute({
  path: '/list',
  comp: view,
});

App.registerRoute({
  path: '/create',
  comp: Create,
});

App.registerRoute({
  path: '/testRun',
  comp: TestRun,
});

App.registerRoute({
  path: '/detail',
  comp: Detail,
});

