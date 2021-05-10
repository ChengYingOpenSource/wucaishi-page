import React from 'react';
import G6 from '@antv/g6';
import ToolbarPanel from './ToolbarPanel';
import ItemPanel from './ItemPanel';
import DetailPanel from './DetailPanel';
import YamlSql from './YamlSql';
import Command from './plugins/command';
import AddItemPanel from './plugins/addItemPanel';
import Toolbar from './plugins/toolbar';
import CanvasPanel from './plugins/canvasPanel';
import registerShape from './shape';
import registerBehavior from './behavior';
import styles from './index.less';

registerShape(G6);
registerBehavior(G6);

class CodeEditor extends React.Component {
  static defaultProps = {
    height: window.innerHeight - 198,
    isView: false,
    mode: 'edit',
    lang: 'zh',
    funs: [
      { name: 'fun_a' },
      { name: 'fun_b' },
    ],
    value: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedModel: {},
      data: props.value ? JSON.parse(props.value) : null,
    };
    this.pageRef = React.createRef();
    this.toolbarRef = React.createRef();
    this.detailPanelRef = React.createRef();
    this.itemPanelRef = React.createRef();
  }

  componentDidMount() {
    const { mode } = this.props;
    const height = this.props.height - 1;
    const width = this.pageRef.current.offsetWidth;
    const grid = new G6.Grid();
    this.cmdPlugin = new Command();
    const toolbar = new Toolbar({ container: this.toolbarRef.current });
    const addItemPanel = new AddItemPanel({ container: this.itemPanelRef.current });
    const canvasPanel = new CanvasPanel({ container: this.pageRef.current });
    this.graph = new G6.Graph({
      plugins: [this.cmdPlugin, toolbar, addItemPanel, canvasPanel, grid],
      container: this.pageRef.current,
      height,
      width,
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'clickSelected'],
        view: [],
        edit: ['drag-canvas', 'hoverNodeActived', 'hoverAnchorActived', 'dragNode', 'dragEdge',
          'dragPanelItemAddNode', 'clickSelected', 'deleteItem', 'dragPoint', 'brush-select'],
      },
      defaultEdge: {
        type: 'flow-polyline-round',
      },
    });
    this.graph.setMode(mode);
    this.graph.data(this.state.data ? { ...this.state.data } : { nodes: [{ type: 'start-node', id: 'start', x: width / 2, y: 50, label: '起点' }], edges: [] });
    this.graph.render();
    this.initEvents();
  }

  initEvents() {
    this.graph.on('change', () => {
      const nodes = this.graph.getNodes();
      const edges = this.graph.getEdges();
      const data = {
        nodes: nodes.map(it => it.get('model')),
        edges: edges.map(it => {
          const { clazz, id, source, sourceAnchor, target, targetAnchor, type } = it.get('model');
          return { clazz, id, source, sourceAnchor, target, targetAnchor, type };
        }),
      };
      this.setState({ data });
      this.props.onChange && this.props.onChange(JSON.stringify(data));
    });
    this.graph.on('afteritemselected', (items) => {
      if (items && items.length > 0) {
        const item = this.graph.findById(items[0]);
        this.setState({ selectedModel: { ...item.getModel() } });
      } else {
        this.setState({ selectedModel: {} });
      }
    });
    const page = this.pageRef.current;
    const graph = this.graph;
    const height = this.props.height - 1;
    this.resizeFunc = () => {
      graph.changeSize(page.offsetWidth, height);
    };
    window.addEventListener('resize', this.resizeFunc);
  }

  onItemCfgChange(obj) {
    const items = this.graph.get('selectedItems');
    if (items && items.length > 0) {
      const item = this.graph.findById(items[0]);
      if (this.graph.executeCommand) {
        this.graph.executeCommand('update', {
          itemId: items[0],
          updateModel: obj,
        });
      } else {
        this.graph.updateItem(item, obj);
      }
      this.setState({ selectedModel: { ...item.getModel() } });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunc);
  }

  render() {
    const { height, funs, mode } = this.props;
    const { selectedModel } = this.state;
    return (
      <div className={styles.main}>
        <ToolbarPanel ref={this.toolbarRef} />
        <div className={styles.container}>
          <ItemPanel ref={this.itemPanelRef} height={height} data={funs} />
          <div ref={this.pageRef} className={styles.canvasPanel} style={{ height, width: '100%' }} />
          <DetailPanel
            ref={this.detailPanelRef}
            height={height}
            model={selectedModel}
            onChange={(key, val) => { this.onItemCfgChange(key, val); }}
            disabled={mode !== 'edit'}
          />
        </div>
        {/* <YamlSql data={this.state.data} /> */}
      </div>
    );
  }
}
export default CodeEditor;
