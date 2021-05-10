
import Anchor from '../item/anchor';

const nodeDefinition = {
  drawAnchor(group) {
    const bbox = group.get('children')[0].getBBox();
    this.getAnchorPoints().forEach((p, i) => {
      const anchorContainer = group.addGroup();
      const anchor = new Anchor({
        group: anchorContainer,
        index: i,
        model: {
          style: {
            x: bbox.minX + bbox.width * p[0],
            y: bbox.minY + bbox.height * p[1],
          },
        },
      });
      group.anchorShapes.push(anchorContainer);
    });
  },
  initAnchor(group) {
    group.anchorShapes = [];
    group.showAnchor = () => {
      this.drawAnchor(group);
    };
    group.getAllAnchors = () => {
      return group.anchorShapes.map(c => {
        c.filter(a => a.isAnchor);
      });
    };
    group.getAnchor = (i) => {
      return group.anchorShapes.filter(a => a.get('index') === i);
    };
    group.clearAnchor = () => {
      group.anchorShapes && group.anchorShapes.forEach(a => a.remove());
      group.anchorShapes = [];
    };
    group.clearHotpotActived = () => {
      group.anchorShapes && group.anchorShapes.forEach(a => {
        if (a.isAnchor) { a.setHotspotActived(false); }
      });
    };
  },
  drawShape(cfg, group) {
    const { shapeType } = this;
    const style = this.getShapeStyle(cfg);
    const shape = group.addShape(shapeType, {
      labelCfg: {
        position: 'center',
      },
      attrs: {
        ...style,
      },
    });
    this.drawExtra && this.drawExtra(cfg, group);
    this.initAnchor(group);
    return shape;
  },
  setState(name, value, node) {
    const group = node.getContainer();
    if (name === 'show-anchor') {
      if (value) {
        (group).showAnchor();
      } else {
        (group).clearAnchor();
      }
    } else if (name === 'hover') {
      const rect = group.getChildByIndex(1);
      const text = group.getChildByIndex(2);
      if (value) {
        rect.attr('cursor', 'move');
        if (text) { text.attr('cursor', 'move'); }
      } else {
        rect.attr('cursor', 'default');
        if (text) { text.attr('cursor', 'default'); }
      }
    }
    this.setCustomState(name, value, node);
  },
  setCustomState(name, value, item) {

  },
  getAnchorPoints() {
    return [
      [0.5, 0], // top
      [1, 0.5], // right
      [0.5, 1], // bottom
      [0, 0.5], // left
    ];
  },
};
export default function (G6) {
  G6.registerNode('base-node', nodeDefinition, 'single-node');
}
