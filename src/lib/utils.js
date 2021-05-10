import { safeDump, safeLoad } from 'js-yaml';
/**
 * @param   {String}
 * @return  {String}
 */
export const queryURL = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
};

export const isJSON = (str) => {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};

export const JSONParse = (str) => {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return obj;
      } else {
        return {};
      }
    } catch (e) {
      return {};
    }
  } else {
    return {};
  }
};

export const getYaml = (data) => {
  const {
    nodes,
    edges,
  } = JSONParse(data);
  const nodesObj = {};
  nodes.forEach(it => {
    nodesObj[it.id] = it;
  });
  let obj = {};
  const getAction = (id) => {
    const actions = {};
    edges.forEach(it => {
      const {
        source,
        target,
      } = it;
      if (source === id) {
        const returnValues = JSON.parse(nodesObj[target].returnValues || '{}') || {};
        const name = nodesObj[target].returnValue || nodesObj[target].label.replace(/^fun_/, '');
        actions[name] = {
          action: nodesObj[target].label,
        };
        if (isJSON(nodesObj[target].params) && Object.keys(JSON.parse(nodesObj[target].params)).length > 0) {
          actions[name].params = JSON.parse(nodesObj[target].params);
        }
        actions[name].fields = {
          ...(Object.keys(returnValues).length > 0 ? returnValues : {
            '.': '.',
          }),
          ...getAction(target),
        };
        if (source === 'start') {
          obj = { ...actions };
        }
      }
    });
    return actions;
  };
  getAction('start');
  return Object.keys(obj).length > 0 ? safeDump(obj) : '';
};

export const getPicture = (funs, yamlVal) => {
  try {
    const colors = ['#5B8FF9', '#F6BD16', '#5AD8A6'];
    const funcColor = {};

    funs.forEach((it, index) => {
      funcColor[it.name] = colors[index % 3];
    });

    const nodes = [{
      type: 'start-node',
      id: 'start',
      x: 300,
      y: 50,
      label: '起点',
    }];

    const edges = [];
    const yamlObj = safeLoad(yamlVal);
    const returnValues = (val) => {
      const obj = {};
      Object.keys(val).forEach(it => {
        if ((typeof val[it] !== 'object')) {
          obj[it] = val[it];
        }
      });
      return JSON.stringify(obj, null, '\t');
    };
    const addNodes = (source, index, level = 1, returnValue, info) => {
      const { action, params = {}, fields = {} } = info;
      if (funcColor[action]) {
        nodes.push({
          id: `fun-node${level}${index}`,
          label: action,
          type: 'func-node',
          x: index * 140 + 140,
          y: level * 140,
          params: JSON.stringify(params, null, '\t'),
          returnValue,
          returnValues: returnValues(fields),
          color: funcColor[action],
        });
        edges.push({
          clazz: 'flow',
          source,
          sourceAnchor: action == 'start' ? 0 : 1,
          target: `fun-node${level}${index}`,
          targetAnchor: 0,
          type: 'flow-polyline-round',
        });
        Object.keys(fields).forEach((item, i) => {
          if (typeof fields[item] === 'object') {
            addNodes(`fun-node${level}${index}`, i, level + 1, item, fields[item]);
          }
        });
      }
    };
    Object.keys(yamlObj).forEach((it, index) => {
      addNodes('start', index, 1, it, yamlObj[it]);
    });
    return JSON.stringify({ nodes, edges });
  } catch (err) {
    return null;
  }
};

export default {};
