import TreeNode, { Type, EditableNode, Point, Cell, NodeWithoutId } from "../data-types/tree-node";
import { viewItem } from "../settings/layout";
import Util from "./util";
import EditableNodeViewUtil from "./editable-node-view-util";

export default class EditableNodeUtil {

  static get = (point: Point, parentType: Type, node: TreeNode): EditableNode => {
    const newNode = EditableNodeUtil._get(parentType, node);
    return EditableNodeViewUtil.setCalcProps(point, newNode);
  }

  static _get = (parentType: Type, node: TreeNode): EditableNode => {
    const index = 0;
    const depth = {top: 0, bottom: 0};
    const point = {x: 0, y: 0};
    const children = node.children.map(c => EditableNodeUtil._get(node.type, c));
    const rect = {
      w: viewItem.rect.w,
      h: viewItem.rect.h + (parentType === 'switch' ? viewItem.textline : 0),
    };
    const open = children.length !== 0 ? true : false;
    const focus = false;

    return {...node, parentType, index, depth, point, open, focus, children, self: rect, rect};
  }

  static open = (point: Point, node: EditableNode, id: string, open: boolean): EditableNode => {
    const openNode = EditableNodeUtil._open(node, id, open);
    return EditableNodeViewUtil.setCalcProps(point, openNode);
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

  static move = (point: Point, node: EditableNode, from: EditableNode, to: EditableNode): EditableNode => {
    const deletedTree = EditableNodeUtil._deleteById(node, from.id);
    const setParentTypeNode = EditableNodeUtil.setParentType(from, to.parentType);
    const insertedNode = EditableNodeUtil._insert(deletedTree, setParentTypeNode, to);
    return EditableNodeViewUtil.setCalcProps(point, insertedNode);
  }

  static push = (point: Point, node: EditableNode, child: EditableNode, parent: EditableNode): EditableNode => {
    const deletedTree = EditableNodeUtil._deleteById(node, child.id);
    const setParentTypeChild = EditableNodeUtil.setParentType(child, parent.type);
    const pushedNode = EditableNodeUtil._push(deletedTree, setParentTypeChild, parent);
    return EditableNodeViewUtil.setCalcProps(point, pushedNode);
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

  static addDetails = (point: Point, node: EditableNode, parent: EditableNode): EditableNode => {
    const newNode = EditableNodeUtil.getNewNode(parent.type);
    const pushedNode = EditableNodeUtil._push(node, newNode, parent);
    const openNode = EditableNodeUtil._open(pushedNode, parent.id, true);
    return EditableNodeViewUtil.setCalcProps(point, openNode);
  }

  static addFromCommon = (point: Point, node: EditableNode, parent: EditableNode, common: TreeNode): EditableNode => {
    const newNode = EditableNodeUtil._get(parent.type, common);
    const pushedNode = EditableNodeUtil._push(node, newNode, parent);
    const openNode = EditableNodeUtil._open(pushedNode, parent.id, true);
    return EditableNodeViewUtil.setCalcProps(point, openNode);
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

  static replace = (point: Point, node: EditableNode, target: EditableNode): EditableNode => {
    const replaceNode = EditableNodeUtil._replace(node, target);
    return EditableNodeViewUtil.setCalcProps(point, replaceNode);
  }

  static _replace = (node: EditableNode, target: EditableNode): EditableNode => {
    if (node.id === target.id) {
      return target;
    } else {
      const children = node.children.map(c => EditableNodeUtil._replace(c, target));
      return {...node, children};
    }
  }

  static replaceOnlySelf = (point: Point, node: EditableNode, target: EditableNode): EditableNode => {
    const replaceNode = EditableNodeUtil._replaceOnlySelf(node, target);
    return EditableNodeViewUtil.setCalcProps(point, replaceNode);
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

  static deleteById = (point: Point, node: EditableNode, id: string): EditableNode => {
    const deletedTree = EditableNodeUtil._deleteById(node, id);
    return EditableNodeViewUtil.setCalcProps(point, deletedTree);
  }

  static _deleteById = (node: EditableNode, id: string): EditableNode => {
    const findResult = node.children.find(c => c.id === id);
    if (findResult !== undefined) {
      return {...node, children: node.children.filter(c => c.id !== id)};
    }

    const children = node.children.map(c => EditableNodeUtil._deleteById(c, id));
    return {...node, children};
  }

  static _isAllSwitchHasCase = (node: EditableNode): boolean => {
    if (node.children.length === 0) {
      if (node.type === 'switch') { return false; }
      return true;
    }
    return node.children.map(c => EditableNodeUtil._isAllSwitchHasCase(c)).reduce((a, b) => a && b);
  }

  static _isAllCaseHasItem = (node: EditableNode): boolean => {
    if (node.children.length === 0) {
      if (node.type === 'case') { return false; }
      return true;
    }
    return node.children.map(c => EditableNodeUtil._isAllCaseHasItem(c)).reduce((a, b) => a && b);
  }

  static _hasDifference = (t: TreeNode, e: EditableNode): boolean => {
    if (t.id     !== e.id)     { return true; }
    if (t.type   !== e.type)   { return true; }
    if (t.label  !== e.label)  { return true; }
    if (t.input  !== e.input)  { return true; }
    if (t.output !== e.output) { return true; }
    if (t.children.length !== e.children.length) { return true; }
    if (t.children.length === 0) { return false; }

    return t.children
    .map((_, i) => ({t: t.children[i], e: e.children[i]}))
    .map(te => EditableNodeUtil._hasDifference(te.t, te.e))
    .reduce((a, b) => a || b);
  }
}

export type which = 'width' | 'height';