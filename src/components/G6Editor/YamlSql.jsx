import React from 'react';
import CodeEditor from '@/components/CodeEditor';
import { safeDump } from 'js-yaml';
import styles from './index.less';


const Editor = (props) => {
  console.log(props.data);
  const { nodes, edges } = props.data;
  const nodesObj = {};
  nodes.map(it => {
    nodesObj[it.id] = it;
  });
  const obj = {};
  const getAction = (id) => {
    const actions = {};
    edges.map(it => {
      const { source, target } = it;
      if (source == id) {
        const returnValues = JSON.parse(nodesObj[target].returnValues || '{}') || {};
        const name = nodesObj[target].returnValue || nodesObj[target].label.replace(/^fun_/, '');
        actions[name] = {
          action: nodesObj[target].label,
        };
        if (nodesObj[target].params) {
          actions[name].params = JSON.parse(nodesObj[target].params);
        }
        actions[name].fields = {
          ...(Object.keys(returnValues).length > 0 ? returnValues : { '.': '.' }),
          ...getAction(target),
        };
      }
    });
    return actions;
  }
  edges.map(it => {
    const { source, target } = it;
    if (source == 'start') {
      const returnValues = JSON.parse(nodesObj[target].returnValues || '{}') || {};
      const name = nodesObj[target].returnValue || nodesObj[target].label.replace(/^fun_/, '');
      obj[name] = {
        action: nodesObj[target].label,
      };
      if (nodesObj[target].params) {
        obj[name].params = JSON.parse(nodesObj[target].params);
      }
      obj[name].fields = {
        ...(Object.keys(returnValues).length > 0 ? returnValues : { '.': '.' }),
        ...getAction(target),
      };
    }
  });
  console.log(obj);
  return (
    <div className={styles.result}>
      <CodeEditor value={safeDump(obj)} name="结果" height={300} readOnly language={'yaml'} />
    </div>
  );
};

export default Editor;
