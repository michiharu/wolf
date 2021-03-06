import { KWithArrow, Point, isSwitch, isCase, isTask } from "../data-types/tree";
import KSize from "../data-types/k-size";

export default class KArrowUtil {

  static setArrow = <T extends KWithArrow>(node: T, ks: KSize): T => {
    var kArrow = KArrowUtil._resetArrow(node);
    kArrow = KArrowUtil._setInArrowOfNotSwitch(kArrow, ks);
    kArrow = KArrowUtil._setInArrowOfSwitch(kArrow, ks);
    kArrow = KArrowUtil._setNextArrow(kArrow, ks);
    kArrow = KArrowUtil._setReturnArrow(kArrow, null, null, ks);
    return kArrow;
  }

  static _resetArrow = <T extends KWithArrow>(node: T): T => {
    const children = node.children.map(c => KArrowUtil._resetArrow(c));
    return {...node, children, arrows: []};
  }

  // InArrow は親要素から子要素への矢印
  // NotSwitchのとき矢印は「↓」
  static _setInArrowOfNotSwitch = <T extends KWithArrow>(node: T, ks: KSize): T => {
    const children = node.children.map(c => KArrowUtil._setInArrowOfNotSwitch(c, ks));
    if (!isSwitch(node.type) && (node.open && children.length !== 0)) {
      const arrows: Point[][] = [[
        {x: ks.rect.w / 2 - ks.spr.w * 4 + ks.indent, y: ks.rect.h},
        {x: ks.rect.w / 2 - ks.spr.w * 4 + ks.indent, y: ks.rect.h + ks.margin.h - ks.pointerSpace}
      ]];
      return {...node, children, arrows};
    }
    return {...node, children};
  }

  // InArrow は親要素から子要素への矢印
  // Switchのとき矢印は、各Caseに対して「↓→」
  static _setInArrowOfSwitch = <T extends KWithArrow>(node: T, ks: KSize): T => {
    const children = node.children.map(c => KArrowUtil._setInArrowOfSwitch(c, ks));
    if (node.open && isSwitch(node.type) && children.length !== 0) {
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

  // 並列関係の下に向かう矢印「↓」
  static _setNextArrow = <T extends KWithArrow>(node: T, ks: KSize): T => {
    const children = node.children.map((c, i) => {
      if (c.open && c.children.length !== 0) {
        return KArrowUtil._setNextArrow(c, ks);
      } else {
        if (!isCase(c.type) && node.children.length - 1 !== i) {
          const openMargin = c.open ? ks.margin.h : 0;
          const arrows: Point[][] = [[
            {x: ks.rect.w / 2 - ks.spr.w * 4, y: ks.rect.h},
            {x: ks.rect.w / 2 - ks.spr.w * 4, y: ks.rect.h + ks.margin.h + openMargin - ks.pointerSpace}
          ]];
          return {...c, arrows};
        } else {
          return c;
        }
      }
    });
    return {...node, children};
  }
  // 子要素から先祖要素に戻る矢印には３種類ある
  // 子要素がCaseでなければ
  //   ネストが深くない場合は「↓」
  //   ネストが深い場合は「↓←↓」
  // 子要素がCaseなら
  static _setReturnArrow = <T extends KWithArrow>(node: T, before: T | null, exit: T | null, ks: KSize): T => {
    if (node.open && node.children.length !== 0) {
      const children = node.children.map((c, i, _children) => {
        const isLastChildren = _children.length - 1 === i;
        if (!isLastChildren) {
          if (c.children.length !== 0) {
            return !isSwitch(node.type)
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
    if (!node.open && isCase(node.type) && exit !== null) {
      return {...node, arrows: KArrowUtil.getArrowPoints(node, before!, exit, ks)};
    }

    return node;
  }

  static _hasUnderNode = <T extends KWithArrow>(node: T, target: T): boolean => {
    if (node.children.length === 0) { return false; }
    const hasUnder = node.children.map(c => target.point.y < c.point.y).reduce((a, b) => a || b);
    if (hasUnder) { return true; }
    if (node.children[node.children.length - 1].id === target.id && !target.open) { return false; }
    return node.children.map(c => KArrowUtil._hasUnderNode(c, target)).reduce((a, b) => a || b);;
  } 

  static getArrowPoints = <T extends KWithArrow>(node: T, before: T, exit: T, ks: KSize): Point[][] => {
    const dv: Point = {x: exit.point.x - node.point.x, y: exit.point.y - node.point.y};
    if (isTask(before.type) && !KArrowUtil._hasUnderNode(before, node)) {
      const exitCenter = ks.rect.w / 2  - ks.spr.w * 4 - (node.point.x - before.point.x);
      if (exitCenter < ks.spr.w) {
        return [[
          {x: ks.rect.w / 2 - ks.spr.w * 4, y: ks.rect.h},
          {x: ks.rect.w / 2 - ks.spr.w * 4, y: ks.rect.h + ks.spr.h},
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
        {x: ks.rect.w / 2 - ks.spr.w * 4 + dv.x, y: dv.y - ks.spr.h * margin},
        {x: ks.rect.w / 2 - ks.spr.w * 4 + dv.x, y: dv.y - ks.pointerSpace}
      ]];
    }
  }
}

export type which = 'width' | 'height';