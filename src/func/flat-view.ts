import TreeNode, { TreeViewNode, Type, FlatNode, Point } from "../data-types/tree-node";
import { viewItem } from "../settings/layout";
import Util from "./util";

export default class FlatUtil {

  static getViewNode = (parentType: Type, node: TreeNode): FlatNode => {
    const children = node.children.map(c => FlatUtil.getViewNode(node.type, c));
    const rect = {
      w: viewItem.rect.w,
      h: viewItem.rect.h + (parentType === 'switch' ? viewItem.textline : 0),
    };

    return {...node, parentType, point: {x: 0, y: 0}, open: false, children, self: rect, rect};
  }

  static equal = (a: TreeNode, b: TreeNode): boolean => a.id === b.id;

  static calcTextlineHeight = (node: TreeNode): number => {
    return (!Util.isEmpty(node.input)  ? viewItem.textline : 0)
         + (!Util.isEmpty(node.output) ? viewItem.textline : 0);
  }

  static calcLength = (parentType: Type, node: FlatNode, open: boolean, which: which) => {

    if (node.type === 'task') {
      if (open) {
        if (which === 'width') {
          // task, open, width
          return viewItem.indent + viewItem.spr.w
            + (node.children.length !== 0 ?
              node.children.map(c => c.self.w).reduce((a, b) => Math.max(a, b)) : 0);
        } else {
          // task, open, height
          return viewItem.rect.h + viewItem.spr.h
            + (parentType === 'switch' ? viewItem.textline : 0)
            + FlatUtil.calcTextlineHeight(node)
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
          return viewItem.indent
          + (node.children.length !== 0 ?
             node.children.map(c => c.self.w + viewItem.spr.w).reduce((a, b) => a + b) : 0);
        } else {
          // switch, open, height
          return viewItem.rect.h + viewItem.spr.h * 2
            + (parentType === 'switch' ? viewItem.textline : 0)
            + FlatUtil.calcTextlineHeight(node)
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

  static openAndSetSize = (node: FlatNode, id: string, open: boolean): FlatNode => {
    const selfOpen = node.id === id ? open : node.open;

    const rect = {
      w: viewItem.rect.w,
      h: viewItem.rect.h
        + (node.parentType === 'switch' ? viewItem.textline : 0)
        + (selfOpen ? FlatUtil.calcTextlineHeight(node) : 0)
    };

    const children = node.children.map(c => (FlatUtil.openAndSetSize(c, id, open)));
    const newNode = {...node, children};

    const self = {
      w: FlatUtil.calcLength(node.parentType, newNode, selfOpen, 'width'),
      h: FlatUtil.calcLength(node.parentType, newNode, selfOpen, 'height')
    };

    return {...node, open: selfOpen, children, self, rect};
  }

  static setPoint = (point: Point, node: FlatNode): FlatNode => {

    var anchor = 0;
    const children = node.children.map(c => {
      const p: Point = {
        x: point.x + viewItem.indent + (node.type === 'task' ? 0 : anchor),
        y: point.y + node.rect.h + viewItem.spr.h + (node.type === 'switch' ? 0 : anchor)
      };
      const child = FlatUtil.setPoint(p, c);
      anchor += node.type === 'task' ? c.self.h + viewItem.spr.h : c.self.w + viewItem.spr.w;
      return child;
    });

    return {...node, point, children};
  }

  static open = (point: Point, node: FlatNode, id: string, open: boolean) => 
    FlatUtil.setPoint(point, FlatUtil.openAndSetSize(node, id, open));

  static toFlat = (node: FlatNode): FlatNode[] => {
    if (node.children.length === 0 || !node.open) { return [node]; }
    return [node].concat(node.children.map(c => FlatUtil.toFlat(c)).reduce((a, b) => a.concat(b)));
  }
}

export type which = 'width' | 'height';