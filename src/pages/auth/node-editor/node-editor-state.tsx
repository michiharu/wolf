import * as React from 'react';
import { useState } from 'react';
import TreeNode from '../../../data-types/tree-node';
import NodeEditor from './node-editor';

interface Props {
  node: TreeNode;
  changeNode: (node: TreeNode) => void;
}

const NodeEditorState: React.SFC<Props> = (props: Props) => {
  const {node, changeNode} = props;
  const [prevNode, setPrevNode] = useState<TreeNode | null>(null);
  const [nodeLabel, setNodeLabel] = useState<string>(node.label);
  const [nodeChildren, setNodeChildren] = useState<TreeNode[]>(node.children);
  const [nowLoading, setNowLoading] = useState(false);

  const reLoad = () => {
    setNowLoading(true);
    setTimeout(() => setNowLoading(false), 10);
  }

  if (prevNode === null || prevNode.id !== node.id) {
    setNodeLabel(node.label);
    setNodeChildren(node.children);
    setPrevNode(node);
    reLoad();
  }

  const changeNodeLabel = (e: any) => {
    setNodeLabel(e.target.value);
  }

  const changeLabel = (id: string) => (e: any) => {
    const label = e.target.value;
    const newNodeChildren = nodeChildren.map(i => i.id === id ? {...i, label} : i);
    setNodeChildren(newNodeChildren);
  }

  const add = (index: number) => {
    const newNode: TreeNode = {
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
    console.log(order);
    const saveNode: TreeNode = {
      id: node.id,
      label: nodeLabel,
      input: '',
      output: '',
      children: order.map(i => nodeChildren[i])
    };
    changeNode(saveNode);
  }
  if (nowLoading) return <p>Now Loading..</p>;
  return (
    <NodeEditor
      nodeLabel={nodeLabel}
      nodeChildren={nodeChildren}
      changeNodeLabel={changeNodeLabel}
      changeLabel={changeLabel}
      add={add}
      _delete={_delete}
      save={save}
    />
  );
}
export default NodeEditorState;
