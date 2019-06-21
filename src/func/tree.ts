import {Tree, Type, isSwitch, isCase } from "../data-types/tree";

export default class TreeUtil {

  static _get = <T1 extends Tree, T2 extends T1>(node: T1, base: T2): T2 => {
    const children = node.children.map(c => TreeUtil._get(c, base));
    return {...base, ...node, children};
  }

  // genealogy = 系譜：先祖〜targetのNodeリストを返す
  static getGenealogy = (nodeList: Tree[], target: Tree): Tree[] => {

    const genealogy = TreeUtil.getGeneOrFalse(nodeList, target);
    if (genealogy === false) { throw new Error('Target is not found.'); }

    return genealogy;
  }

  private static getGeneOrFalse = <T extends Tree>(nodeList: T[], target: T): T[] | false => {
    if (nodeList.length === 0) { return false; }
    
    const findResult = nodeList.find(n => target.id === n.id);
    if (findResult) { return [findResult]; }

    return nodeList.map(n => {
      const childResult = TreeUtil.getGeneOrFalse(n.children as T[], target);
      return childResult !== false ? [n].concat(childResult) : false;
    }).reduce((a, b) => a || b || false);
  }

  static _replaceArray = <T extends Tree>(nodeList: T[], target: T): T[] => {
    if (nodeList.length === 0) { return []; }
    return nodeList.map(n => target.id === n.id
      ? target
      : {...n, children: TreeUtil._replaceArray(n.children, target)});
  }

  static _replace = <T extends Tree>(node: T, target: T): T => {
    if (node.id === target.id) { return target; }
    const children = node.children.map(c => TreeUtil._replace(c, target));
    return {...node, children};
  }

  static _findArray = <T extends Tree>(nodeList: T[], targetId: string): T | undefined => {
    if (nodeList.length === 0) { return undefined; }
    const findResult = nodeList.find(n => n.id === targetId);
    if (findResult !== undefined) { return findResult; }
    return nodeList
    .map(n => TreeUtil._findArray(n.children as T[], targetId))
    .reduce((a, b) => a || b || undefined);
  }

  static _find = <T extends Tree>(node: T, targetId: string): T | undefined => {
    if (node.id === targetId) { return node; }
    if (node.children.length === 0) { return undefined; }
    return node.children.map(c => TreeUtil._find(c as T, targetId)).reduce((a, b) => a || b || undefined);
  }

  static _toArray = <T extends Tree & { children: T[] }>(nodeList: T[]): T[] => {
    return nodeList
    .map(n => n.children.length === 0 ? [n] : [n].concat(TreeUtil._toArray(n.children)))
    .reduce((a, b) => a.concat(b));
  }

  // toArray化済みのTree配列に対して使用する
  static search = <T extends Tree>(text: string, nodes: T[]): T[] => {
    const searchWords = TreeUtil.splitSearchWords(text);

    return nodes.filter(n => searchWords.length === 0
      ? true
      : searchWords
        .map(w => (
          n.label.match(new RegExp(`${w}`)) !== null ||
          n.input.match(new RegExp(`${w}`)) !== null ||
          n.output.match(new RegExp(`${w}`)) !== null
        ))
        .reduce((a, b) => a === true && b === true));
  }

