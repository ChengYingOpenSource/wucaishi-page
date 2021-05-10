import Item from '@antv/g6/lib/item/item';
import { deepMix } from '@antv/util';

const editorStyle = {
  anchorPointStyle: { r: 6, fill: '#fff', stroke: '#666', lineAppendWidth: 12 },
  anchorHotsoptStyle: { r: 12, fill: '#666', fillOpacity: 0.25 },
  anchorHotsoptActivedStyle: { r: 14 },
  anchorPointHoverStyle: { r: 6, fill: '#666', fillOpacity: 1, stroke: '#666' },
};
export default class Anchor extends Item {
  constructor(cfg) {
    super(deepMix(cfg, {
      type: 'anchor',
      // capture: false,
      isActived: false,
      model: {
        type: 'anchor',
        style: {
          ...editorStyle.anchorPointStyle,
          cursor: 'crosshair',
        },
      },
    }));
    this.enableCapture(true);
    this.isAnchor = true;
    this.toFront();
  }

  showHotpot() {
    this.hotpot = this.getContainer().addShape('marker', {
      attrs: {
        ...this.get('model').style,
        ...editorStyle.anchorHotsoptStyle,
      },
      name: 'hotpot-shape',
      draggable: true,
    });
    this.hotpot.toFront();
    this.getKeyShape().toFront();
  }

  setActived() {
    this.update({ style: { ...editorStyle.anchorPointHoverStyle } });
  }

  clearActived() {
    this.update({ style: { ...editorStyle.anchorPointStyle } });
  }

  setHotspotActived(act) {
    this.hotpot &&
    (act ?
      this.hotpot.attr(editorStyle.anchorHotsoptActivedStyle)
      : this.hotpot.attr(editorStyle.anchorHotsoptStyle));
  }
}

