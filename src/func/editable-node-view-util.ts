import { EditableNode, Point, Cell } from "../data-types/tree-node";
import { ks } from "../settings/layout";
import KSize from "../data-types/k-size";

export default class EditableNodeViewUtil {

  static calcSelfLength = (node: EditableNode, ks: KSize, open: boolean, which: which) => {
    if (open) {
      if (which === 'width') {
        // task, open, width
        const childrenLength = node.children.length !== 0
          ? node.children.map(c => c.self.w).reduce((a, b) => Math.max(a, b))
          : ks.rect.w;
        return ks.indent + ks.spr.w + childrenLength;
      } else {
        // task, open, height
        return ks.rect.h + ks.spr.h
          + (node.children.length !== 0 ?
              node.children.map(c => c.self.h + ks.spr.h).reduce((a, b) => a + b) : 0);
      }
    } else {
      if (which === 'width') {
        // task, close, width
        return ks.rect.w;
      } else {
        // task, close, height
        return ks.rect.h;
      }
    }
  }

  static _setSize = (node: EditableNode, ks: KSize): EditableNode => {

    const rect = {
      w: ks.rect.w,
      h: ks.rect.h
    };

    const children = node.children.map(c => (EditableNodeViewUtil._setSize(c, ks)));
    const newNode = {...node, children};

    const self = {
      w: EditableNodeViewUtil.calcSelfLength(newNode, ks, node.open, 'width'),
      h: EditableNodeViewUtil.calcSelfLength(newNode, ks, node.open, 'height')
    };

    return {...node, children, self, rect};
  }

  static _setPoint = (point: Point, node: EditableNode): EditableNode => {

    var anchor = 0;
    const children = node.children.map(c => {
      const p: Point = {
        x: point.x + ks.indent,
        y: point.y + node.rect.h + ks.spr.h + anchor
      };
      const child = EditableNodeViewUtil._setPoint(p, c);
      anchor += c.self.h + ks.spr.h;
      return child;
    });

    return {...node, point, children};
  }

  static _setIndexAndDepth = (index: number, top: number, node: EditableNode): EditableNode=> {

    if (!node.open || node.children.length === 0) {
      const depth = {top, bottom: 0};
      return {...node, index, depth};
    }

    const children = node.children.map((c, i) => (EditableNodeViewUtil._setIndexAndDepth(i, top + 1, c)));
    const bottom = children.map(c => c.depth.bottom).reduce((a, b) => a > b ? a : b) + 1;
    const depth = {top, bottom};

    return {...node, children, index, depth};
  }

  static setCalcProps = (node: EditableNode, ks: KSize) => {
    const setSizeNode = EditableNodeViewUtil._setSize(node, ks);
    const setPointNode = EditableNodeViewUtil._setPoint({x: 0, y: 0}, setSizeNode);
    const setDepthNode = EditableNodeViewUtil._setIndexAndDepth(0, 0, setPointNode);
    return setDepthNode;
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

    const selfBase = EditableNodeViewUtil.makeBaseMap(root);

    const map: Cell[][][] = [selfBase].concat(sorted.map(s => {
      const result = EditableNodeViewUtil.makeBaseMap(s);

      if (s.open) {
        for(var x = s.point.x + ks.spr.w; x < s.point.x + s.self.w; x++) {
          if (x < 0) { continue; }
          for(var y = s.point.y + ks.spr.h; y < s.point.y + s.self.h; y++) {
            result[x][y] = { node: s, action: 'push' };
          }
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