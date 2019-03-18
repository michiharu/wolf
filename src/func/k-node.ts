import TreeNode, { Type, KNode, Point, Cell, NodeWithoutId } from "../data-types/tree-node";
import { viewItem } from "../settings/layout";
import Util from "./util";

export default class KNodeUtil {

  static getViewNode = (parentType: Type, node: TreeNode): KNode => {
    const index = 0;
    const depth = {top: 0, bottom: 0};
    const point = {x: 0, y: 0};
    const children = node.children.map(c => KNodeUtil.getViewNode(node.type, c));
    const rect = {
      w: viewItem.rect.w,
      h: viewItem.rect.h + (parentType === 'switch' ? viewItem.textline : 0),
    };
    const open = false;
    const focus = false;

    return {...node, parentType, index, depth, point, open, focus, children, self: rect, rect};
  }

  static equal = (a: TreeNode, b: TreeNode): boolean => a.id === b.id;

  static calcTextlineHeight = (node: KNode): number => {
    return (!Util.isEmpty(node.input)  ? viewItem.textline : 0)
         + (!Util.isEmpty(node.output) ? viewItem.textline : 0);
  }

  static calcLength = (parentType: Type, node: KNode, open: boolean, which: which) => {

    if (node.type !== 'switch') {
      if (open) {
        if (which === 'width') {
          // task, open, width
          const childrenLength = node.children.length !== 0
            ? node.children.map(c => c.self.w).reduce((a, b) => Math.max(a, b))
            : viewItem.rect.w;
          return viewItem.indent + viewItem.spr.w + childrenLength;
        } else {
          // task, open, height
          return viewItem.rect.h + viewItem.spr.h
            + (parentType === 'switch' ? viewItem.textline : 0)
            + KNodeUtil.calcTextlineHeight(node)
            + (node.children.length !== 0 ?
               node.children.map(c => c.self.h + viewItem.spr.h).reduce((a, b) => a + b) : 0);
        }
      } else {
        if (which === 'width') {
          // task, close, width
          return viewItem.rect.w;
        } else {
          // task, close, height
          return viewItem.rect.h + (parentType === 'switch' ? viewItem.textline : 0);
        }
      }
    } else {
      if (open) {
        if (which === 'width') {
          // switch, open, width
          return viewItem.indent + (node.children.length !== 0
            ? node.children.map(c => c.self.w + viewItem.spr.w).reduce((a, b) => a + b)
            : viewItem.rect.w);
        } else {
          // switch, open, height
          return viewItem.rect.h + viewItem.spr.h * 2
            + (parentType === 'switch' ? viewItem.textline : 0)
            + KNodeUtil.calcTextlineHeight(node)
            + (node.children.length !== 0 ? 
               node.children.map(c => c.self.h).reduce((a, b) => Math.max(a, b)) : 0);
        }
      } else {
        if (which === 'width') {
          // task, close, width
          return viewItem.rect.w;
        } else {
          // task, close, height
          return viewItem.rect.h + (parentType === 'switch' ? viewItem.textline : 0);
        }
      }
    }
  }
  static open = (point: Point, node: KNode, id: string, open: boolean): KNode => {
    const openNode = KNodeUtil._open(node, id, open);
    return KNodeUtil.setCalcProps(point, openNode);
  }

  static _open = (node: KNode, id: string, open: boolean): KNode => {
    if (node.id === id) { return {...node, open}; }
    const children = node.children.map(c => (KNodeUtil._open(c, id, open)));
    return {...node, children};
  }

  static focus = (node: KNode, id: string): KNode => {
    const deletedFocusNode = KNodeUtil._deleteFocus(node);
    const focusNode = KNodeUtil._focus(deletedFocusNode, id);
    return focusNode;
  }

  static _deleteFocus = (node: KNode): KNode => {
    if (node.focus === true) { return {...node, focus: false}; }
    const children = node.children.map(c => (KNodeUtil._deleteFocus(c)));
    return {...node, children};
  }

