
import registerAnchor from './anchor';
import functionNode from './functionNode';
import registerEdge from './edge';
import registerNode from './node';

export default function (G6) {
  registerAnchor(G6);
  registerNode(G6);
  functionNode(G6);
  registerEdge(G6);
}
