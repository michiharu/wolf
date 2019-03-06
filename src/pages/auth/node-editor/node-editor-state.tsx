import * as React from 'react';
import { useState, useEffect } from 'react';
import TreeNode, { Type } from '../../../data-types/tree-node';
import NodeEditor from './node-editor';

interface Props {
  containerRef: HTMLDivElement;
  node: TreeNode;
  changeNode: (node: TreeNode) => void;
  back: () => void;
  selectNode: (node: TreeNode | null) => void;
}

const NodeEditorState: React.SFC<Props> = (props: Props) => {
  var timeout: NodeJS.Timeout;
  const {containerRef, node, changeNode, back, selectNode} = props;
  const [prevNode, setPrevNode] = useState<TreeNode | null>(null);
  const [type, setType] = useState<Type>(node.type);
  const [label, setLabel] = useState<string>(node.label);
  const [input, setInput] = useState<string>(node.input);
  const [output, setOutput] = useState<string>(node.label);
  const [nodeChildren, setNodeChildren] = useState<TreeNode[]>(node.children);
  const [nowLoading, setNowLoading] = useState(false);

  const reLoad = () => {
    setNowLoading(true);
    timeout = setTimeout(() => setNowLoading(false), 1);
  }

  useEffect(() => clearTimeout(timeout));

  if (prevNode === null || prevNode.id !== node.id) {
    setPrevNode(node);
    setType(node.type);
    setLabel(node.label);
    setInput(node.input);
    setOutput(node.output);
    setNodeChildren(node.children);
    reLoad();
  }

  const changeType = (e: any) => {
    const str = e.target.value === 'task' ? 'task' :
    e.target.value === 'switch' ? 'switch' : undefined;
    if (str === undefined) { throw 'The value couldn\'t match any type.' }
    setType(str);
    if (str === 'task') {
      const newNodeChildren = nodeChildren.map(i => ({...i, ifState: ''}));
      setNodeChildren(newNodeChildren);
    }
    reLoad();
  }

  const changeNodeLabel = (e: any) => {
    setLabel(e.target.value);
  }
  const changeInput = (e: any) => {
    setInput(e.target.value);
  }
  const changeOutput = (e: any) => {
    setOutput(e.target.value);
  }

  const changeIfState = (id: string) => (e: any) => {
    const ifState = e.target.value;
    const newNodeChildren = nodeChildren.map(i => i.id === id ? {...i, ifState} : i);
    setNodeChildren(newNodeChildren);
  }

  const changeLabel = (id: string) => (e: any) => {
    const label = e.target.value;
    const newNodeChildren = nodeChildren.map(i => i.id === id ? {...i, label} : i);
    setNodeChildren(newNodeChildren);
  }

  const add = (index: number) => {
    const newNode: TreeNode = {
      type: 'task',
      id: 'rand:' + String(Math.random()).slice(2),
      input: '',
      output: '',
      label: '新しい作業',
      children: []
    };
    var newNodeChildren = nodeChildren.concat([]);
    newNodeChildren.splice(index, 0, newNode);
    setNodeChildren(newNodeChildren);
    reLoad();
  }

  const _delete = (id: string) => {
    var newNodeChildren = nodeChildren.filter(n => n.id !== id);
    setNodeChildren(newNodeChildren);
    reLoad();
  }

  const save = (order: number[]) => {
    const saveNode: TreeNode = {
      type,
      id: node.id,
      label: label,
      input: '',
      output: '',
      children: order.map(i => nodeChildren[i])
    };
    changeNode(saveNode);
  }

  if (nowLoading) return <p>Now Loading..</p>;

  return (
    <NodeEditor
      containerRef={containerRef}
      nodeType={type}
      nodeLabel={label}
      nodeInput={input}
      nodeOutput={output}
      nodeChildren={nodeChildren}
      changeType={changeType}
      changeNodeLabel={changeNodeLabel}
      changeInput={changeInput}
      changeOutput={changeOutput}
      changeIfState={changeIfState}
      changeLabel={changeLabel}
      add={add}
      _delete={_delete}
      save={save}
      back={back}
      selectNode={selectNode}
    />
  );
}
export default NodeEditorState;
