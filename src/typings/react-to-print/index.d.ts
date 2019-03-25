declare module 'react-to-print' {

  import * as React from 'react';
  
  export interface ReactToPrintProps {
    trigger: () => any;
    content: () => any;
    onBeforePrint?: () => any;
    onAfterPrint?: () => any;
  }
  
  export const ReactToPrint: React.ComponentType<ReactToPrintProps>;

  export default ReactToPrint;
}