import {TreeNode, Type, CheckNode, Point } from "../data-types/tree";
import { ks } from "../settings/layout";
import Util from "./util";
import { checked } from "../resource/svg-icon";
import { CheckListState } from "../pages/check-list/check-list";

export default class CheckNodeUtil {

  static get = (parentType: Type, node: TreeNode): CheckNode => {
    const rect = {
      w: ks.rect.w,
      h: ks.rect.h + (parentType === 'switch' ? ks.textline : 0),
    };

    return {
      ...node, parentType,
      index: 0,
      depth: {top: 0, bottom: 0},
      point: {x: 0, y: 0},
      open: true,
      focus: false,
      checked: false,
      skipped: false,
      children: node.children.map(c => CheckNodeUtil.get(node.type, c)),
      self: rect,
      rect
    };
  }

  static getInitialState = (point: Point, parent: TreeNode | null, node: TreeNode): CheckListState => {
    const parentType: Type = parent !== null ? parent.type : 'task';
    const newNode = CheckNodeUtil.get(parentType, node);
    const initNode = CheckNodeUtil.setCalcProps(point, newNode);

    return {
      node: initNode,
      nodeHistory: [initNode],
      focusNode: null,
      skipFlag: false,
      checkRecords: [],
    };
  }

  static openFirst = (point: Point, node: CheckNode): CheckNode => {
    const initNode = CheckNodeUtil._openFirst(node);
    return CheckNodeUtil.setCalcProps(point, initNode);
  }

  static _openFirst = (node: CheckNode): CheckNode => {
    if (node.children.length === 0) { return {...node, open: true, focus: true}; }
    if (node.type === 'task') {
      const children = node.children.map((c, i) => i === 0 ? CheckNodeUtil._openFirst(c) : c);
      return {...node, open: true, children};
    } else {
      const children = node.children.map(c => ({...c, focus: true, open: true}));
      return {...node, open: true, children};
    }
  }


  static equal = (a: TreeNode, b: TreeNode): boolean => a.id === b.id;

  static calcTextlineHeight = (node: CheckNode): number => {
    return (!Util.isEmpty(node.input)  ? ks.textline : 0)
         + (!Util.isEmpty(node.output) ? ks.textline : 0);
  }

