import TreeUtil from './tree';
import TreeNode, { EditableNode } from '../data-types/tree-node';
import { nodeList, node11, node1 } from '../mock-data/node/get';
import EditableNodeUtil from './editable-node-util';

describe('TreeUtil', () => {
  it(
    'deleteById-1',
    () => {
      const knode = EditableNodeUtil.get('task', node11);
      const targetId = '1-1-2';

      const children = knode.children.filter(c => c.id !== targetId);
      const result: EditableNode = {...knode};
      result.children = children;

      expect(EditableNodeUtil._deleteById(knode, targetId)).toEqual(result);
    }
  );
  it(
    'deleteById-1',
    () => {
      const knode = EditableNodeUtil.get('task', node1);
      const targetId = '1-1';

      const children = knode.children.filter(c => c.id !== targetId);
      const result: EditableNode = {...knode};
      result.children = children;

      expect(EditableNodeUtil._deleteById(knode, targetId)).toEqual(result);
    }
  );
  it(
    'deleteById-2',
    () => {
      const knode = EditableNodeUtil.get('task', node1);
      const targetId = '1-1-2';
      const testTarget = EditableNodeUtil._deleteById(knode, targetId);

      // 1     1-1      1-1-x
      knode.children[0].children = knode.children[0].children.filter(c => c.id !== targetId);

      const result: EditableNode = {...knode};

      expect(testTarget.id).toEqual(result.id);

      expect(testTarget.children.length).toEqual(result.children.length);

      expect(testTarget.children[0].id).toEqual(result.children[0].id);
      expect(testTarget.children[0].children.length).toEqual(result.children[0].children.length);
      expect(testTarget).toEqual(result);
    }
  );
});