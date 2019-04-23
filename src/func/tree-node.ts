import {TreeNode, Tree, baseTreeNode } from "../data-types/tree-node";
import TreeUtil from "./tree";

export default class TreeNodeUtil {

  static _init = <T extends TreeNode>(node: T): T => {
    const children = node.children.map(c => TreeNodeUtil._init(c));
    return {...node, open: children.length !== 0, children};
  }

  static toArrayWithoutClose = <T extends TreeNode>(node: T): T[] => {
    if (node.children.length === 0 || !node.open) { return [node]; }
    return [node].concat((node.children as T[]).map(c => TreeNodeUtil.toArrayWithoutClose(c)).reduce((a, b) => a.concat(b)));
  }

  static _open = <T extends TreeNode>(node: T, id: string, open: boolean): T => {
    if (node.id === id) { return {...node, open}; }
    const children = node.children.map(c => (TreeNodeUtil._open(c, id, open)));
    return {...node, children};
  }

  static _focus = <T extends TreeNode>(node: T, id: string): T => {
    const children = node.children.map(c => (TreeNodeUtil._focus(c, id)));
    return {...node, children, focus: node.id === id};
  }

  static _getFocusNode = <T extends TreeNode>(node: T): T | undefined => {
    if (node.focus) { return node; }
    if (node.children.length === 0) { return undefined; }
    return node.children.map(c => TreeNodeUtil._getFocusNode(c) as T)
    .reduce((a, b) => a || b || undefined);
  }

  static _deleteFocus = <T extends TreeNode>(node: T): T => {
    if (node.focus === true) { return {...node, focus: false}; }
    const children = node.children.map(c => (TreeNodeUtil._deleteFocus(c)));
    return {...node, children};
  }

  static addDetails = <T extends TreeNode>(node: T, parent: T): T => {
    const newNode = TreeUtil.getNewNode(parent.type, baseTreeNode);
    const pushedNode = TreeUtil._unshift(node, newNode, parent);
    return TreeNodeUtil._open(pushedNode, parent.id, true) as T;
  }

  static addNextBrother = <T extends TreeNode>(node: T, to: T): T => {
    const parentNode = TreeUtil._getPrent(node, to);
    if (parentNode === null) { throw 'cannot find a parent.' }
    var newNode = TreeUtil.getNewNode(parentNode.type, baseTreeNode) as T;
    newNode = {...newNode, focus: true};
    const deleteFocusNode = TreeNodeUtil._deleteFocus(node);
    return TreeUtil._insert(deleteFocusNode, newNode, to, true);
  }

  static addFromCommon = (node: TreeNode, parent: TreeNode, common: Tree, base: TreeNode): TreeNode => {
    const commonAsTreeNode = TreeUtil._get(common, base);
    const pushedNode = TreeUtil._push(node, commonAsTreeNode, parent);
    return TreeNodeUtil._open(pushedNode, parent.id, true);
  }
}