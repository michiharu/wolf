import TreeNode from "../data-types/tree-node";

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

  static replace = (nodeList: TreeNode[], target: TreeNode): TreeNode[] => {
    if (nodeList.length === 0) { return []; }
    return nodeList.map(n => target.id === n.id
      ? target
      : {...n, children: TreeUtil.replace(n.children, target)});
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
}