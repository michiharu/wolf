import  TreeNode from "../data-types/tree-node";

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
}