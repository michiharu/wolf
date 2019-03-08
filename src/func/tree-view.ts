import TreeNode, { TreeViewNode, Type } from "../data-types/tree-node";
import { viewItem } from "../settings/layout";
import Util from "./util";

export default class TreeViewUtil {

  static getViewNode = (parentType: Type, node: TreeNode): TreeViewNode => {
    const children = node.children.map(c => TreeViewUtil.getViewNode(node.type, c));
    return {
      ...node,
      open: false,
      width: viewItem.rect.w,
      height: viewItem.rect.h + (parentType === 'switch' ? viewItem.textline : 0),
      rect: {
        w: viewItem.rect.w,
        h: viewItem.rect.h + (parentType === 'switch' ? viewItem.textline : 0),
      },
      children
    };
  }

  static equal = (a: TreeViewNode, b: TreeViewNode): boolean => a.id === b.id;

  static calcTextlineHeight = (node: TreeViewNode): number => {
    return (!Util.isEmpty(node.input)  ? viewItem.textline : 0)
         + (!Util.isEmpty(node.output) ? viewItem.textline : 0);
  }

  static calcLength = (parentType: Type, node: TreeViewNode, open: boolean, which: which) => {

    if (node.type === 'task') {
      if (open) {
        if (which === 'width') {
          // task, open, width
          return viewItem.indent + viewItem.spr.w
            + (node.children.length !== 0 ?
              node.children.map(c => c.width).reduce((a, b) => Math.max(a, b)) : 0);
        } else {
          // task, open, height
          return viewItem.rect.h + viewItem.spr.h
            + (parentType === 'switch' ? viewItem.textline : 0)
            + TreeViewUtil.calcTextlineHeight(node)
            + (node.children.length !== 0 ?
               node.children.map(c => c.height + viewItem.spr.h).reduce((a, b) => a + b) : 0);
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
             node.children.map(c => c.width + viewItem.spr.w).reduce((a, b) => a + b) : 0);
        } else {
          // switch, open, height
          return viewItem.rect.h + viewItem.spr.h * 2
            + (parentType === 'switch' ? viewItem.textline : 0)
            + TreeViewUtil.calcTextlineHeight(node)
            + (node.children.length !== 0 ? 
               node.children.map(c => c.height).reduce((a, b) => Math.max(a, b)) : 0);
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

  static open = (parentType: Type, node: TreeViewNode, id: string, open: boolean): TreeViewNode => {
    if (node.id === id) {
      return {
        ...node,
        open,
        width:  TreeViewUtil.calcLength(parentType, node, open, 'width'),
        height: TreeViewUtil.calcLength(parentType, node, open, 'height'),
        rect: {
          w: viewItem.rect.w,
          h: viewItem.rect.h
            + (parentType === 'switch' ? viewItem.textline : 0)
            + (open ? TreeViewUtil.calcTextlineHeight(node) : 0)
        }
      };
    }
    const children = node.children.map(c => TreeViewUtil.open(node.type, c, id, open));
    const newNode = {...node, children};
    const width =  TreeViewUtil.calcLength(parentType, newNode, node.open, 'width');
    const height = TreeViewUtil.calcLength(parentType, newNode, node.open, 'height');
    const rect = {
      w: viewItem.rect.w,
      h: viewItem.rect.h
        + (parentType === 'switch' ? viewItem.textline : 0)
        + (node.open ? TreeViewUtil.calcTextlineHeight(node) : 0)
    };

    return {...node, children, width, height, rect};
  }
}

export type which = 'width' | 'height';