import {TreeNode, Parent, TreeWithoutId, Tree, Type, baseTreeNode } from "../data-types/tree-node";

export default class TreeUtil {

  static _getTreeNode = (node: Tree, base: TreeNode): TreeNode => {
    const children = node.children.map(c => TreeUtil._getTreeNode(c, base));
    return {...base, ...node, open: children.length !== 0, focus: false, children};
  }

  // genealogy = 系譜：先祖〜targetのNodeリストを返す
  static getGenealogy = (nodeList: Tree[], target: Tree): Tree[] => {

    const genealogy = TreeUtil.getGeneOrFalse(nodeList, target);
    if (genealogy === false) { throw 'Target is not found.' }

    return genealogy;
  }

  private static getGeneOrFalse = (nodeList: Tree[], target: Tree): Tree[] | false => {
    if (nodeList.length === 0) { return false; }
    
    const findResult = nodeList.find(n => target.id === n.id);
    if (findResult) { return [findResult]; }

    return nodeList.map(n => {
      const childResult = TreeUtil.getGeneOrFalse(n.children, target);
      return childResult !== false ? [n].concat(childResult) : false;
    })
    .reduce((a, b) => a !== false ? a
                    : b !== false ? b : false);
  }

  static replaceChild = (nodeList: Tree[], target: Tree): Tree[] => {
    if (nodeList.length === 0) { return []; }
    return nodeList.map(n => target.id === n.id
      ? target
      : {...n, children: TreeUtil.replaceChild(n.children, target)});
  }

  static _replace = (node: TreeNode, target: TreeNode): TreeNode => {
    if (node.id === target.id) {
      return target;
    } else {
      const children = node.children.map(c => TreeUtil._replace(c, target));
      return {...node, children};
    }
  }

  static find = (nodeList: Tree[], target: Tree): Tree | undefined => {
    if (nodeList.length === 0) { return undefined; }
    const findResult = nodeList.find(n => n.id === target.id);
    if (findResult !== undefined) { return findResult; }
    return nodeList
    .map(n => TreeUtil.find(n.children, target))
    .reduce((a, b) => a !== undefined ? a
                    : b !== undefined ? b : undefined);
  }

  static _findById = <T extends Tree>(node: T, targetId: string): T | undefined => {
    if (node.id === targetId) {
      return node;
    }
    if (node.children.length === 0) {
      return undefined;
    }
    return (node.children as T[])
      .map(c => TreeUtil._findById(c, targetId)).reduce((a, b) => a || b || undefined);
  }

  static toArray = (nodeList: TreeNode[]): TreeNode[] => {
    const flatNodes: TreeNode[][] = nodeList.map(n => {
      if (n.children.length === 0) return [n];
      const children: TreeNode[] = n.children.map(c => ({...c, children: []}))
      return [{...n, children}].concat(TreeUtil.toArray(n.children));
    });

    return flatNodes.reduce((a, b) => a.concat(b));
  }