  static splitSearchWords = (text: string) => text.split(/\s|　/).map(s => s.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'));

  static _setId = (node: Tree): Tree => {
    const id = 'rand:' + String(Math.random()).slice(2);
    const children = node.children.map(c => TreeUtil._setId(c));
    return {...node, id, children};
  }

  static _clearId = (node: Tree): Tree => {
    const children = node.children.map(c => TreeUtil._clearId(c));
    return {...node, id: '', children};
  }

  static getNewNode = <T extends Tree>(parentType: Type, base: T): T => ({
    ...base, 
    id: 'rand:' + String(Math.random()).slice(2),
    type: !isSwitch(parentType) ? Type.task : Type.case,
  });

  static match = (node: Tree, words: string[]): boolean => {
    if (words.length === 0) { return true; }
    return words
    .map(w => (
      node.label.match(new RegExp(`${w}`)) !== null ||
      node.input.match(new RegExp(`${w}`)) !== null ||
      node.output.match(new RegExp(`${w}`)) !== null
    ))
    .reduce((a, b) => a === true && b === true);
  }

  // ある子孫要素が検索に該当している場合に、そこに至る親要素も含めたTreeを返す。
  static _searchAndFilter = <T extends Tree>(words: string[], nodes: T[]): T[] => {
    return nodes
    // nodeには未加工のデータを格納、childrenは子要素を絞り込んだ要素配列を作成する
    .map(n => ({...n, children: TreeUtil._searchAndFilter(words, n.children)}))
    // 自分自身が検索にヒットしているか、または子孫要素が検索にヒットしているか
    .filter(n => TreeUtil.match(n, words) || n.children.length !== 0)
  }

  static _hasDifference = <T extends Tree>(a: T, b: T): boolean => {
    if (a.id     !== b.id)     { return true; }
    if (a.type   !== b.type)   { return true; }
    if (a.label  !== b.label)  { return true; }
    if (a.input  !== b.input)  { return true; }
    if (a.output !== b.output) { return true; }

    if (a.preConditions  !== b.preConditions)  { return true; }
    if (a.postConditions !== b.postConditions) { return true; }
    if (a.workerInCharge !== b.workerInCharge) { return true; }
    if (a.remarks        !== b.remarks)        { return true; }
    if (a.necessaryTools !== b.necessaryTools) { return true; }
    if (a.exceptions     !== b.exceptions)     { return true; }
    if (a.imageBlob      !== b.imageBlob)      { return true; }

    if (a.children.length !== b.children.length) { return true; }
    if (a.children.length === 0) { return false; }

    return a.children
    .map((_, i) => ({t: a.children[i], e: b.children[i]}))
    .map(te => TreeUtil._hasDifference(te.t, te.e))
    .reduce((a, b) => a || b);
  }

  static _isAllSwitchHasCase = <T extends Tree>(node: T): boolean => {
    if (node.children.length === 0) { return !isSwitch(node.type); }
    return node.children.map(c => TreeUtil._isAllSwitchHasCase(c)).reduce((a, b) => a && b);
  }

  static _isAllCaseHasItem = <T extends Tree>(node: T): boolean => {
    if (node.children.length === 0) { return !isCase(node.type); }
    return node.children.map(c => TreeUtil._isAllCaseHasItem(c)).reduce((a, b) => a && b);
  }

  static _deleteById = <T extends Tree>(node: T, id: string): T => {
    const findResult = node.children.find(c => c.id === id);
    if (findResult !== undefined) {
      return {...node, children: node.children.filter(c => c.id !== id)};
    }

    const children = node.children.map(c => TreeUtil._deleteById(c, id));
    return {...node, children};
  }

  static moveBrother = <T extends Tree>(node: T, from: T, to: T): T => {
    const parentNode = TreeUtil._getPrent(node, from);
    const childrenIds = parentNode!.children.map(c => c.id);
    const isNext = childrenIds.indexOf(from.id) + 1 === childrenIds.indexOf(to.id);
    const deletedTree = TreeUtil._deleteById(node, from.id); 
    return TreeUtil._insert(deletedTree, from, to, isNext);
  }

  static _insert = <T extends Tree>(node: T, target: T, to: T, isNext: boolean): T => {
    const index = node.children.map(c => c.id).indexOf(to.id);

    if (index !== -1) {
      node.children.splice(index + (isNext ? 1 : 0), 0, target);
      return node;
    } else {
      const children = node.children.map(c => TreeUtil._insert(c, target, to, isNext));
      return {...node, children};
    }
  }

  static moveInOut = <T extends Tree>(node: T, child: T, parentNode: T): T => {
    const moveIn = parentNode.children.find(c => c.id === child.id) === undefined;
    const deletedTree = TreeUtil._deleteById(node, child.id);
    if (moveIn) {
      return TreeUtil._push(deletedTree, child, parentNode);
    } else {
      return TreeUtil._insert(deletedTree, child, parentNode, true);
    }
  }

  static _push = <T extends Tree>(node: T, child: T, parentNode: T): T => {
    const children = node.id === parentNode.id
    ? node.children.concat([child])
    : node.children.map(c => TreeUtil._push(c, child, parentNode));
    return {...node, children};
  }

  static _unshift = <T extends Tree>(node: T, child: T, parentNode: T): T => {
    const children = node.id === parentNode.id
    ? [child].concat(node.children as T[])
    : node.children.map(c => TreeUtil._unshift(c, child, parentNode));
    return {...node, children};
  }

  static _getPrent = <T extends Tree>(node: T, target: T): T | null => {
    if (node.children.length === 0) { return null; }
    if (node.children.find(c => c.id === target.id) !== undefined) { return node; }
    return node.children
      .map(c => TreeUtil._getPrent(c, target) as (T | null))
      .reduce((a, b) => a || b || null);
  }
}