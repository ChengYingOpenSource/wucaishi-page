
import Item from '@antv/g6/lib/item/item';
import { deepMix } from '@antv/util';

export default class ControlPoint extends Item {
  constructor(cfg) {
    super(deepMix(cfg, {
      type: 'controlPoint',
      // capture: false,
      isActived: false,
      model: {
        type: 'controlPoint',
        style: { r: 3.5, fill: '#fff', stroke: '#666', lineAppendWidth: 12 },
      },
    }));
    this.enableCapture(true);
    this.toFront();
  }
}
