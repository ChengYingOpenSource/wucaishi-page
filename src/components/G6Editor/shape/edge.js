export default function (G6) {
  G6.registerEdge('flow-polyline-round', {
    options: {
      style: { stroke: '#A3B1BF', strokeOpacity: 0.92, lineWidth: 2, lineAppendWidth: 8, endArrow: true, startArrow: false },
    },
    setState(name, value, item) {
      const group = item.getContainer();
      const path = group.getChildByIndex(0);
      if (name === 'selected') {
        if (value) {
          path.attr('lineWidth', 3);
          path.attr('stroke', '#2D41EF');
        } else {
          path.attr('lineWidth', 2);
          path.attr('stroke', '#A3B1BF');
        }
      } else if (name === 'hover') {
        if (value) { path.attr('stroke', '#666'); } else { path.attr('stroke', '#A3B1BF'); }
      }
    },
  }, 'cubic-vertical');
}
