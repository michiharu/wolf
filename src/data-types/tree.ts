import User from "./user";
import Category from "./category";

export interface Tree {
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
  children: Tree[];
}

export const baseTree: Tree = {
  id: '',
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
  children: [],
};

export interface Manual {
  id: string;
  beforeSaving: boolean;
  title: string;
  description: string;
  ownerId: string;
  collaboratorIds: string[];
  categoryId: string;
  isPublic: boolean;
  viewerIds: string[];
  visible: boolean;
  favoriteIds: string[];
  likeIds: string[];
  rootTree: Tree | null;
}

export const baseManual: Manual = {
  id: '',
  beforeSaving: false,
  title: '',
  description: '',
  ownerId: '',
  collaboratorIds: [],
  categoryId: '',
  isPublic: true,
  viewerIds: [],
  visible: true,
  favoriteIds: [],
  likeIds: [],
  rootTree: null
};

export interface ManualWithObject extends Manual {
  owner: User;
  collaborators: User[];
  category: Category;
  viewers: User[];
  favorites: User[];
  likes: User[];
}

export interface TreeNode extends Tree {
  children: TreeNode[];
  open: boolean;
  focus: boolean;
  isDragging: boolean;
  isMemo: boolean;
}

export const baseTreeNode: TreeNode = {
  ...baseTree,
  children: [],
  open: false,
  focus: false,
  isDragging: false,
  isMemo: false,
};

export interface NodeWithSimilarity extends Tree {
  _label: number;
  _input: number;
  _output: number;
  _childrenLength: number;
}

export type Parent = {id: string, label: string};

export interface Memo extends Tree {
  point: Point;
  children: Tree[];
}

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
export type DragAction = 'moveToBrother' | 'moveInOut';
export type DropAction = 'insertBefore' | 'insertNext' | 'insertLast';
export type DragRow = {node: KTreeNode, action: DragAction} | undefined;
export type DropRow = {node: KTreeNode, action: DropAction} | undefined;
