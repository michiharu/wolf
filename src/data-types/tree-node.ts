export interface TreeNode {
  id: string;
  type: Type;
  label: string;
  input: string;
  output: string;
  preConditions: string;
  postConditions: string;
  workerInCharge: string;
  remarks: string;
  necessaryTools: string;
  exceptions: string;
  imageName: string;
  imageBlob: string;
  children: TreeNode[];
}

export interface NodeWithSimilarity extends TreeNode {
  _label: number;
  _input: number;
  _output: number;
  _childrenLength: number;
}

export interface NodeWithoutId {
  type: Type;
  label: string;
  input: string;
  output: string;
  preConditions: string;
  postConditions: string;
  workerInCharge: string;
  remarks: string;
  necessaryTools: string;
  exceptions: string;
  imageName: string;
  imageBlob: string;
  children: NodeWithoutId[];
}

export interface TreeNodeWithParents extends TreeNode {
  parents: Parent[];
  children: TreeNodeWithParents[];
}

export type Parent = {id: string, label: string};

export default TreeNode;

export interface EditableNode extends TreeNode {
  parentType: Type;
  children: EditableNode[];

  open: boolean;
  focus: boolean;
  
  index: number;
  depth: {top: number, bottom: number};

  point: Point;

  self: Size;
  rect: Size;
}

export interface CheckNode extends TreeNode {
  parentType: Type;
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