import React, { useCallback, useRef } from 'react';
import {
  Dialog, DialogContent, DialogActions, Button,
} from '@material-ui/core';

import { Stage, Layer } from 'react-konva';

import { TreeNode, baseKWithArrow, KWithArrow } from '../../../../data-types/tree';
import TreeUtil from '../../../../func/tree';
import TreeNodeUtil from '../../../../func/tree-node';
import KTreeUtil from '../../../../func/k-tree';
import KArrowUtil from '../../../../func/k-arrow';
import KViewNode from '../../../../components/konva/k-view-node';
import { RSState } from '../../../../redux/states/rsState';
import { KSState } from '../../../../redux/states/ksState';
import ReactToPrint from 'react-to-print';

interface Props extends KSState, RSState {
  open: boolean;
  close: () => void;
  node: TreeNode | null;
}

const NodePrintComponent: React.FC<Props> = props => {
  const { open, close, node: tree, ks } = props;

  const stageRef = useCallback(stage => {
    if (stage !== null && tree !== null) {
      const kTreeNode = KTreeUtil.setCalcProps(TreeUtil._get(tree, baseKWithArrow), ks, false);
      const node = KArrowUtil.setArrow(kTreeNode, ks)
      stage.width((node.self.w + ks.spr.w) * ks.unit);
      stage.height((node.self.h + ks.spr.h) * ks.unit);
      stage.draw();
    }
  }, [ks, tree]);

  const contentRef = useRef();

  if (tree === null) { return <></>; }

  const kTreeNode = KTreeUtil.setCalcProps(TreeUtil._get(tree, baseKWithArrow), ks, false);
  const node = KArrowUtil.setArrow(kTreeNode, ks)
  const flatNodes = TreeNodeUtil.toArrayWithoutClose(node);
  const nodeProps = { ks, expand: (target: KWithArrow) => {} };

  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth="xl"
    >
      <DialogContent ref={contentRef}>
        <Stage ref={stageRef}>
          <Layer>
            {flatNodes.map(n => <KViewNode key={n.id} node={n} {...nodeProps} />)}
          </Layer>
        </Stage>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>閉じる</Button>
        <ReactToPrint
          trigger={() => <Button color="primary">印刷する</Button>}
          content={() => contentRef.current}
        />
      </DialogActions>
    </Dialog>

  );
}


export default NodePrintComponent;