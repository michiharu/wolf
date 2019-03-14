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

export interface KNode {
  parentType: Type;
  id: string;
  type: Type;
  label: string;
  ifState?: string;
  input: string;
  output: string;
  children: KNode[];

  open: boolean;
  focus: boolean;
  
  depth: {top: number, bottom: number};

  point: Point;

  self: Size;
  rect: Size;
}

// export const dummyId = '--';
export type Type = 'task' | 'switch';
export type Point = {x: number, y: number};
export type Size = {w: number, h:number};
export type FlatAction = 'push' | 'move' | 'open' | 'none';
export type Cell = {parent?: KNode, node: KNode, action: FlatAction, insertTo?: number} | undefined;