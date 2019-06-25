import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogActions, Button } from '@material-ui/core';
import { TreeNode } from '../../../../data-types/tree';
import TextPrint from './text-print-component';
import ReactToPrint from 'react-to-print';

interface Props {
  open: boolean;
  close: () => void;
  node: TreeNode;
}

const TextPrintDialogComponent: React.FC<Props> = props => {
  const { open, close, node } = props;
  const contentRef = useRef();


  return (
    <Dialog open={open} onClose={close} maxWidth="xl">
      <DialogContent ref={contentRef}>
        <TextPrint node={node} itemNumber={node.label}/>
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


export default TextPrintDialogComponent;