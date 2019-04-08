import TreeNode, { Type, EditableNode, Cell } from "../data-types/tree-node";
import EditableNodeViewUtil from "./editable-node-view-util";
import KSize from "../data-types/k-size";
import TreeUtil from "./tree";

export default class EditableNodeUtil {

  static get = (parentType: Type, node: TreeNode, ks: KSize): EditableNode => {
    const newNode = EditableNodeUtil._get(parentType, node);
    return EditableNodeViewUtil.setCalcProps(newNode, ks);
  }

  static _get = (parentType: Type, node: TreeNode): EditableNode => {
    const index = 0;
    const depth = {top: 0, bottom: 0};
    const point = {x: 0, y: 0};
    const children = node.children.map(c => EditableNodeUtil._get(node.type, c));
    const rect = { w: 0, h: 0};
    const open = children.length !== 0 ? true : false;
    const focus = false;

    return {...node, parentType, index, depth, point, open, focus, children, self: rect, rect};
  }

  static open = (node: EditableNode, ks: KSize, id: string, open: boolean): EditableNode => {
    const openNode = EditableNodeUtil._open(node, id, open);
    return EditableNodeViewUtil.setCalcProps(openNode, ks);
  }

  static _open = (node: EditableNode, id: string, open: boolean): EditableNode => {
    if (node.id === id) { return {...node, open}; }
    const children = node.children.map(c => (EditableNodeUtil._open(c, id, open)));
    return {...node, children};
  }

  static focus = (node: EditableNode, id: string): EditableNode => {
    const deletedFocusNode = EditableNodeUtil._deleteFocus(node);
    const focusNode = EditableNodeUtil._focus(deletedFocusNode, id);
    return focusNode;
  }

  static _deleteFocus = (node: EditableNode): EditableNode => {
    if (node.focus === true) { return {...node, focus: false}; }
    const children = node.children.map(c => (EditableNodeUtil._deleteFocus(c)));
    return {...node, children};
  }

  static _focus = (node: EditableNode, id: string): EditableNode => {
    if (node.id === id) { return {...node, focus: true}; }
    const children = node.children.map(c => (EditableNodeUtil._focus(c, id)));
    return {...node, children};
  }

  static toFlat = (node: EditableNode): EditableNode[] => {
    if (node.children.length === 0 || !node.open) { return [node]; }
    return [node].concat(node.children.map(c => EditableNodeUtil.toFlat(c)).reduce((a, b) => a.concat(b)));
  }
  
  static isEqualCell = (a: Cell, b: Cell): boolean => {
    if (a === undefined && b === undefined) { return true; }
    if (a === undefined || b === undefined) { return false; }
    return a.action === b.action && a.node.id === b.node.id;
  }

  static move = (node: EditableNode, ks: KSize, from: EditableNode, to: EditableNode): EditableNode => {
    const deletedTree = TreeUtil._deleteById(node, from.id) as EditableNode; 
    const setParentTypeNode = EditableNodeUtil.setParentType(from, to.parentType);
    const insertedNode = EditableNodeUtil._insert(deletedTree, setParentTypeNode, to);
    return EditableNodeViewUtil.setCalcProps(insertedNode, ks);
  }

  static push = (node: EditableNode, ks: KSize, child: EditableNode, parent: EditableNode): EditableNode => {
    const deletedTree = TreeUtil._deleteById(node, child.id) as EditableNode;
    const setParentTypeChild = EditableNodeUtil.setParentType(child, parent.type);
    const pushedNode = EditableNodeUtil._push(deletedTree, setParentTypeChild, parent);
    return EditableNodeViewUtil.setCalcProps(pushedNode, ks);
  }

  static _push = (node: EditableNode, child: EditableNode, parent: EditableNode): EditableNode => {
    if (node.id === parent.id) {
      node.children.push(child);
      return {...node};
    }
    const children = node.children.map(c => EditableNodeUtil._push(c, child, parent));
    return {...node, children};
  }
  
  static setParentType = (node: EditableNode, parentType: Type): EditableNode => {
    const result = {...node, parentType};
    return result;
  }

