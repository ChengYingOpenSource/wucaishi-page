import { shapeBase } from '@antv/g6/lib/shape/shapeBase';
import Shape from '@antv/g6/lib/shape/shape';

export default function (G6) {
  Shape.registerFactory('anchor', {
    defaultShapeType: 'marker',
    getShape: (type) => {
      const shapeObj = Object.assign({}, shapeBase, {
        type: 'marker',
        itemType: type,
        drawShape(cfg, group) {
          const style = this.getShapeStyle(cfg);
          const shape = group.addShape('marker', {
            attrs: style,
            name: 'anchor-shape',
            draggable: true,
          });
          return shape;
        },
        setState(name, value, item) {
          if (name === 'active-anchor') {
            if (value) {
              this.update({ style: { r: 5, fill: '#666', fillOpacity: 1, stroke: '#666' } }, item);
            } else {
              this.update({ style: { r: 4, fill: '#fff', stroke: '#666', lineAppendWidth: 12 } }, item);
            }
          }
        },
      });
      return shapeObj;
    },
  });
}
