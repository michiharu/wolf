export interface TreeNode {
  id: string;
  type: Type;
  label: string;
  input: string;
  output: string;
  children: TreeNode[];
}

export interface NodeWithoutId {
  type: Type;
  label: string;
  input: string;
  output: string;
  children: NodeWithoutId[];
}

export interface TreeNodeWithParents {
  parents: Parent[];
  id: string;
  type: Type;
  label: string;
  input: string;
  output: string;
  children: TreeNodeWithParents[];
}
export type Parent = {id: string, label: string};

export default TreeNode;

export interface EditableNode {
  parentType: Type;
  id: string;
  type: Type;
  label: string;
  input: string;
  output: string;
  children: EditableNode[];

  open: boolean;
  focus: boolean;
  
  index: number;
  depth: {top: number, bottom: number};

  point: Point;

  self: Size;
  rect: Size;
}

export interface CheckNode {
  parentType: Type;
  id: string;
  type: Type;
  label: string;
  input: string;
  output: string;
  children: CheckNode[];

  open: boolean;
  focus: boolean;
  checked: boolean;
  skipped: boolean;
  
  index: number;
  depth: {top: number, bottom: number};

  point: Point;

  self: Size;
  rect: Size;
}

export interface CheckRecord {
  at: number;
  from: number;
  time: number;
  node: CheckNode;
}

// export const dummyId = '--';
export type Type = 'task' | 'switch' | 'case';
export type Point = {x: number, y: number};
export type Size = {w: number, h:number};
export type FlatAction = 'push' | 'move' | 'none';
export type Cell = {node: EditableNode, action: FlatAction} | undefined;