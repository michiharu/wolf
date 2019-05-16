import {TreeNode, Type, KTreeNode, DragRow, Tree, Point, DropRow } from "../data-types/tree";
import KSize from "../data-types/k-size";
import TreeNodeUtil from "./tree-node";

export default class KTreeUtil {

  static calcSelfLength = (node: KTreeNode, ks: KSize, which: which) => {
    const over = node.focus && ks.margin.h * ks.unit < buttonArea;
    if (node.open) {
      if (which === 'width') {
        // open, width
        const childrenLength = node.children.length !== 0
          ? node.children.map(c => c.self.w).reduce((a, b) => Math.max(a, b))
          : ks.rect.w;
        return ks.indent * 1.5 + childrenLength;
      } else {
        // open, height
        return ks.rect.h + ks.margin.h
          + (over ? Math.ceil((buttonArea - ks.margin.h * ks.unit) / ks.unit) : 0)
          + (node.children.length !== 0 ?
              node.children.map(c => c.self.h + ks.margin.h).reduce((a, b) => a + b) : 0);
      }
    } else {
      if (which === 'width') {
        // close, width
        return ks.rect.w;
      } else {
        // close, height
        return ks.rect.h + (over ? Math.ceil((buttonArea - ks.margin.h * ks.unit) / ks.unit) : 0);
      }
    }
  }

  static _setSize = <T extends KTreeNode>(node: T, ks: KSize): T => {

    const rect = {
      w: ks.rect.w,
      h: ks.rect.h
    };

    const children = node.children.length !== 0
      ? node.children.map(c => KTreeUtil._setSize(c, ks))
      : node.children;
    const newNode = {...node, children};

    const self = {
      w: KTreeUtil.calcSelfLength(newNode, ks, 'width'),
      h: KTreeUtil.calcSelfLength(newNode, ks, 'height')
    };

    return {...node, children, self, rect};
  }

  static _setPoint = <T extends KTreeNode>(point: Point, node: T, ks: KSize): T => {

    var anchor = (node.focus && ks.margin.h * ks.unit < buttonArea)
      ? Math.ceil((buttonArea - ks.margin.h * ks.unit) / ks.unit) : 0;
    const children = node.children.map(c => {
      const p: Point = {
        x: point.x + ks.indent,
        y: point.y + node.rect.h + ks.margin.h + anchor
      };
      const child = KTreeUtil._setPoint(p, c, ks);
      anchor += c.self.h + ks.margin.h;
      return child;
    });

    return {...node, point, children};
  }

  static _setIndexAndDepth = <T extends KTreeNode>(index: number, top: number, node: T): T => {

    if (!node.open || node.children.length === 0) {
      const depth = {top, bottom: 0};
      return {...node, index, depth};
    }

    const children = node.children.map((c, i) => (KTreeUtil._setIndexAndDepth(i, top + 1, c)));
    const bottom = children.map(c => c.depth.bottom).reduce((a, b) => a > b ? a : b) + 1;
    const depth = {top, bottom};

    return {...node, children, index, depth};
  }

  static setCalcProps = <T extends KTreeNode>(node: T, ks: KSize): T => {
    var kNode = KTreeUtil._setSize(node, ks);
    kNode = KTreeUtil._setPoint({x: ks.spr.w, y: ks.spr.h}, kNode, ks);
    kNode = KTreeUtil._setIndexAndDepth(0, 0, kNode);
    return kNode;
  }

  static makeBaseDragMap = <T extends KTreeNode>(node: T): DragRow[] => {
    const base: DragRow[]= [];
    for(var y = 0; y < node.point.y + node.self.h; y++) { base[y] = undefined; }
    return base;
  }

  static makeDragMap = <T extends KTreeNode>(nodes: T[], ks: KSize): DragRow[] => {
    const root = nodes[0];
    const sorted = nodes.sort((a, b) => a.depth.bottom < b.depth.bottom ? 1 : -1);

    const selfBase = KTreeUtil.makeBaseDragMap(root);

    const map: DragRow[][] = [selfBase].concat(sorted.map(s => {
      const result = KTreeUtil.makeBaseDragMap(s);

      if (s.open) {
        for(var y = s.point.y + s.self.h - ks.margin.h; y < s.point.y + s.self.h; y++) {
          result[y] = { node: s, action: 'moveInOut' };
        }
      }
      
      if (s.depth.top !== 0) {
        for(var y = s.point.y; y < s.point.y + s.rect.h; y++) {
          result[y] = { node: s, action: 'moveToBrother' };
        }
      }
      
      return result;
    }));

    return map.reduce((before, next) => before.map((beforeRow, r) => {
      if (next.length - 1 < r) { return beforeRow; }
      const nextRow = next[r];
      return nextRow || beforeRow;
    }))
  }

  static makeBaseDropMap = <T extends KTreeNode>(node: T): DropRow[] => {
    const base: DropRow[]= [];
    for(var y = 0; y < node.point.y + node.self.h; y++) { base[y] = undefined; }
    return base;
  }

  static makeDropMap = <T extends KTreeNode>(nodes: T[], ks: KSize): DropRow[] => {
    const root = nodes[0];
    const sorted = nodes.sort((a, b) => a.depth.bottom < b.depth.bottom ? 1 : -1);

    const selfBase = KTreeUtil.makeBaseDropMap(root);

    const beforeMarginHalf = Math.floor(ks.margin.h / 2);
    const beforeRectHalf = Math.floor(ks.rect.h / 2);

    const map: DropRow[][] = [selfBase].concat(sorted.map(s => {
      const result = KTreeUtil.makeBaseDropMap(s);

      if (s.depth.top !== 0) {
        for(var y = s.point.y - ks.margin.h; y < s.point.y + beforeRectHalf; y++) {
          result[y] = { node: s, action: 'insertBefore' };
        }
        for(var y = s.point.y + beforeRectHalf; y < s.point.y + ks.rect.h + beforeMarginHalf; y++) {
          result[y] = { node: s, action: 'insertNext' };
        }
      }

      if (s.open) {
        for(var y = s.point.y + s.self.h - ks.margin.h; y < s.point.y + s.self.h; y++) {
          result[y] = { node: s, action: 'insertLast' };
        }
      }
      
      return result;
    }));

    return map.reduce((before, next) => before.map((beforeRow, r) => {
      if (next.length - 1 < r) { return beforeRow; }
      const nextRow = next[r];
      return nextRow || beforeRow;
    }))
  }
  
  static isEqualRow = (a: DragRow | DropRow, b: DragRow | DropRow): boolean => {
    if (a === undefined && b === undefined) { return true; }
    if (a === undefined || b === undefined) { return false; }
    return a.action === b.action && a.node.id === b.node.id;
  }
}

export type which = 'width' | 'height';
export const buttonSize = 0; // 48;
export const buttonMargin = 0; // 4;
export const buttonArea = buttonSize + buttonMargin * 2;