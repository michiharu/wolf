export default interface TreeNode {
  id: string;
  type: Type;
  label: string;
  ifState?: string;
  input: string;
  output: string;
  children: TreeNode[];
}

export type Type = 'task' | 'switch';