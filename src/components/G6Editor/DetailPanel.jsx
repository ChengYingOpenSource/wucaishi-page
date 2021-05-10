import React, { forwardRef } from 'react';
import FunctionDetail from './FunctionDetail';
import styles from './index.less';

const DetailPanel = forwardRef(({ height, model, onChange, disabled }, ref) => {
  return (
    <div ref={ref} className={styles.detailPanel} style={{ height }}>
      { model.type === 'func-node' && <FunctionDetail model={model} onChange={onChange} disabled={disabled} />}
    </div>
  );
});

export default DetailPanel;