  static search = <T extends TreeNode>(text: string, nodes: T[]): T[] => {
    const searchWords = text.split(/\s|　/).map(s => s.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'));

    return nodes.filter(n => searchWords.length === 0
      ? true
      : searchWords
        .map(w => (
          n.label .match(new RegExp(`${w}`)) !== null ||
          n.input .match(new RegExp(`${w}`)) !== null ||
          n.output.match(new RegExp(`${w}`)) !== null
        ))
        .reduce((a, b) => a === true && b === true))
  }

  static _removeId = (node: TreeNode): TreeWithoutId => {
    const children = node.children.map(c => TreeUtil._removeId(c));
    return {
      type: node.type,
      label: node.label,
      input: node.input,
      output: node.output,
      preConditions: node.preConditions,
      postConditions: node.postConditions,
      workerInCharge: node.workerInCharge,
      remarks: node.remarks,
      necessaryTools: node.necessaryTools,
      exceptions: node.exceptions,
      imageName: node.imageName,
      imageBlob: node.imageBlob,
      children
    };
  }

  static _setId = (node: TreeWithoutId): Tree => {
    const id = 'rand:' + String(Math.random()).slice(2);
    const children = node.children.map(c => TreeUtil._setId(c));
    return {...node, id, children};
  }

  static getNewNode = <T extends Tree>(parentType: Type, base: T): T => ({
    ...base, 
    id: 'rand:' + String(Math.random()).slice(2),
    type: parentType !== 'switch' ? 'task' : 'case',
    open: false,
    focus: false,
  });

  static getSearchWords = (text: string) => text.split(/\s|　/).map(s => s.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'));

  static match = (node: Tree, words: string[]): boolean => {
    if (words.length === 0) { return true; }
    return words
    .map(w => (
      node.label .match(new RegExp(`${w}`)) !== null ||
      node.input .match(new RegExp(`${w}`)) !== null ||
      node.output.match(new RegExp(`${w}`)) !== null
    ))
    .reduce((a, b) => a === true && b === true);
  }

  static _searchAndFilter = <T extends Tree>(words: string[], nodes: T[]): T[] => {
    return nodes
    .map(n => ({node: n, children: TreeUtil._searchAndFilter(words, n.children)}))
    .filter(obj => TreeUtil.match(obj.node, words) || obj.children.length !== 0)
    .map(obj => ({...obj.node, children: obj.children}));
  }

  static _hasDifference = (a: Tree, b: Tree): boolean => {
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

  static _isAllSwitchHasCase = (node: TreeNode): boolean => {
    if (node.children.length === 0) {
      if (node.type === 'switch') { return false; }
      return true;
    }
    return node.children.map(c => TreeUtil._isAllSwitchHasCase(c)).reduce((a, b) => a && b);
  }

  static _isAllCaseHasItem = (node: TreeNode): boolean => {
    if (node.children.length === 0) {
      if (node.type === 'case') { return false; }
      return true;
    }
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

  static _open = <T extends TreeNode>(node: T, id: string, open: boolean): T => {
    if (node.id === id) { return {...node, open}; }
    const children = node.children.map(c => (TreeUtil._open(c, id, open)));
    return {...node, children};
  }

  static _focus = (node: TreeNode, id: string): TreeNode => {
    const children = node.children.map(c => (TreeUtil._focus(c, id)));
    return {...node, children, focus: node.id === id};
  }


  static _deleteFocus = (node: TreeNode): TreeNode => {
    if (node.focus === true) { return {...node, focus: false}; }
    const children = node.children.map(c => (TreeUtil._deleteFocus(c)));
    return {...node, children};
  }

  static move = <T extends Tree>(node: T, from: T, to: T): T => {
    const deletedTree = TreeUtil._deleteById(node, from.id); 
    return TreeUtil._insert(deletedTree, from, to);
  }

  static _insert = <T extends Tree>(node: T, target: T, to: T): T => {
    const index = node.children.map(c => c.id).indexOf(to.id);
    if (index !== -1) {
      node.children.splice(index, 0, target);
      return {...node};
    }

    const children = node.children.map(c => TreeUtil._insert(c, target, to));
    return {...node, children};
  }

  static _insertNext = <T extends Tree>(node: T, target: T, to: T): T => {
    const index = node.children.map(c => c.id).indexOf(to.id);
    if (index !== -1) {
      const children = [...node.children];
      children.splice(index + 1, 0, target);
      return {...node, children};
    }

    const children = node.children.map(c => TreeUtil._insertNext(c, target, to));
    return {...node, children};
  }

  static push = (node: TreeNode, child: TreeNode, parent: TreeNode): TreeNode => {
    const deletedTree = TreeUtil._deleteById(node, child.id) as TreeNode;
    const setParentTypeChild = TreeUtil.setParentType(child, parent.type);
    return TreeUtil._push(deletedTree, setParentTypeChild, parent);
  }

  static _push = (node: TreeNode, child: TreeNode, parent: TreeNode): TreeNode => {
    if (node.id === parent.id) {
      node.children.push(child);
      return {...node};
    }
    const children = node.children.map(c => TreeUtil._push(c, child, parent));
    return {...node, children};
  }
  
  static setParentType = (node: TreeNode, parentType: Type): TreeNode => {
    const result = {...node, parentType};
    return result;
  }

  static addDetails = <T extends TreeNode>(node: T, parent: T): T => {
    const newNode = TreeUtil.getNewNode(parent.type, baseTreeNode);
    const pushedNode = TreeUtil._unshift(node, newNode, parent);
    return TreeUtil._open(pushedNode, parent.id, true) as T;
  }

  static addNextBrother = (node: TreeNode, to: TreeNode): TreeNode => {
    const parentNode = TreeUtil._getPrent(node, to);
    const newNode = TreeUtil.getNewNode(parentNode!.type, baseTreeNode);
    return TreeUtil._insertNext(node, newNode, to);
  }

  static addFromCommon = (node: TreeNode, parent: TreeNode, common: Tree, base: TreeNode): TreeNode => {
    const commonAsTreeNode = TreeUtil._getTreeNode(common, base);
    const pushedNode = TreeUtil._push(node, commonAsTreeNode, parent);
    return TreeUtil._open(pushedNode, parent.id, true);
  }

  static _unshift = <T extends TreeNode>(node: T, child: T, parent: T): T => {
    if (node.id === parent.id) {
      node.children.unshift(child);
      return {...node};
    }
    const children = node.children.map(c => TreeUtil._unshift(c, child, parent));
    return {...node, children};
  }

  static _getPrent = <T extends Tree>(node: T, target: T): T | null => {
    if (node.children.length === 0) { return null; }
    if (node.children.find(c => c.id === target.id) !== undefined) { return node; }
    return node.children
      .map(c => TreeUtil._getPrent(c, target))
      .reduce((a, b) => a || b || null) as T;
  }
}