  static getNewNode = (parentType: Type): EditableNode => ({
    parentType,
    type: parentType !== 'switch' ? 'task' : 'case',
    id: 'rand:' + String(Math.random()).slice(2),
    label: parentType !== 'switch' ? '新しい作業' : '新しい条件',
    input: '',
    output: '',
    preConditions: '',
    postConditions: '',
    workerInCharge: '',
    remarks: '',
    necessaryTools: '',
    exceptions: '',
    imageName: '',
    imageBlob: '',
    children: [],
    open: false,
    focus: false,
    index: 0,
    depth: {top: 0, bottom: 0},
    point: {x: 0, y: 0},
    self: {w: 0, h: 0},
    rect: {w: 0, h: 0},
  });

  static _insert = (node: EditableNode, target: EditableNode, to: EditableNode): EditableNode => {
    const index = node.children.map(c => c.id).indexOf(to.id);
    if (index !== -1) {
      node.children.splice(index, 0, target);
      return {...node};
    }

    const children = node.children.map(c => EditableNodeUtil._insert(c, target, to));
    return {...node, children};
  }

  static addDetails = (node: EditableNode, ks: KSize, parent: EditableNode): EditableNode => {
    const newNode = EditableNodeUtil.getNewNode(parent.type);
    const pushedNode = EditableNodeUtil._push(node, newNode, parent);
    const openNode = EditableNodeUtil._open(pushedNode, parent.id, true);
    return EditableNodeViewUtil.setCalcProps(openNode, ks);
  }

  static addFromCommon = (node: EditableNode, ks: KSize, parent: EditableNode, common: TreeNode): EditableNode => {
    const newNode = EditableNodeUtil._get(parent.type, common);
    const pushedNode = EditableNodeUtil._push(node, newNode, parent);
    const openNode = EditableNodeUtil._open(pushedNode, parent.id, true);
    return EditableNodeViewUtil.setCalcProps(openNode, ks);
  }

  // Treeから指定した要素を返す
  static _find = (node: EditableNode, id: string): EditableNode | undefined => {
    if (node.id === id) { return node; }
    if (node.children.length === 0) { return undefined; }
    return node.children.map(c => EditableNodeUtil._find(c, id))
    .reduce((a, b) => a !== undefined ? a
                    : b !== undefined ? b : undefined);
  }

  static _getPrent = (node: EditableNode, target: EditableNode): EditableNode | null => {
    if (node.children.length === 0) { return null; }
    if (node.children.find(c => c.id === target.id) !== undefined) { return node; }
    return node.children
      .map(c => EditableNodeUtil._getPrent(c, target))
      .reduce((a, b) => a || b || null);
  }

  static replace = (node: EditableNode, ks: KSize, target: EditableNode): EditableNode => {
    const replaceNode = EditableNodeUtil._replace(node, target);
    return EditableNodeViewUtil.setCalcProps(replaceNode, ks);
  }

  static _replace = (node: EditableNode, target: EditableNode): EditableNode => {
    if (node.id === target.id) {
      return target;
    } else {
      const children = node.children.map(c => EditableNodeUtil._replace(c, target));
      return {...node, children};
    }
  }

  static replaceOnlySelf = (node: EditableNode, ks: KSize, target: EditableNode): EditableNode => {
    const replaceNode = EditableNodeUtil._replaceOnlySelf(node, target);
    return EditableNodeViewUtil.setCalcProps(replaceNode, ks);
  }

  static _replaceOnlySelf = (node: EditableNode, target: EditableNode): EditableNode => {
    if (node.id === target.id) {
      const children = node.type === target.type ? node.children :
        target.type === 'task'
          ? node.children.map(c => ({...c, parentType: target.type, ifState: undefined}))
          : node.children.map(c => ({...c, parentType: target.type, ifState: ''}));

      return {...target, children};
    } else {
      const children = node.children.map(c => EditableNodeUtil._replaceOnlySelf(c, target));
      return {...node, children};
    }
  }

  static deleteById = (node: EditableNode, ks: KSize, id: string): EditableNode => {
    const deletedTree = TreeUtil._deleteById(node, id) as EditableNode;
    return EditableNodeViewUtil.setCalcProps(deletedTree, ks);
  }
}

export type which = 'width' | 'height';