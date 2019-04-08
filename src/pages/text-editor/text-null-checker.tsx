import * as React from 'react';
import TreeNode from '../../data-types/tree-node';
import TextEditor, { EditorProps } from './text-editor';
import { RouteComponentProps } from 'react-router';
import link from '../../settings/path-list';

interface Props extends RouteComponentProps {
  toolRef: HTMLDivElement | null;
  rightPaneRef: HTMLDivElement | null;
  treeNodes: TreeNode[] | null;
  selectedNodeList: TreeNode[] | null;
  commonNodes: TreeNode[];
  changeNode: (node: TreeNode) => void;
  addNode: (node: TreeNode) => void;
  addCommonList: (node: TreeNode) => void;
  deleteCommonList: (node: TreeNode) => void;
}

const TextNullChecker: React.SFC<Props> = (props: Props) => {
  const {
    toolRef, treeNodes, selectedNodeList, commonNodes,
    changeNode, addCommonList, deleteCommonList, addNode, history
  } = props;
  if (toolRef === null || selectedNodeList === null || treeNodes === null) {
    return <p>Now Loading..</p>;
  }

  const parent = selectedNodeList.length === 1 ? null : selectedNodeList[selectedNodeList.length - 2];

  const back = () => history.push(link.dashboard);

  const viewerProps: EditorProps = {
    toolRef,
    parent,
    commonNodes,
    node: selectedNodeList[selectedNodeList.length - 1],
    back,
    changeNode,
    addCommonList,
    deleteCommonList,
    addNode,
  }
  
  return <TextEditor {...viewerProps}/>;
};

export default TextNullChecker;