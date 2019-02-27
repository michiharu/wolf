import TreeUtil from './tree';
import TreeNode from '../data-types/tree-node';

describe('TreeUtil', () => {
  it(
    'getGenealogyは、先祖〜targetのNodeリストを返す',
    () => {
      const node111: TreeNode = {
        id: '001-1-1',
        label: 'マニュアル１−１−１',
        children: []
      };

      const node112: TreeNode = {
        id: '001-1-2',
        label: 'マニュアル１-１−２',
        children: []
      };
      const node113: TreeNode = {
        id: '001-1-3',
        label: 'マニュアル１−１−３',
        children: []
      };

      const node11: TreeNode = {
        id: '001-1',
        label: 'マニュアル１−１',
        children: [node111, node112, node113]
      };

      const node12: TreeNode = {
        id: '001-2',
        label: 'マニュアル１-２',
        children: []
      };

      const node13: TreeNode = {
        id: '001-3',
        label: 'マニュアル１−３',
        children: []
      };

      const node1: TreeNode = {
        id: '001',
        label: 'マニュアル１',
        children: [node11, node12, node13]
      };

      const node21: TreeNode = {
        id: '002-1',
        label: 'マニュアル２−１',
        children: []
      };

      const node22: TreeNode = {
        id: '002-2',
        label: 'マニュアル２-２',
        children: []
      };

      const node23: TreeNode = {
        id: '002-3',
        label: 'マニュアル２−３',
        children: []
      };

      const node2: TreeNode = {
        id: '002',
        label: 'マニュアル２',
        children: [node21, node22, node23]
      };

      const node3: TreeNode = {
        id: '003',
        label: 'マニュアル３',
        children: []
      };

      const nodeList: TreeNode[] = [node1, node2, node3];

      expect(TreeUtil.getGenealogy(nodeList, node1)).toEqual([node1]);
      expect(TreeUtil.getGenealogy(nodeList, node2)).toEqual([node2]);
      expect(TreeUtil.getGenealogy(nodeList, node3)).toEqual([node3]);
      expect(TreeUtil.getGenealogy(nodeList, node11)).toEqual([node1, node11]);
      expect(TreeUtil.getGenealogy(nodeList, node12)).toEqual([node1, node12]);
      expect(TreeUtil.getGenealogy(nodeList, node13)).toEqual([node1, node13]);
      expect(TreeUtil.getGenealogy(nodeList, node111)).toEqual([node1, node11, node111]);
      expect(TreeUtil.getGenealogy(nodeList, node112)).toEqual([node1, node11, node112]);
      expect(TreeUtil.getGenealogy(nodeList, node113)).toEqual([node1, node11, node113]);
  });
});