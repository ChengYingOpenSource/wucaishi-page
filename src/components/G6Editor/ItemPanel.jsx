import React, { forwardRef } from 'react';
import styles from './index.less';

const colors = ['#5B8FF9', '#F6BD16', '#5AD8A6'];
const ItemPanel = forwardRef(({ height, data = [] }, ref) => {
  return (
    <div ref={ref} className={styles.itemPanel} style={{ height }}>
      {data.map((it, index) => {
        const dataItem = JSON.stringify({
          label: it.name,
          type: 'func-node',
          color: colors[index % 3],
        });
        return (
          <div draggable="true" key={it.name} className={styles.item} data-item={`${dataItem}`}>{it.name}</div>
        );
      })}
    </div>
  );
});

export default ItemPanel;
