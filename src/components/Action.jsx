import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';

const Action = (props) => {
  const { flag = true } = props;
  const { currentEnvironment } = toJS(props.global);
  return (currentEnvironment.isAction && flag) ? props.children : null;
};
export default inject('global')(observer(Action));