  static calcSelfLength = (node: CheckNode, open: boolean, which: which) => {

    if (node.type !== 'switch') {
      if (open) {
        if (which === 'width') {
          // task, open, width
          if (node.children.length !== 0) {
            const childrenLength = node.children.map(c => c.self.w).reduce((a, b) => Math.max(a, b));
            return ks.indent + ks.spr.w + childrenLength;
          } else {
            return ks.rect.w;
          }
        } else {
          // task, open, height
          if (node.children.length !== 0) {
            return ks.rect.h + ks.spr.h
              + CheckNodeUtil.calcTextlineHeight(node)
              + node.children.map(c => c.self.h + ks.spr.h).reduce((a, b) => a + b);
          } else {
            return ks.rect.h
              + CheckNodeUtil.calcTextlineHeight(node);
          }
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
    } else {
      if (open) {
        if (which === 'width') {
          // switch, open, width
          if (node.children.length !== 0) {
            return ks.indent
              + node.children.map(c => c.self.w + ks.spr.w).reduce((a, b) => a + b);
          } else {
            return ks.rect.w;
          }
        } else {
          // switch, open, height
          if (node.children.length !== 0) {
            return ks.rect.h + ks.spr.h * 2
              + CheckNodeUtil.calcTextlineHeight(node)
              + node.children.map(c => c.self.h).reduce((a, b) => Math.max(a, b));
          } else {
            return ks.rect.h
              + CheckNodeUtil.calcTextlineHeight(node);
          }
        }
      } else {
        if (which === 'width') {
          // task, close, width
          const checkedChild = node.children.find(c => c.checked);
          if (checkedChild === undefined) { return ks.rect.w; }
          return ks.indent + ks.spr.w + checkedChild.self.w;
        } else {
          // task, close, height
          const checkedChild = node.children.find(c => c.checked);
          if (checkedChild === undefined) { return ks.rect.h; }
          return ks.rect.h + ks.spr.h * 2 + checkedChild.self.h;
        }
      }
    }
  }
  static open = (point: Point, node: CheckNode, id: string, open: boolean): CheckNode => {
    const openNode = CheckNodeUtil._open(node, id, open);
    return CheckNodeUtil.setCalcProps(point, openNode);
  }

  static _open = (node: CheckNode, id: string, open: boolean): CheckNode => {
    if (node.id === id) { return {...node, open}; }
    const children = node.children.map(c => (CheckNodeUtil._open(c, id, open)));
    return {...node, children};
  }

  static focus = (node: CheckNode, id: string): CheckNode => {
    const deletedFocusNode = CheckNodeUtil._deleteFocus(node);
    const focusNode = CheckNodeUtil._focus(deletedFocusNode, id);
    return focusNode;
  }

  static _deleteFocus = (node: CheckNode): CheckNode => {
    if (node.focus === true) { return {...node, focus: false}; }
    const children = node.children.map(c => (CheckNodeUtil._deleteFocus(c)));
    return {...node, children};
  }

  static _focus = (node: CheckNode, id: string): CheckNode => {
    if (node.id === id) { return {...node, focus: true}; }
    const children = node.children.map(c => (CheckNodeUtil._focus(c, id)));
    return {...node, children};
  }

  static check = (point: Point, node: CheckNode): CheckNode => {
    const checkNode = CheckNodeUtil._check(node);
    return CheckNodeUtil.setCalcProps(point, checkNode);
  }

  static _check = (node: CheckNode): CheckNode => {
    if ((node.type !== 'case' && (node.checked || node.skipped)) || node.children.length === 0) {
      return node;
    }

    if (node.children.find(c => c.focus) === undefined) {
      const children = node.children.map(c => CheckNodeUtil._check(c));
      const hasFocus = children.map(c => CheckNodeUtil._hasFocus(c)).reduce((a, b) => a || b);
      if (hasFocus) { return {...node, children}; }
      if (node.type === 'switch') {
        const hasCheck = children.map(c => c.checked).reduce((a, b) => a || b);
        if (hasCheck) { return {...node, children, checked: true, open: false}; }
      }
      const isAllChecked = children.map(c => c.checked || c.skipped).reduce((a, b) => a && b);
      if (isAllChecked) {
        return {...node, children, checked: true};
      }
      
      const setFocusChildren = children.map(
        (c, i, _children) =>
          i !== 0 &&
          (_children[i - 1].checked || _children[i - 1].skipped) &&
          (!c.checked && !c.skipped)
            ? CheckNodeUtil._openFirst(c)
            : c
      );
      return {...node, children: setFocusChildren};
    }

    const children: CheckNode[] = node.children.map(
      (c, i, _children) =>
      c.focus ? {...c, focus: false, checked: true} : 
      i !== 0 && _children[i - 1].focus ? CheckNodeUtil._openFirst(c) : c
    );
    const hasFocus = children.map(c => CheckNodeUtil._hasFocus(c)).reduce((a, b) => a || b);
    if (hasFocus) { return {...node, children}; }
    return {...node, children, checked: true};
  }

  static skip = (point: Point, node: CheckNode): CheckNode => {
    const checkNode = CheckNodeUtil._skip(node);
    return CheckNodeUtil.setCalcProps(point, checkNode);
  }

  static _skip = (node: CheckNode): CheckNode => {
    if ((node.type !== 'case' && (node.checked || node.skipped)) || node.children.length === 0) {
      return node;
    }

    if (node.children.find(c => c.focus) === undefined) {
      const children = node.children.map(c => CheckNodeUtil._skip(c));
      const hasFocus = children.map(c => CheckNodeUtil._hasFocus(c)).reduce((a, b) => a || b);
      if (hasFocus) { return {...node, children}; }
      if (node.type === 'switch') {
        const hasCheck = children.map(c => c.checked).reduce((a, b) => a || b);
        if (hasCheck) {
          const caseChildren = children.find(c => c.checked)!.children;
          const isAllSkipped = caseChildren.map(c => c.skipped).reduce((a, b) => a && b);
          if (isAllSkipped) {
            const clearCheckChildren = children.map(c => ({...c, checked: false, skipped: true}))
            return {...node, children: clearCheckChildren, skipped: true, open: false};
          } else {
            return {...node, children, checked: true, open: false};
          }
        }
      }
      const setFocusChildren = children.map(
        (c, i, _children) =>
          i !== 0 &&
          (_children[i - 1].checked || _children[i - 1].skipped) &&
          (!c.checked && !c.skipped)
            ? CheckNodeUtil._openFirst(c)
            : c
      );
      return {...node, children: setFocusChildren};
    }
    if (node.type === 'switch') {
      const children = node.children.map(c => ({...c, focus: false, skipped: true}));
      return {...node, children, skipped: true, open: false};
    }

    const children: CheckNode[] = node.children.map(
      (c, i, _children) =>
        c.focus ? {...c, focus: false, skipped: true} : 
        i !== 0 && _children[i - 1].focus ? CheckNodeUtil._openFirst(c) : c
    );
    const hasFocus = children.map(c => CheckNodeUtil._hasFocus(c)).reduce((a, b) => a || b);
    if (hasFocus) { return {...node, children}; }
    const isAllSkipped = children.map(c => c.skipped).reduce((a, b) => a && b);
    if (isAllSkipped) {
      return {...node, children, skipped: true, open: false};
    } else {
      return {...node, children, checked: true};
    }
  }

  static select = (point: Point, node: CheckNode, target: CheckNode): CheckNode => {
    const checkNode = CheckNodeUtil._select(node, target);
    return CheckNodeUtil.setCalcProps(point, checkNode);
  }

  static _select = (node: CheckNode, target: CheckNode): CheckNode => {
    if (node.checked) { return node; }

    if (node.children.find(c => c.id === target.id) === undefined) {
      const children = node.children.map(c => CheckNodeUtil._select(c, target));
      return {...node, children};
    }

    const children: CheckNode[] = node.children.map(
      c => {
        const _children: CheckNode[] = c.children
        .map((_c, i) => i === 0 ? CheckNodeUtil._openFirst(_c) : _c);

        return c.id === target.id
          ? {...c, focus: false, checked: true, open: true, children: _children}
          : {...c, focus: false};
      }
    );
    return {...node, children, open: false};
  }

  static _hasFocus = (node: CheckNode): boolean => {
    if (node.focus) { return true; }
    if (node.children.length === 0) { return false; }
    return node.children.map(c => CheckNodeUtil._hasFocus(c))
    .reduce((a, b) => a || b);
  }

  static _setSize = (node: CheckNode): CheckNode => {

    const rect = {
      w: ks.rect.w,
      h: ks.rect.h
        + (node.open ? CheckNodeUtil.calcTextlineHeight(node) : 0)
    };

    const children = node.children.map(c => (CheckNodeUtil._setSize(c)));
    const newNode = {...node, children};

    const self = {
      w: CheckNodeUtil.calcSelfLength(newNode, node.open, 'width'),
      h: CheckNodeUtil.calcSelfLength(newNode, node.open, 'height')
    };

    return {...node, children, self, rect};
  }

  static _setPoint = (point: Point, node: CheckNode): CheckNode => {

    var anchor = 0;
    const children = node.children.map(c => {
      const p: Point = (node.type === 'switch' && c.checked)
      ? {
        x: point.x + ks.indent,
        y: point.y + node.rect.h + ks.spr.h
      } : {
        x: point.x + ks.indent + (node.type !== 'switch' ? 0 : anchor),
        y: point.y + node.rect.h + ks.spr.h + (node.type === 'switch' ? 0 : anchor)
      };
      const child = CheckNodeUtil._setPoint(p, c);
      anchor += node.type !== 'switch' ? c.self.h + ks.spr.h : c.self.w + ks.spr.w;
      return child;
    });

    return {...node, point, children};
  }

  static _setIndexAndDepth = (index: number, top: number, node: CheckNode): CheckNode=> {

    if (!node.open || node.children.length === 0) {
      const depth = {top, bottom: 0};
      return {...node, index, depth};
    }

    const children = node.children.map((c, i) => (CheckNodeUtil._setIndexAndDepth(i, top + 1, c)));
    const bottom = children.map(c => c.depth.bottom).reduce((a, b) => a > b ? a : b) + 1;
    const depth = {top, bottom};

    return {...node, children, index, depth};
  }

  static setCalcProps = (point: Point, node: CheckNode) => {
    const setSizeNode = CheckNodeUtil._setSize(node);
    const setPointNode = CheckNodeUtil._setPoint(point, setSizeNode);
    const setDepthNode = CheckNodeUtil._setIndexAndDepth(0, 0, setPointNode);
    return setDepthNode;
  }

  static toFlat = (node: CheckNode): CheckNode[] => {
    if (node.children.length === 0 || !node.open) {
      if (node.type !== 'switch') {
        return [node];
      } else {
        const checkedCase = node.children.find(c => c.checked);
        if (checkedCase === undefined) { return [node]; }
        return [node].concat(CheckNodeUtil.toFlat(checkedCase));
      }
    }
    return [node].concat(node.children.map(c => CheckNodeUtil.toFlat(c)).reduce((a, b) => a.concat(b)));
  }

  // Treeから指定した要素を返す
  static _find = (node: CheckNode, id: string): CheckNode | undefined => {
    if (node.id === id) { return node; }
    if (node.children.length === 0) { return undefined; }
    return node.children.map(c => CheckNodeUtil._find(c, id))
    .reduce((a, b) => a !== undefined ? a
                    : b !== undefined ? b : undefined);
  }

  static _getFocusNode = (node: CheckNode): CheckNode | null => {
    if (node.focus) { return node; }
    if (node.children.length === 0) { return null; }
    return node.children.map(c => CheckNodeUtil._getFocusNode(c))
    .reduce((a, b) => a !== null ? a
                    : b !== null ? b : null);
  }
}

export type which = 'width' | 'height';