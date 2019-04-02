import * as React from 'react';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableColumn } from 'mui-datatables';
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
      pagination: false,
      filter: false,
      search: false,
      print: false,
      download: false,
      textLabels: {
        body: {
          noMatch: '表示するデータはありません。',
          toolTip: 'ソート'
        },
        pagination: {
          next: "Next Page",
          previous: "Previous Page",
          rowsPerPage: "Rows per page:",
          displayRows: "of",
        },
        toolbar: {
          search: "Search",
          downloadCsv: "Download CSV",
          print: "Print",
          viewColumns: "View Columns",
          filterTable: "Filter Table",
        },
        filter: {
          all: "All",
          title: "FILTERS",
          reset: "RESET",
        },
        viewColumns: {
          title: "Show Columns",
          titleAria: "Show/Hide Table Columns",
        },
        selectedRows: {
          text: "row(s) selected",
          delete: "Delete",
          deleteAria: "Delete Selected Rows",
        },
      }
    };
    return (
      <MUIDataTable
        title={"同じ内容の共有マニュアルが存在します"}
        data={list}
        columns={columns}
        options={options}
      />
    );
  }
}

export default SimilarityTable;