  static _focus = (node: KNode, id: string): KNode => {
    if (node.id === id) { return {...node, focus: true}; }
    const children = node.children.map(c => (KNodeUtil._focus(c, id)));
    return {...node, children};
  }

  static _setSize = (node: KNode): KNode => {

    const rect = {
      w: viewItem.rect.w,
      h: viewItem.rect.h
        + (node.parentType === 'switch' ? viewItem.textline : 0)
        + (node.open ? KNodeUtil.calcTextlineHeight(node) : 0)
    };

    const children = node.children.map(c => (KNodeUtil._setSize(c)));
    const newNode = {...node, children};

    const self = {
      w: KNodeUtil.calcLength(node.parentType, newNode, node.open, 'width'),
      h: KNodeUtil.calcLength(node.parentType, newNode, node.open, 'height')
    };

    return {...node, children, self, rect};
  }

  static _setPoint = (point: Point, node: KNode): KNode => {

    var anchor = 0;
    const children = node.children.map(c => {
      const p: Point = {
        x: point.x + viewItem.indent + (node.type !== 'switch' ? 0 : anchor),
        y: point.y + node.rect.h + viewItem.spr.h + (node.type === 'switch' ? 0 : anchor)
      };
      const child = KNodeUtil._setPoint(p, c);
      anchor += node.type !== 'switch' ? c.self.h + viewItem.spr.h : c.self.w + viewItem.spr.w;
      return child;
    });

    return {...node, point, children};
  }

  static _setIndexAndDepth = (index: number, top: number, node: KNode): KNode=> {

    if (!node.open || node.children.length === 0) {
      const depth = {top, bottom: 0};
      return {...node, index, depth};
    }

    const children = node.children.map((c, i) => (KNodeUtil._setIndexAndDepth(i, top + 1, c)));
    const bottom = children.map(c => c.depth.bottom).reduce((a, b) => a > b ? a : b) + 1;
    const depth = {top, bottom};

    return {...node, children, index, depth};
  }

  static setCalcProps = (point: Point, node: KNode) => {
    const setSizeNode = KNodeUtil._setSize(node);
    const setPointNode = KNodeUtil._setPoint(point, setSizeNode);
    const setDepthNode = KNodeUtil._setIndexAndDepth(0, 0, setPointNode);
    return setDepthNode;
  }

  static toFlat = (node: KNode): KNode[] => {
    if (node.children.length === 0 || !node.open) { return [node]; }
    return [node].concat(node.children.map(c => KNodeUtil.toFlat(c)).reduce((a, b) => a.concat(b)));
  }

  static makeBaseMap = (node: KNode): Cell[][] => {
    const base: Cell[][] = [];
    for(var x = 0; x < node.point.x + node.self.w; x++) {
      base[x] = [];
      for(var y = 0; y < node.point.y + node.self.h; y++) {
        base[x][y] = undefined;
      }
    }
    return base;
  }

