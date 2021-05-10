export default function (G6) {
  G6.registerNode('func-node', {
    // 最外面的那层
    shapeType: 'rect',
    labelPosition: 'center',
    labelStyle: {
      position: 'center',
      fontSize: 18,
    },
    getShapeStyle(cfg) {
      cfg.size = [140, 32];
      const width = cfg.size[0];
      const height = cfg.size[1];
      const style = {
        x: 0 - width / 2,
        y: 0 - height / 2,
        width,
        height,
        fill: cfg.color, // 填充色
        stroke: '', // 边框
        radius: 4,
      };
      return style;
    },
    drawExtra(cfg, group) {
      // 里面的那层
      const width = 134;
      const height = 30;
      group.addShape('rect', {
        draggable: true,
        attrs: {
          x: 2 - width / 2,
          y: 0 - height / 2,
          width,
          height,
          fill: '#fff', // 填充色
          stroke: '', // 边框
          radius: 4,
        },
      });
    },
    getAnchorPoints() {
      return [
        [0.5, 0], // top
        // [1, 0.5], // right
        [0.5, 1], // bottom
        // [0, 0.5], // left
      ];
    },
    setCustomState(name, value, node) {
      const group = node.getContainer();
      if (name == 'selected') {
        const rect = group.getChildByIndex(1);
        if (value) {
          rect.attr('fill', 'rgba(255, 255, 255, .7)');
        } else {
          rect.attr('fill', '#fff');
        }
      }
    },
  }, 'base-node');
  G6.registerNode('start-node', {
    shapeType: 'rect',
    labelPosition: 'center',
    getShapeStyle(cfg) {
      cfg.size = [100, 32];
      const width = cfg.size[0];
      const height = cfg.size[1];
      const style = {
        x: 0 - width / 2,
        y: 0 - height / 2,
        fill: '#FFFFFF',
        lineWidth: 1,
        radius: 4,
        stroke: '#666',
        cursor: 'default',
        width,
        height,
      };
      return style;
    },
    getAnchorPoints() {
      return [
        [0.5, 1], // bottom
      ];
    },
  }, 'base-node');
}
