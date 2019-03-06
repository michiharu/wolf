import TreeNode, { TreeViewNode, Type } from "../data-types/tree-node";
import { viewItem } from "../settings/layout";

export default class TreeViewUtil {

  static getViewNode = (parentType: Type, node: TreeNode): TreeViewNode => {
    const children = node.children.map(c => TreeViewUtil.getViewNode(node.type, c));
    return {
      ...node,
      open: false,
      width: viewItem.rect.w,
      height: parentType === 'task' ? viewItem.rect.h : viewItem.rectHasIf.h,
      children
    };
  }

  static equal = (a: TreeViewNode, b: TreeViewNode): boolean => a.id === b.id;

  static calcLength = (parentType: Type, node: TreeViewNode, open: boolean, which: which) => {

    if (node.type === 'task') {
      if (open) {
        if (which === 'width') {
          // task, open, width
          return viewItem.indent + viewItem.spr.w
            + node.children.map(c => c.width).reduce((a, b) => Math.max(a, b));
        } else {
          // task, open, height
          return (parentType === 'task' ? viewItem.rect.h : viewItem.rectHasIf.h) + viewItem.spr.h
            + node.children.map(c => c.height + viewItem.spr.h).reduce((a, b) => a + b);
        }
      } else {
        if (which === 'width') {
          // task, close, width
          return viewItem.rect.w;
        } else {
          // task, close, height
          return parentType === 'task' ? viewItem.rect.h : viewItem.rectHasIf.h;
        }
      }
    } else {
      if (open) {
        if (which === 'width') {
          // switch, open, width
          return viewItem.indent
          + node.children.map(c => c.width + viewItem.spr.w).reduce((a, b) => a + b);
        } else {
          // switch, open, height
          return (parentType === 'task' ? viewItem.rect.h : viewItem.rectHasIf.h) + viewItem.spr.h * 2
          + node.children.map(c => c.height).reduce((a, b) => Math.max(a, b));
        }
      } else {
        if (which === 'width') {
          // task, close, width
          return viewItem.rect.w;
        } else {
          // task, close, height
          return parentType === 'task' ? viewItem.rect.h : viewItem.rectHasIf.h;
        }
      }
    }
  }

  static open = (parentType: Type, node: TreeViewNode, id: string, open: boolean): TreeViewNode => {
    if (node.id === id) {
      return {
        ...node,
        open,
        width:  TreeViewUtil.calcLength(parentType, node, open, 'width'),
        height: TreeViewUtil.calcLength(parentType, node, open, 'height'),
      };
    }
    const children = node.children.map(c => TreeViewUtil.open(node.type, c, id, open));
    const newNode = {...node, children};
    const width =  TreeViewUtil.calcLength(parentType, newNode, node.open, 'width');
    const height = TreeViewUtil.calcLength(parentType, newNode, node.open, 'height');

    return {...node, children, width, height};
  }
}

export type which = 'width' | 'height';