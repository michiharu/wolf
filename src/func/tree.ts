import TreeNode, { TreeNodeWithParents, Parent, NodeWithoutId } from "../data-types/tree-node";

export default class TreeUtil {

  // genealogy = 系譜：先祖〜targetのNodeリストを返す
  static getGenealogy = (nodeList: TreeNode[], target: TreeNode): TreeNode[] => {

    const genealogy = TreeUtil.getGeneOrFalse(nodeList, target);
    if (genealogy === false) { throw 'Target is not found.' }

    return genealogy;
  }

  private static getGeneOrFalse = (nodeList: TreeNode[], target: TreeNode): TreeNode[] | false => {
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

  static replaceChild = (nodeList: TreeNode[], target: TreeNode): TreeNode[] => {
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

  static find = (nodeList: TreeNode[], target: TreeNode): TreeNode | undefined => {
    if (nodeList.length === 0) { return undefined; }
    const findResult = nodeList.find(n => n.id === target.id);
    if (findResult !== undefined) { return findResult; }
    return nodeList
    .map(n => TreeUtil.find(n.children, target))
    .reduce((a, b) => a !== undefined ? a
                    : b !== undefined ? b : undefined);
  }

  static toArray = (nodeList: TreeNode[]): TreeNode[] => {
    const flatNodes: TreeNode[][] = nodeList.map(n => {
      if (n.children.length === 0) return [n];
      const children: TreeNode[] = n.children.map(c => ({...c, children: []}))
      return [{...n, children}].concat(TreeUtil.toArray(n.children));
    });

    return flatNodes.reduce((a, b) => a.concat(b));
  }

  static toArrayWithParents = (parents: Parent[], nodeList: TreeNode[]): TreeNodeWithParents[] => {
    const flatNodes: TreeNodeWithParents[][] = nodeList.map(n => {
      if (n.children.length === 0) {
        const emptyC: TreeNodeWithParents[] = [];
        return [{...n, children: emptyC, parents}];
      }
      const parentsAddedSelf = parents.concat([{id: n.id, label: n.label}]);
      const emptyP: Parent[] = [];
      const children: TreeNodeWithParents[] = n.children.map(c => ({...c, children: [], parents: emptyP}))
      return [{...n, children, parents}].concat(TreeUtil.toArrayWithParents(parentsAddedSelf, n.children));
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

  static _removeId = (node: TreeNode): NodeWithoutId => {
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

  static _setId = (node: NodeWithoutId): TreeNode => {
    const id = 'rand:' + String(Math.random()).slice(2);
    const children = node.children.map(c => TreeUtil._setId(c));
    return {...node, id, children};
  }

  static getNewNode = (label: string): TreeNode => ({
    type: 'task',
    id: 'rand:' + String(Math.random()).slice(2),
    label,
    input: '',
    output: '',
    preConditions: '',
    postConditions: '',
    workerInCharge: '',
    remarks: '',
    necessaryTools: '',
    exceptions: '',
    imageName: '',
    imageBlob: '',
    children: [],
  });

  static getSearchWords = (text: string) => text.split(/\s|　/).map(s => s.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'));

  static match = (node: TreeNode, words: string[]): boolean => {
    if (words.length === 0) { return true; }
    return words
    .map(w => (
      node.label .match(new RegExp(`${w}`)) !== null ||
      node.input .match(new RegExp(`${w}`)) !== null ||
      node.output.match(new RegExp(`${w}`)) !== null
    ))
    .reduce((a, b) => a === true && b === true);
  }

  static _searchAndFilter = <T extends TreeNode>(words: string[], nodes: T[]): T[] => {
    return nodes
    .map(n => ({node: n, children: TreeUtil._searchAndFilter(words, n.children)}))
    .filter(obj => TreeUtil.match(obj.node, words) || obj.children.length !== 0)
    .map(obj => ({...obj.node, children: obj.children}));
  }

  static _hasDifference = (a: TreeNode, b: TreeNode): boolean => {
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

  static _deleteById = (node: TreeNode, id: string): TreeNode => {
    const findResult = node.children.find(c => c.id === id);
    if (findResult !== undefined) {
      return {...node, children: node.children.filter(c => c.id !== id)};
    }

    const children = node.children.map(c => TreeUtil._deleteById(c, id));
    return {...node, children};
  }
}