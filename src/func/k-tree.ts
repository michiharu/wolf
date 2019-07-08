import {KTreeNode, DragRow, Point, DropRow } from "../data-types/tree";
import KSize from "../data-types/k-size";

export default class KTreeUtil {

  static calcSelfLength = (node: KTreeNode, ks: KSize, which: which) => {
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
          + (node.children.length !== 0 ?
              node.children.map(c => c.self.h + ks.margin.h).reduce((a, b) => a + b) : 0);
      }
    } else {
      if (which === 'width') {
        // close, width
        return ks.rect.w;
      } else {
        // close, height
        return ks.rect.h;
      }
    }
  }

  static _setSize = <T extends KTreeNode>(node: T, ks: KSize, showDraft: boolean): T => {

    const rect = {
      w: ks.rect.w,
      h: ks.rect.h
    };

    const children = node.children.length !== 0
      ? node.children
        .filter(c => showDraft || !c.isDraft)
        .map(c => KTreeUtil._setSize(c, ks, showDraft))
      : [];
    const newNode = {...node, children};

    const self = {
      w: KTreeUtil.calcSelfLength(newNode, ks, 'width'),
      h: KTreeUtil.calcSelfLength(newNode, ks, 'height')
    };

    return {...node, children, self, rect};
  }

  static _setPoint = <T extends KTreeNode>(node: T, ks: KSize, isRoot: boolean, showDraft: boolean, point: Point = {x: ks.spr.w * 3, y: ks.spr.h}): T => {

    var anchor = 0;
    const children = node.children
    .filter(c => showDraft || !c.isDraft)
    .map(c => {
      const p: Point = {
        x: isRoot ? point.x : point.x + ks.indent,
        y: isRoot ? point.y + anchor : point.y + node.rect.h + ks.margin.h + anchor
      };
      const child = KTreeUtil._setPoint(c, ks, false, showDraft, p);
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

  static setCalcProps = <T extends KTreeNode>(node: T, ks: KSize, showDraft: boolean): T => {
    var kNode = KTreeUtil._setSize(node, ks, showDraft);
    kNode = KTreeUtil._setPoint(kNode, ks, true, showDraft);
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

      if (s.open && s.depth.top !== 0) {
        (() => {
          for(var y = s.point.y + s.self.h - ks.margin.h; y < s.point.y + s.self.h; y++) {
            result[y] = { node: s, action: 'moveInOut' };
          }
        })();
      }
      
      if (s.depth.top !== 0) {
        (() => {
          for(var y = s.point.y; y < s.point.y + s.rect.h; y++) {
            result[y] = { node: s, action: 'moveToBrother' };
          }
        })();
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
        (() => {
          for(var y = s.point.y - ks.margin.h; y < s.point.y + beforeRectHalf; y++) {
            result[y] = { node: s, action: 'insertBefore' };
          }
        })();
        (() => {
          for(var y = s.point.y + beforeRectHalf; y < s.point.y + ks.rect.h + beforeMarginHalf; y++) {
            result[y] = { node: s, action: 'insertNext' };
          }
        })();
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