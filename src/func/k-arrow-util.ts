import {KTreeNode, KWithArrow, Point } from "../data-types/tree-node";
import KSize from "../data-types/k-size";


export default class KArrowUtil {

  static _getArrowCheck = (node: KWithArrow): any => {
    const children = node.children.map(c => KArrowUtil._getArrowCheck(c));
    return {label: node.label, arrows: node.arrows, children: children};
  }

  static get = (nodeSetCalcProps: KTreeNode, base: KWithArrow, ks: KSize): KWithArrow => {
    var nodeSetArrow = KArrowUtil._setArrowProps(nodeSetCalcProps, base);
    nodeSetArrow = KArrowUtil._setInArrowOfTask(nodeSetArrow, ks);
    nodeSetArrow = KArrowUtil._setInArrowOfCase(nodeSetArrow, ks);
    nodeSetArrow = KArrowUtil._setInArrowOfSwitch(nodeSetArrow, ks);
    nodeSetArrow = KArrowUtil._setNextArrow(nodeSetArrow, ks);
    nodeSetArrow = KArrowUtil._setReturnArrow(nodeSetArrow, null, null, ks);
    return nodeSetArrow;
  }

  static _setArrowProps = (node: KTreeNode, base: KWithArrow): KWithArrow => {
    const children = node.children.map(c => KArrowUtil._setArrowProps(c, base));
    return {...base, ...node, children};
  }

  static _setInArrowOfTask = (node: KWithArrow, ks: KSize): KWithArrow => {
    const children = node.children.map(c => KArrowUtil._setInArrowOfTask(c, ks));
    if (node.type === 'task' && node.open && children.length !== 0) {
      const arrows: Point[][] = [[
        {x: (ks.rect.w + ks.indent) / 2, y: ks.rect.h},
        {x: (ks.rect.w + ks.indent) / 2, y: ks.rect.h + ks.margin.h - ks.pointerSpace}
      ]];
      return {...node, children, arrows};
    }
    return {...node, children};
  }

  static _setInArrowOfCase = (node: KWithArrow, ks: KSize): KWithArrow => {
    const children = node.children.map(c => KArrowUtil._setInArrowOfCase(c, ks));
    if (node.type === 'case' && node.open && children.length !== 0) {
      const arrows: Point[][] = [[
        {x: (ks.rect.w + ks.indent) / 2, y: ks.rect.h},
        {x: (ks.rect.w + ks.indent) / 2, y: ks.rect.h + ks.margin.h - ks.pointerSpace}
      ]];
      return {...node, children, arrows};
    }
    return {...node, children};
  }

  static _setInArrowOfSwitch = (node: KWithArrow, ks: KSize): KWithArrow => {
    const children = node.children.map(c => KArrowUtil._setInArrowOfSwitch(c, ks));
    if (node.open && node.type === 'switch' && children.length !== 0) {
      var anchor = ks.rect.h + ks.margin.h + ks.rect.h * 0.5;
      const arrows: Point[][] = children.map((c, i) => {
        const points = [
          {x: (ks.indent - ks.pointerSpace) / 2, y: ks.rect.h},
          {x: (ks.indent - ks.pointerSpace) / 2, y: anchor},
          {x: (ks.indent - ks.pointerSpace),     y: anchor},
        ];
        anchor += c.self.h + ks.margin.h;
        return points;
      });
      return {...node, children, arrows};
    }
    return {...node, children};
  }

  static _setNextArrow = (node: KWithArrow, ks: KSize): KWithArrow => {
    const children = node.children.map((c, i) => {
      if (c.open && c.children.length !== 0) {
        return KArrowUtil._setNextArrow(c, ks);
      } else {
        if (c.type !== 'case' && node.children.length - 1 !== i) {
          const arrows: Point[][] = [[
            {x: ks.rect.w / 2, y: ks.rect.h},
            {x: ks.rect.w / 2, y: ks.rect.h + ks.margin.h - ks.pointerSpace}
          ]];
          return {...c, arrows};
        } else {
          return c;
        }
      }
    });
    return {...node, children};
  }

  static _setReturnArrow = (node: KWithArrow, before: KWithArrow | null, exit: KWithArrow | null, ks: KSize): KWithArrow => {
    if (node.open && node.children.length !== 0) {
      const children = node.children.map((c, i, _children) => {
        const isLastChildren = _children.length - 1 === i;
        if (!isLastChildren) {
          if (c.children.length !== 0) {
            return node.type !== 'switch'
              ? KArrowUtil._setReturnArrow(c, c, _children[i + 1], ks)
              : KArrowUtil._setReturnArrow(c, before, exit, ks);
          } else {
            return  c;
          }
        } else {
          if (c.open && c.children.length !== 0) {
            return KArrowUtil._setReturnArrow(c, before, exit, ks)
          } else {
            if (exit !== null) {
              return {...c, arrows: KArrowUtil.getArrowPoints(c, before!, exit, ks)};
            } else {
              return c;
            }
          }
        }
      });
      return {...node, children};
    }
    if (!node.open && node.type === 'case' && exit !== null) {
      return {...node, arrows: KArrowUtil.getArrowPoints(node, before!, exit, ks)};
    }

    return node;
  }

  static getArrowPoints = (node: KWithArrow, before: KWithArrow, exit: KWithArrow, ks: KSize): Point[][] => {
    const dv: Point = {x: exit.point.x - node.point.x, y: exit.point.y - node.point.y};
    const beforeSelfRightX = before.self.w - (node.point.x - before.point.x); 
    return [[
      {x: ks.rect.w, y: ks.rect.h / 2},
      {x: beforeSelfRightX, y: ks.rect.h / 2},
      {x: beforeSelfRightX, y: dv.y - ks.spr.h * 2},
      {x: ks.rect.w / 2 + dv.x, y: dv.y - ks.spr.h * 2},
      {x: ks.rect.w / 2 + dv.x, y: dv.y - ks.pointerSpace}
    ]];
  }
}

export type which = 'width' | 'height';