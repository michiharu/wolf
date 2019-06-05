import * as React from 'react';
import { connect } from 'react-redux';
import { LoginUserState } from '../../redux/states/loginUserState';
import { ManualsState } from '../../redux/states/manualsState';
import { AppState } from '../../redux/store';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableColumn } from 'mui-datatables';
import { Star, StarBorder, ThumbUpAlt, ThumbUpAltOutlined } from '@material-ui/icons';
import { TableCell, TableSortLabel, createMuiTheme, Badge } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from '../..';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { categoriesAction } from '../../redux/actions/categoriesAction';
import { Dispatch } from 'redux';
import { Action } from 'typescript-fsa';
import { CategoriesState } from '../../redux/states/categoriesState';
import { UsersState } from '../../redux/states/usersState';

interface Props extends
  LoginUserState,
  UsersState,
  ManualsState,
  CategoriesState,
  RouteComponentProps {
  filterReset: () => Action<void>;
}

const getMuiTheme = () => createMuiTheme({
  ...theme,
  overrides: {
    MuiTableCell: {
      root: {
        padding: 8,
        paddingTop: 10
      }
    },
    MuiTableSortLabel: {
      root: {
        marginRight: -10
      }
    }
  }
});

const Dashboard: React.FC<Props> = (props: Props) => {
  const columns: MUIDataTableColumn[] = [
    {
      name: "id",
      options: {
        display: "false",
        filter: false,
      }
    },
    {
      name: "favoriteForColumn",
      options: {
        filter: false,
        sort: true,
        customHeadRender: (o, updateDirection) =>
        <TableCell
          align="left"
          sortDirection={o.sortDirection}
          onClick={() =>  updateDirection(o.index)}
        >
          <TableSortLabel
            active={o.sortDirection !== null}
            direction={o.sortDirection || "asc"}
          >
            {o.sortDirection !== null ? <Star/> : <StarBorder/>}
          </TableSortLabel>
        </TableCell>,
        customBodyRender: (value, tableMeta, updateValue) => 
        <Badge color="primary" badgeContent={value.sum}>
          {value.checked ? <Star/> : <StarBorder/>}
        </Badge>
      }
    },
    {
      name: "favorite",
      options: {
        display: "false",
        filter: true,
      }
    },
    {
      name: "likeForColumn",
      options: {
        filter: false,
        sort: true,
        customHeadRender: (o, updateDirection) =>
        <TableCell
          align="left"
          sortDirection={o.sortDirection}
          onClick={() =>  updateDirection(o.index)}
        >
          <TableSortLabel
            active={o.sortDirection !== null}
            direction={o.sortDirection || "asc"}
          >
            {o.sortDirection !== null ? <ThumbUpAlt/> : <ThumbUpAltOutlined/>}
          </TableSortLabel>
        </TableCell>,
        customBodyRender: (value, tableMeta, updateValue) =>
        <Badge color="primary" badgeContent={value.sum}>
          {value.checked ? <ThumbUpAlt/> : <ThumbUpAltOutlined/>}
        </Badge>
      }
    },
    {
      name: "like",
      options: {
        display: "false",
        filter: true,
      }
    },
    {
      name: "title",
      label: "タイトル",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "description",
      label: "説明",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "owner",
      label: "オーナー",
      options: {
        filter: true,
        sort: false,
      }
    },
  ];

  interface CellData {
    id: string;
    favoriteForColumn: {
        checked: boolean;
        sum: number;
    };
    favorite: string;
    likeForColumn: {
      checked: boolean;
      sum: number;
    };
    like: string;
    title: string;
    description: string;
    owner: string;
    updateAt: string;
  }

  const { user, users, manuals, history, filter, filterReset } = props;
  if (user === null) { throw new Error('LoginUser cannot be null.') }

  const data: CellData[] = manuals
  .filter(m => filter === null || filter.id === m.categoryId)
  .map((m, i) => {
    const owner = users.find(u => u.id === m.ownerId)!;
    const isFavorite = m.favoriteIds.find(f => f === user.id) !== undefined;
    const isLike = m.likeIds.find(l => l === user.id) !== undefined;
    return {
      id: m.id,
      favoriteForColumn: {checked: isFavorite, sum: m.favoriteIds.length},
      favorite: isFavorite ? 'true' : 'false',
      likeForColumn: {checked: isLike, sum: m.likeIds.length},
      like: isLike ? 'true' : 'false',
      title: m.title,
      description: m.description,
      owner: `${owner.lastName} ${owner.firstName}`,
      updateAt: `2019/6/${i + 1}`
    };
  });

  const options: MUIDataTableOptions = {
    print: false,
    download: false,
    sortFilterList: false,
    selectableRows: false,
    elevation: 0,
    responsive: 'scroll',
    rowsPerPageOptions: [10,20,50],
    customSort: (d: {index: number; data: any[]}[], colIndex: number, order: string) => {
      console.log(order)
      return d.sort(
        (colIndex === 1 || colIndex === 3)
          ? (a, b) => (a.data[colIndex].sum < b.data[colIndex].sum ? -1 : 1) * (order === 'asc' ? 1 : -1)
          : (a, b) => (a.data[colIndex].localeCompare(b.data[colIndex]) ? -1 : 1) * (order === 'asc' ? 1 : -1))
    },
    onRowClick: (rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }) => {
      history.push(`/manual/${rowData[0]}`);
      filterReset();
    }
  };
  return (
    <MuiThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title="マニュアル一覧"
        data={data}
        columns={columns}
        options={options}
      />
    </MuiThemeProvider>
  );
};

function mapStateToProps(appState: AppState) {
  return {
    user: appState.loginUser.user!,
    ...appState.users,
    ...appState.manuals,
    ...appState.categories
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    filterReset: () => dispatch(categoriesAction.filterReset()),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));