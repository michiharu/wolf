import {TreeNode, Type, KTreeNode, Cell, Tree, Point } from "../data-types/tree-node";
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
    kNode = KTreeUtil._setPoint({x: 0, y: 0}, kNode, ks);
    kNode = KTreeUtil._setIndexAndDepth(0, 0, kNode);
    return kNode;
  }

  static makeBaseMap = <T extends KTreeNode>(node: T): Cell[][] => {
    const base: Cell[][] = [];
    for(var x = 0; x < node.point.x + node.self.w; x++) {
      base[x] = [];
      for(var y = 0; y < node.point.y + node.self.h; y++) {
        base[x][y] = undefined;
      }
    }
    return base;
  }

  static makeMap = <T extends KTreeNode>(nodes: T[], ks: KSize): Cell[][] => {
    const root = nodes[0];
    const sorted = nodes.sort((a, b) => a.depth.bottom < b.depth.bottom ? 1 : -1);

    const selfBase = KTreeUtil.makeBaseMap(root);

    const map: Cell[][][] = [selfBase].concat(sorted.map(s => {
      const result = KTreeUtil.makeBaseMap(s);

      if (s.open) {
        for(var x = s.point.x + ks.spr.w; x < s.point.x + s.self.w; x++) {
          if (x < 0) { continue; }
          result[x][s.point.y + s.self.h - 1] = { node: s, action: 'push' };
        }
      }

      for(var x = s.point.x; x < s.point.x + s.rect.w; x++) {
        if (x < 0) { continue; }
        for(var y = s.point.y; y < s.point.y + s.rect.h; y++) {
          result[x][y] = { node: s, action: 'none'};
        }
      }
      
      if (s.depth.top !== 0) {
        for(var x = s.point.x; x < s.point.x + s.rect.w; x++) {
          if (x < 0) { continue; }
          for(var y = s.point.y - ks.spr.h; y < s.point.y; y++) {
            result[x][y] = { node: s, action: 'move' };
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
}

export type which = 'width' | 'height';
export const buttonSize = 0; // 48;
export const buttonMargin = 0; // 4;
export const buttonArea = buttonSize + buttonMargin * 2;