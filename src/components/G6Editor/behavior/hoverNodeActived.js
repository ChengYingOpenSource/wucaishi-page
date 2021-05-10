// import { Marker } from '@antv/g-canvas/lib/shape';

export default function (G6) {
  G6.registerBehavior('hoverNodeActived', {
    getEvents() {
      return {
        'node:mouseenter': 'onNodeEnter',
        'node:mouseleave': 'onNodeLeave',
        'anchor:mouseleave': 'onAnchorLeave',
        // 'anchor:mouseenter': 'onAnchorEnter',
      };
    },
    onAnchorLeave(e) {
      const node = e.item.getContainer().getParent();
      if (node && !this.graph.get('edgeDragging')) {
        this.graph.setItemState(node.get('item'), 'show-anchor', false);
      }
    },
    onNodeEnter(e) {
      if (!this.graph.get('edgeDragging')) {
        this.graph.setItemState(e.item, 'show-anchor', true);
      }
    },
    onNodeLeave(e) {
      if (!(e.target.cfg.name == 'anchor-shape') && !this.graph.get('edgeDragging')) {
        this.graph.setItemState(e.item, 'show-anchor', false);
      }
    },
    onAnchorEnter(e) {
      if (!this.graph.get('edgeDragging')) {
        this.graph.setItemState(e.item, 'show-anchor', true);
      }
    },
  });
}