  static makeMap = (nodes: KNode[]): Cell[][] => {
    const root = nodes[0];
    const sorted = nodes.sort((a, b) => a.depth.bottom < b.depth.bottom ? 1 : -1);

    const selfBase = KNodeUtil.makeBaseMap(root);

    const map: Cell[][][] = [selfBase].concat(sorted.map(s => {
      const result = KNodeUtil.makeBaseMap(s);

      if (s.open) {
        for(var x = s.point.x + viewItem.spr.w; x < s.point.x + s.self.w; x++) {
          if (x < 0) { continue; }
          for(var y = s.point.y + viewItem.spr.h; y < s.point.y + s.self.h; y++) {
            result[x][y] = { node: s, action: 'push' };
          }
        }
      }

      const switchSpr = s.index === 0 ? viewItem.spr.w * 4 : 0;

      if (s.parentType !== 'switch') {
        for(var x = s.point.x; x < s.point.x + s.rect.w; x++) {
          if (x < 0) { continue; }
          for(var y = s.point.y; y < s.point.y + s.rect.h; y++) {
            result[x][y] = { node: s, action: 'none'};
          }
        }
      } else {
        for(var x = s.point.x; x < s.point.x + s.rect.w - switchSpr; x++) {
          if (x < 0) { continue; }
          for(var y = s.point.y; y < s.point.y + s.rect.h; y++) {
            result[x][y] = { node: s, action: 'none'};
          }
        }
      }
      
      if (s.depth.top !== 0) {
        if (s.parentType !== 'switch') {
          for(var x = s.point.x; x < s.point.x + s.rect.w; x++) {
            if (x < 0) { continue; }
            for(var y = s.point.y - viewItem.spr.h; y < s.point.y; y++) {
              result[x][y] = { node: s, action: 'move' };
            }
          }
        } else {
          for(var x = s.point.x - viewItem.spr.w - switchSpr; x < s.point.x + switchSpr; x++) {
            if (x < 0) { continue; }
            for(var y = s.point.y - 1; y < s.point.y + s.rect.h + 1; y++) {
              result[x][y] = { node: s, action: 'move' };
            }
          }
        }
      }
      
      return result;
    }));

    return map.reduce((before, next) => before.map((_, x) => {
      return _.map((beforeCell, y) => {
        if (next.length - 1 < x) { return beforeCell; }
        const nextCell = next[x][y];
        return nextCell !== undefined ? nextCell : beforeCell;
      });
    }))
  }
  
  static isEqualCell = (a: Cell, b: Cell): boolean => {
    if (a === undefined && b === undefined) { return true; }
    if (a === undefined || b === undefined) { return false; }
    return a.action === b.action && a.node.id === b.node.id;
  }

  static move = (point: Point, node: KNode, from: KNode, to: KNode): KNode => {
    const setDummyNode = KNodeUtil.changeAsDummyById(node, from.id);
    const deletedTree = KNodeUtil._deleteById(setDummyNode, from.id);
    const setParentTypeNode = KNodeUtil.setParentType(from, to.parentType);
    const insertedNode = KNodeUtil._insert(deletedTree, setParentTypeNode, to);
    return KNodeUtil.setCalcProps(point, insertedNode);
  }

  static push = (point: Point, node: KNode, child: KNode, parent: KNode): KNode => {
    const setDummyNode = KNodeUtil.changeAsDummyById(node, child.id);
    const deletedTree = KNodeUtil._deleteById(setDummyNode, child.id);
    const setParentTypeChild = KNodeUtil.setParentType(child, parent.type);
    const pushedNode = KNodeUtil._push(deletedTree, setParentTypeChild, parent);
    return KNodeUtil.setCalcProps(point, pushedNode);
  }

  static _push = (node: KNode, child: KNode, parent: KNode): KNode => {
    if (node.id === parent.id) {
      node.children.push(child);
      return {...node};
    }
    const children = node.children.map(c => KNodeUtil._push(c, child, parent));
    return {...node, children};
  }
  
  static setParentType = (node: KNode, parentType: Type): KNode => {
    const result = {...node, parentType};
    if (node.parentType === 'switch') { result.ifState = undefined; }
    return result;
  }

