export interface TreeNode {
  id: string;
  type: Type;
  label: string;
  ifState?: string;
  input: string;
  output: string;
  children: TreeNode[];
}

export interface TreeNodeWithParents {
  parents: Parent[];
  id: string;
  type: Type;
  label: string;
  ifState?: string;
  input: string;
  output: string;
  children: TreeNodeWithParents[];
}
export type Parent = {id: string, label: string};

export interface TreeViewNode {
  id: string;
  type: Type;
  label: string;
  ifState?: string;
  input: string;
  output: string;
  children: TreeViewNode[];
  open: boolean;
  width: number;
  height: number;
  rect: {w: number, h: number};
}

export default TreeNode;

export type Type = 'task' | 'switch';