import {KTreeNode, KWithArrow, Point } from "../data-types/tree-node";
import KSize from "../data-types/k-size";


export default class KArrowUtil {

  static get = (nodeSetCalcProps: KTreeNode, base: KWithArrow, ks: KSize): KWithArrow => {
    var nodeSetArrow = KArrowUtil._setArrowProps(nodeSetCalcProps, base);
    nodeSetArrow = KArrowUtil._setInArrowOfNotSwitch(nodeSetArrow, ks);
    nodeSetArrow = KArrowUtil._setInArrowOfSwitch(nodeSetArrow, ks);
    nodeSetArrow = KArrowUtil._setNextArrow(nodeSetArrow, ks);
    nodeSetArrow = KArrowUtil._setReturnArrow(nodeSetArrow, null, null, ks);
    return nodeSetArrow;
  }

  static _setArrowProps = (node: KTreeNode, base: KWithArrow): KWithArrow => {
    const children = node.children.map(c => KArrowUtil._setArrowProps(c, base));
    return {...base, ...node, children};
  }

  static _setInArrowOfNotSwitch = (node: KWithArrow, ks: KSize): KWithArrow => {
    const children = node.children.map(c => KArrowUtil._setInArrowOfNotSwitch(c, ks));
    if (node.type !== 'switch' && node.open && children.length !== 0) {
      const arrows: Point[][] = [[
        {x: ks.rect.w / 2 + ks.indent, y: ks.rect.h},
        {x: ks.rect.w / 2 + ks.indent, y: ks.rect.h + ks.margin.h - ks.pointerSpace}
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
    if (before.type === 'task') {
      const exitCenter = ks.rect.w / 2 - (node.point.x - before.point.x);
      if (exitCenter < 0) {
        return [[
          {x: ks.rect.w / 2, y: ks.rect.h},
          {x: ks.rect.w / 2, y: ks.rect.h + ks.spr.h},
          {x: exitCenter,    y: ks.rect.h + ks.spr.h},
          {x: exitCenter,    y: dv.y - ks.pointerSpace},
        ]];
      } else {
        return [[
          {x: exitCenter, y: ks.rect.h},
          {x: exitCenter, y: dv.y - ks.pointerSpace}
        ]];
      }
    } else {
      
      const beforeSelfX = before.self.w - (node.point.x - before.point.x) - ks.spr.w; 
      const secondPointX = beforeSelfX < ks.rect.w + ks.spr.w ? ks.rect.w + ks.spr.w : beforeSelfX;
      const margin = ks.margin.h === 1 ? 1 : 2;
      return [[
        {x: ks.rect.w, y: ks.rect.h / 2},
        {x: secondPointX, y: ks.rect.h / 2},
        {x: secondPointX, y: dv.y - ks.spr.h * margin},
        {x: ks.rect.w / 2 + dv.x, y: dv.y - ks.spr.h * margin},
        {x: ks.rect.w / 2 + dv.x, y: dv.y - ks.pointerSpace}
      ]];
    }
  }
}

export type which = 'width' | 'height';