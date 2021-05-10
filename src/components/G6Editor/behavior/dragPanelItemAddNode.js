
export default function (G6) {
  G6.registerBehavior('dragPanelItemAddNode', {
    getDefaultCfg() {
      return {

      };
    },
    getEvents() {
      return {
        'canvas:mousemove': 'onMouseMove',
        'canvas:mouseup': 'onMouseUp',
        'canvas:mouseleave': 'onMouseLeave',
      };
    },
    onMouseMove(e) {
      if (this.graph.get('addNodeDragging')) {
        let delegateShape = this.graph.get('addDelegateShape');
        const addModel = this.graph.get('addModel');
        const width = addModel.size ? parseInt(addModel.size.split('*')[0]) : 140;
        const height = addModel.size ? parseInt(addModel.size.split('*')[1]) : 32;
        const point = this.graph.getPointByClient(e.x, e.y);
        const { x } = point;
        const { y } = point;
        if (!delegateShape) {
          const parent = this.graph.get('group');
          delegateShape = parent.addShape('rect', {
            attrs: {
              width,
              height,
              x: x - width / 2,
              y: y - height / 2,
              stroke: '#1890FF',
              fill: '#1890FF',
              fillOpacity: 0.08,
              lineDash: [4, 4],
              radius: 4,
              lineWidth: 1,
            },
          });
          delegateShape.set('capture', false);
          this.graph.set('addDelegateShape', delegateShape);
        }
        delegateShape.attr({ x: x - width / 2, y: y - height / 2 });
        this.graph.paint();
        this.graph.emit('afternodedrag', delegateShape);
      }
    },
    onMouseUp(e) {
      if (this.graph.get('addNodeDragging')) {
        const p = this.graph.getPointByClient(e.clientX, e.clientY);
        if (p.x > 0 && p.y > 0) {
          this._addNode(p);
        }
      }
    },
    onMouseLeave() {
      if (this.graph.get('addNodeDragging')) {
        this._clearDelegate();
      }
    },
    _clearDelegate() {
      const delegateShape = this.graph.get('addDelegateShape');
      if (delegateShape) {
        delegateShape.remove();
        this.graph.set('addDelegateShape', null);
        this.graph.paint();
      }
      this.graph.emit('afternodedragend');
    },
    _addNode(p) {
      if (this.graph.get('addNodeDragging')) {
        const addModel = this.graph.get('addModel');
        const { type = 'func-node' } = addModel;
        addModel.type = type;
        const timestamp = new Date().getTime();
        const id = type + timestamp;
        const { x } = p;
        const { y } = p;
        if (this.graph.executeCommand) {
          this.graph.executeCommand('add', {
            type: 'node',
            addModel: {
              ...addModel,
              x,
              y,
              id,
            },
          });
        } else {
          this.graph.add('node', {
            ...addModel,
            x,
            y,
            id,
          });
        }
        this._clearDelegate();
      }
    },
  });
}
