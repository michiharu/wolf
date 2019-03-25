import TreeNode, { Type, EditableNode, Point, Cell, NodeWithoutId } from "../data-types/tree-node";
import { viewItem } from "../settings/layout";
import Util from "./util";

export default class EditableNodeUtil {

  static get = (parentType: Type, node: TreeNode): EditableNode => {
    const index = 0;
    const depth = {top: 0, bottom: 0};
    const point = {x: 0, y: 0};
    const children = node.children.map(c => EditableNodeUtil.get(node.type, c));
    const rect = {
      w: viewItem.rect.w,
      h: viewItem.rect.h + (parentType === 'switch' ? viewItem.textline : 0),
    };
    const open = false;
    const focus = false;

    return {...node, parentType, index, depth, point, open, focus, children, self: rect, rect};
  }

  static equal = (a: TreeNode, b: TreeNode): boolean => a.id === b.id;

  static calcTextlineHeight = (node: EditableNode): number => {
    return (!Util.isEmpty(node.input)  ? viewItem.textline : 0)
         + (!Util.isEmpty(node.output) ? viewItem.textline : 0);
  }

  static calcSelfLength = (parentType: Type, node: EditableNode, open: boolean, which: which) => {

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
            + EditableNodeUtil.calcTextlineHeight(node)
            + (node.children.length !== 0 ?
               node.children.map(c => c.self.h + viewItem.spr.h).reduce((a, b) => a + b) : 0);
        }
      } else {
        if (which === 'width') {
          // task, close, width
          return viewItem.rect.w;
        } else {
          // task, close, height
          return viewItem.rect.h;
        }
      }
    } else {
      if (open) {
        if (which === 'width') {
          // switch, open, width
          return viewItem.indent+ (node.children.length !== 0
            ? node.children.map(c => c.self.w + viewItem.spr.w).reduce((a, b) => a + b)
            : viewItem.rect.w + viewItem.spr.w );
        } else {
          // switch, open, height
          return viewItem.rect.h + viewItem.spr.h
            + EditableNodeUtil.calcTextlineHeight(node)
            + (node.children.length !== 0 ? 
               node.children.map(c => c.self.h).reduce((a, b) => Math.max(a, b)) + viewItem.spr.h : 0);
        }
      } else {
        if (which === 'width') {
          // task, close, width
          return viewItem.rect.w;
        } else {
          // task, close, height
          return viewItem.rect.h;
        }
      }
    }
  }
  static open = (point: Point, node: EditableNode, id: string, open: boolean): EditableNode => {
    const openNode = EditableNodeUtil._open(node, id, open);
    return EditableNodeUtil.setCalcProps(point, openNode);
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

  static _setSize = (node: EditableNode): EditableNode => {

    const rect = {
      w: viewItem.rect.w,
      h: viewItem.rect.h + (node.open ? EditableNodeUtil.calcTextlineHeight(node) : 0)
    };

    const children = node.children.map(c => (EditableNodeUtil._setSize(c)));
    const newNode = {...node, children};

    const self = {
      w: EditableNodeUtil.calcSelfLength(node.parentType, newNode, node.open, 'width'),
      h: EditableNodeUtil.calcSelfLength(node.parentType, newNode, node.open, 'height')
    };

    return {...node, children, self, rect};
  }

  static _setPoint = (point: Point, node: EditableNode): EditableNode => {

    var anchor = 0;
    const children = node.children.map(c => {
      const p: Point = {
        x: point.x + viewItem.indent + (node.type !== 'switch' ? 0 : anchor),
        y: point.y + node.rect.h + viewItem.spr.h + (node.type === 'switch' ? 0 : anchor)
      };
      const child = EditableNodeUtil._setPoint(p, c);
      anchor += node.type !== 'switch' ? c.self.h + viewItem.spr.h : c.self.w + viewItem.spr.w;
      return child;
    });

    return {...node, point, children};
  }

  static _setIndexAndDepth = (index: number, top: number, node: EditableNode): EditableNode=> {

    if (!node.open || node.children.length === 0) {
      const depth = {top, bottom: 0};
      return {...node, index, depth};
    }

    const children = node.children.map((c, i) => (EditableNodeUtil._setIndexAndDepth(i, top + 1, c)));
    const bottom = children.map(c => c.depth.bottom).reduce((a, b) => a > b ? a : b) + 1;
    const depth = {top, bottom};

    return {...node, children, index, depth};
  }

  static setCalcProps = (point: Point, node: EditableNode) => {
    const setSizeNode = EditableNodeUtil._setSize(node);
    const setPointNode = EditableNodeUtil._setPoint(point, setSizeNode);
    const setDepthNode = EditableNodeUtil._setIndexAndDepth(0, 0, setPointNode);
    return setDepthNode;
  }

  static toFlat = (node: EditableNode): EditableNode[] => {
    if (node.children.length === 0 || !node.open) { return [node]; }
    return [node].concat(node.children.map(c => EditableNodeUtil.toFlat(c)).reduce((a, b) => a.concat(b)));
  }

  static makeBaseMap = (node: EditableNode): Cell[][] => {
    const base: Cell[][] = [];
    for(var x = 0; x < node.point.x + node.self.w; x++) {
      base[x] = [];
      for(var y = 0; y < node.point.y + node.self.h; y++) {
        base[x][y] = undefined;
      }
    }
    return base;
  }

  static makeMap = (nodes: EditableNode[]): Cell[][] => {
    const root = nodes[0];
    const sorted = nodes.sort((a, b) => a.depth.bottom < b.depth.bottom ? 1 : -1);

    const selfBase = EditableNodeUtil.makeBaseMap(root);

    const map: Cell[][][] = [selfBase].concat(sorted.map(s => {
      const result = EditableNodeUtil.makeBaseMap(s);

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

  static move = (point: Point, node: EditableNode, from: EditableNode, to: EditableNode): EditableNode => {
    const setDummyNode = EditableNodeUtil.changeAsDummyById(node, from.id);
    const deletedTree = EditableNodeUtil._deleteById(setDummyNode, from.id);
    const setParentTypeNode = EditableNodeUtil.setParentType(from, to.parentType);
    const insertedNode = EditableNodeUtil._insert(deletedTree, setParentTypeNode, to);
    return EditableNodeUtil.setCalcProps(point, insertedNode);
  }

  static push = (point: Point, node: EditableNode, child: EditableNode, parent: EditableNode): EditableNode => {
    const setDummyNode = EditableNodeUtil.changeAsDummyById(node, child.id);
    const deletedTree = EditableNodeUtil._deleteById(setDummyNode, child.id);
    const setParentTypeChild = EditableNodeUtil.setParentType(child, parent.type);
    const pushedNode = EditableNodeUtil._push(deletedTree, setParentTypeChild, parent);
    return EditableNodeUtil.setCalcProps(point, pushedNode);
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

  static _insertNext = (node: EditableNode, target: EditableNode, to: EditableNode): EditableNode => {
    const index = node.children.map(c => c.id).indexOf(to.id);
    if (index !== -1) {
      node.children.splice(index + 1, 0, target);
      return {...node};
    }

    const children = node.children.map(c => EditableNodeUtil._insertNext(c, target, to));
    return {...node, children};
  }

  static addBefore = (point: Point, node: EditableNode, target: EditableNode): EditableNode => {
    const newNode = EditableNodeUtil.getNewNode(target.parentType);
    const insertedNode = EditableNodeUtil._insert(node, newNode, target);
    return EditableNodeUtil.setCalcProps(point, insertedNode);
  }

  static addNext = (point: Point, node: EditableNode, target: EditableNode): EditableNode => {
    const newNode = EditableNodeUtil.getNewNode(target.parentType);
    const insertedNode = EditableNodeUtil._insertNext(node, newNode, target);
    return EditableNodeUtil.setCalcProps(point, insertedNode);
  }

  static addDetails = (point: Point, node: EditableNode, parent: EditableNode): EditableNode => {
    const newNode = EditableNodeUtil.getNewNode(parent.type);
    const pushedNode = EditableNodeUtil._push(node, newNode, parent);
    const openNode = EditableNodeUtil._open(pushedNode, parent.id, true);
    return EditableNodeUtil.setCalcProps(point, openNode);
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

  static replaceOnlySelf = (point: Point, node: EditableNode, target: EditableNode): EditableNode => {
    const replaceNode = EditableNodeUtil._replaceOnlySelf(node, target);
    return EditableNodeUtil.setCalcProps(point, replaceNode);
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
    return EditableNodeUtil.setCalcProps(point, deletedTree);
  }

  static _deleteById = (node: EditableNode, id: string): EditableNode => {
    const findResult = node.children.find(c => c.id === id);
    if (findResult !== undefined) {
      return {...node, children: node.children.filter(c => c.id !== id)};
    }

    const children = node.children.map(c => EditableNodeUtil._deleteById(c, id));
    return {...node, children};
  }

  static _changeAsDummyById = (node: EditableNode, id: string): EditableNode => {
    const findResult = node.children.find(c => c.id === id);
    
    if (findResult !== undefined) {
      if (findResult.id === '--') { return node; }
      return {...node, children: node.children.map(c => c.id === id ? {...c, id: '--'} : c)};
    }

    const children = node.children.map(c => EditableNodeUtil._changeAsDummyById(c, id));
    return {...node, children};
  }

  static changeAsDummyById = (node: EditableNode, id: string): EditableNode => {
    const findResult = EditableNodeUtil._find(node, '--');
    if (findResult !== undefined) { return node; }
    return EditableNodeUtil._changeAsDummyById(node, id);
  }

  static deleteDummy = (point: Point, node: EditableNode): EditableNode => {
    const deletedNode = EditableNodeUtil._deleteById(node, '--');
    return EditableNodeUtil.setCalcProps(point, deletedNode);
  }
}

export type which = 'width' | 'height';