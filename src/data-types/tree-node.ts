export interface TreeWithoutId {
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
  children: TreeWithoutId[];
}

export const baseTreeWithoutId: TreeWithoutId = {
  type: 'task',
  label: '',
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
  children: []
};

export interface Tree extends TreeWithoutId {
  id: string;
  children: Tree[];
}

export const baseTree: Tree = {
  ...baseTreeWithoutId,
  children: [],
  id: '',
};

export interface TreeNode extends Tree {
  children: TreeNode[];
  open: boolean;
  focus: boolean;
}

export const baseTreeNode: TreeNode = {
  ...baseTree,
  children: [],
  open: false,
  focus: false,
};

export interface NodeWithSimilarity extends Tree {
  _label: number;
  _input: number;
  _output: number;
  _childrenLength: number;
}

export type Parent = {id: string, label: string};

export interface KTreeNode extends TreeNode {
  children: KTreeNode[];
  
  index: number;
  depth: {top: number, bottom: number};

  point: Point;

  self: Size;
  rect: Size;
}

export const baseKTreeNode: KTreeNode = {
  ...baseTreeNode,
  children: [],
  index: 0,
  depth: {top: 0, bottom: 0},
  point: {x: 0, y: 0},
  self: {w: 0, h: 0},
  rect: {w: 0, h: 0},
};

export interface KWithArrow extends KTreeNode {
  children: KWithArrow[];
  arrows: Point[][];
}

export const baseKWithArrow: KWithArrow = {
  ...baseKTreeNode,
  children: [],
  arrows: [],
};

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
export type FlatAction = 'moveToBrother' | 'moveInOut';
export type Row = {node: KTreeNode, action: FlatAction} | undefined;