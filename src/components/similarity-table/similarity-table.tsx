import * as React from 'react';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableColumn } from 'mui-datatables';

import {
  Table, TableHead, TableBody, TableRow, TableCell, Checkbox
} from '@material-ui/core';
import TreeNode from '../../data-types/tree-node';

interface Props {
  target: TreeNode;
  list: TreeNode[];
}

interface State {

}

class SimilarityTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
  }

  render () {
    const { target, list } = this.props;

    const columns: MUIDataTableColumn[] = [
      { name: 'type',   label: 'タイプ',     options: { sort: false }},
      { name: 'label',  label: '名前',       options: { sort: true }},
      { name: 'input',  label: 'インプット',  options: { sort: true }},
      { name: 'output', label: 'アウトプット', options: { sort: true }},
    ];

    const options: MUIDataTableOptions = {
      elevation: 0,
      responsive: 'scroll',
      rowHover: false,
      selectableRows: false,
      filter: false,
      search: false,
      print: false,
      download: false
    };
    return (
      <MUIDataTable
        title={"登録済み共有マニュアルとの比較一覧"}
        data={[target].concat(list)}
        columns={columns}
        options={options}
      />
    );
  }
}

export default SimilarityTable;