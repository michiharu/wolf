import * as React from 'react';
import { connect } from 'react-redux';
import { LoginUserState } from '../../redux/states/main/loginUserState';
import { ManualsState } from '../../redux/states/main/manualsState';
import { AppState } from '../../redux/store';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableColumn } from 'mui-datatables';
import { Star, StarBorder, ThumbUpAlt, ThumbUpAltOutlined } from '@material-ui/icons';
import { TableCell, TableSortLabel, createMuiTheme, Typography } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { theme } from '../..';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { categoriesAction } from '../../redux/actions/main/categoriesAction';
import { Dispatch } from 'redux';
import { Action } from 'typescript-fsa';
import { CategoriesState } from '../../redux/states/main/categoriesState';
import { UsersState } from '../../redux/states/main/usersState';

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
        paddingLeft: 8,
        paddingRight: 8
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
      name: "beforeSaving",
      options: {
        display: "false",
        filter: false,
      }
    },
    {
      name: "favorite",
      label: " ",
      options: {
        filter: true,
        sort: false,
        customBodyRender: value => value === 'true' ? <Star/> : <StarBorder/>
      }
    },
    {
      name: "favoriteSum",
      
      options: {
        filter: false,
        sort: true,
        customHeadRender: (o, update) =>
        <TableCell sortDirection={o.sortDirection} onClick={() => update(o.index)}>
          <TableSortLabel
            style={{transform: 'translateX(-34px)', zIndex: 2000}}
            active={o.sortDirection !== null}
            direction={o.sortDirection || "asc"}
          >
            <StarBorder/>
          </TableSortLabel>
        </TableCell>,
      }
    },
    {
      name: "like",
      label: " ",
      options: {
        filter: true,
        sort: false,
        customBodyRender: value => value === 'true' ? <ThumbUpAlt/> : <ThumbUpAltOutlined/>
      }
    },
    {
      name: "likeSum",
      label: "-",
      options: {
        filter: false,
        sort: true,
        customHeadRender: (o, update) =>
        <TableCell sortDirection={o.sortDirection} onClick={() => update(o.index)}>
          <TableSortLabel
            style={{transform: 'translateX(-34px)', zIndex: 2000}}
            active={o.sortDirection !== null}
            direction={o.sortDirection || "asc"}
          >
            <ThumbUpAltOutlined/>
          </TableSortLabel>
        </TableCell>,
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
        customBodyRender: value => <Typography style={{width: 'calc(40vw - 100px)'}} noWrap>{value}</Typography>
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
    beforeSaving: string;
    favorite: string;
    favoriteSum: string;
    like: string;
    likeSum: string;
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
      beforeSaving: m.beforeSaving ? 'true' : 'false',
      favorite: isFavorite ? 'true' : 'false',
      favoriteSum: String(m.favoriteIds.length),
      like: isLike ? 'true' : 'false',
      likeSum: String(m.likeIds.length),
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
    viewColumns: false,
    elevation: 0,
    responsive: 'scroll',
    rowsPerPageOptions: [10,20,50],
    onRowClick: (rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }) => {
      if (rowData[1] === 'false') {
        history.push(`/manual/${rowData[0]}`);
        filterReset();
      }
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