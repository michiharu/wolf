export default interface TreeNode {
  id: string;
  label: string;
  input: string;
  output: string;
  children: TreeNode[];
}