  static getNewNode = (parentType: Type): KNode => ({
    parentType,
    type: 'task',
    id: 'rand:' + String(Math.random()).slice(2),
    label: '新しい作業',
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

  static _insert = (node: KNode, target: KNode, to: KNode): KNode => {
    const index = node.children.map(c => c.id).indexOf(to.id);
    if (index !== -1) {
      node.children.splice(index, 0, target);
      return {...node};
    }

    const children = node.children.map(c => KNodeUtil._insert(c, target, to));
    return {...node, children};
  }

  static _insertNext = (node: KNode, target: KNode, to: KNode): KNode => {
    const index = node.children.map(c => c.id).indexOf(to.id);
    if (index !== -1) {
      node.children.splice(index + 1, 0, target);
      return {...node};
    }

    const children = node.children.map(c => KNodeUtil._insertNext(c, target, to));
    return {...node, children};
  }

  static addBefore = (point: Point, node: KNode, target: KNode): KNode => {
    const newNode = KNodeUtil.getNewNode(target.parentType);
    const insertedNode = KNodeUtil._insert(node, newNode, target);
    return KNodeUtil.setCalcProps(point, insertedNode);
  }

  static addNext = (point: Point, node: KNode, target: KNode): KNode => {
    const newNode = KNodeUtil.getNewNode(target.parentType);
    const insertedNode = KNodeUtil._insertNext(node, newNode, target);
    return KNodeUtil.setCalcProps(point, insertedNode);
  }

  static addDetails = (point: Point, node: KNode, parent: KNode): KNode => {
    const newNode = KNodeUtil.getNewNode(parent.type);
    const pushedNode = KNodeUtil._push(node, newNode, parent);
    return KNodeUtil.setCalcProps(point, pushedNode);
  }

  // Treeから指定した要素を返す
  static _find = (node: KNode, id: string): KNode | undefined => {
    if (node.id === id) { return node; }
    if (node.children.length === 0) { return undefined; }
    return node.children.map(c => KNodeUtil._find(c, id))
    .reduce((a, b) => a !== undefined ? a
                    : b !== undefined ? b : undefined);
  }

  static replaceOnlySelf = (point: Point, node: KNode, target: KNode): KNode => {
    const replaceNode = KNodeUtil._replaceOnlySelf(node, target);
    return KNodeUtil.setCalcProps(point, replaceNode);
  }

  static _replaceOnlySelf = (node: KNode, target: KNode): KNode => {
    if (node.id === target.id) {
      const children = node.type === target.type ? node.children :
        target.type === 'task'
          ? node.children.map(c => ({...c, parentType: target.type, ifState: undefined}))
          : node.children.map(c => ({...c, parentType: target.type, ifState: ''}));

      return {...target, children};
    } else {
      const children = node.children.map(c => KNodeUtil._replaceOnlySelf(c, target));
      return {...node, children};
    }
  }

  static deleteById = (point: Point, node: KNode, id: string): KNode => {
    const deletedTree = KNodeUtil._deleteById(node, id);
    return KNodeUtil.setCalcProps(point, deletedTree);
  }

  static _deleteById = (node: KNode, id: string): KNode => {
    const findResult = node.children.find(c => c.id === id);
    if (findResult !== undefined) {
      return {...node, children: node.children.filter(c => c.id !== id)};
    }

    const children = node.children.map(c => KNodeUtil._deleteById(c, id));
    return {...node, children};
  }

  static _changeAsDummyById = (node: KNode, id: string): KNode => {
    const findResult = node.children.find(c => c.id === id);
    
    if (findResult !== undefined) {
      if (findResult.id === '--') { return node; }
      return {...node, children: node.children.map(c => c.id === id ? {...c, id: '--'} : c)};
    }

    const children = node.children.map(c => KNodeUtil._changeAsDummyById(c, id));
    return {...node, children};
  }

  static changeAsDummyById = (node: KNode, id: string): KNode => {
    const findResult = KNodeUtil._find(node, '--');
    if (findResult !== undefined) { return node; }
    return KNodeUtil._changeAsDummyById(node, id);
  }

  static deleteDummy = (point: Point, node: KNode): KNode => {
    const deletedNode = KNodeUtil._deleteById(node, '--');
    return KNodeUtil.setCalcProps(point, deletedNode);
  }

  static _removeId = (node: TreeNode): NodeWithoutId => {
    const children = node.children.map(c => KNodeUtil._removeId(c));
    return {
      type: node.type,
      label: node.label,
      ifState: node.ifState,
      input: node.input,
      output: node.output,
      children
    };
  }

  static _setId = (node: NodeWithoutId): TreeNode => {
    const id = 'rand:' + String(Math.random()).slice(2);
    const children = node.children.map(c => KNodeUtil._setId(c));
    return {...node, id, children};
  }
}

export type which = 'width' | 'height';