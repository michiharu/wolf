import React, { useEffect, useState } from 'react';
import { pink, blue } from '@material-ui/core/colors';

import { connect } from 'react-redux';
import { LoginUserState } from '../../redux/states/main/loginUserState';
import { ManualsState } from '../../redux/states/main/manualsState';
import { AppState } from '../../redux/store';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableColumn } from 'mui-datatables';
import { Star, StarBorder, ThumbUpAlt, ThumbUpAltOutlined, VisibilityOff, Visibility } from '@material-ui/icons';
import { TableCell, TableSortLabel, createMuiTheme, Typography, Button, IconButton, TableRow } from '@material-ui/core';
import { MuiThemeProvider, makeStyles, Theme } from '@material-ui/core/styles';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { categoriesAction } from '../../redux/actions/main/categoriesAction';
import { Dispatch } from 'redux';
import { Action } from 'typescript-fsa';
import { CategoriesState } from '../../redux/states/main/categoriesState';
import { UsersState } from '../../redux/states/main/usersState';
import { selectActions } from '../../redux/actions/main/manualsAction';

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    width: '100%',
    // width: 'calc(100vw - 750px)',
    // [theme.breakpoints.down('sm')]: {
    //   width: 'calc(100vw - 450px)',
    // },
  },
}));

interface Props extends
  LoginUserState,
  UsersState,
  ManualsState,
  CategoriesState,
  RouteComponentProps {
  filterReset: () => Action<void>;
  clearSelect: () => Action<void>;
}

const getMuiTheme = () => createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
  },
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
  useEffect(() => {
    props.clearSelect()
  }, [props]);

  const classes = useStyles();
  if ( classes !== null ){}

  const handleClickTitle = (id: string) => () => {
    history.push(`/manual/${id}`);
    filterReset();
  }

  const handleClickVisibleRow = (value: {id: string, visible: boolean}) => () => {

  }

  const columns: MUIDataTableColumn[] = [
    {
      name: "visible",
      options: {
        display: "false",
        filter: false,
        sort: false,
        customHeadRender: () =>
          <TableCell>
            <IconButton>
              <Visibility/>
            </IconButton>
          </TableCell>,

        customBodyRender: value =>
          <IconButton onClick={handleClickVisibleRow(value)}>
            {value.visible ? <Visibility /> : <VisibilityOff />}
          </IconButton>
      }
    },
    {
      name: "favorite",
      label: "お気に入り",
      options: {
        filter: true,
        filterOptions: {
          names: ["お気に入り登録済み", "お気に入り未登録"],
          logic(value: string, filters: string[]) {
            const show =
              (filters.indexOf("お気に入り登録済み") >= 0 && value === 'true') ||
              (filters.indexOf("お気に入り未登録") >= 0 && value === 'false');
            const filtered = !show;
            return filtered;
          }
        },
        sort: false,
        customBodyRender: value => value === 'true' ? <Star /> : <StarBorder />
      }
    },
    {
      name: "favoriteSum",
      label: "お気に入り数",
      options: {
        filter: false,
        sort: true,
        customHeadRender: (o, update) =>
          <TableCell sortDirection={o.sortDirection} onClick={() => update(o.index)}>
            <TableSortLabel
              active={o.sortDirection !== null}
              direction={o.sortDirection || "asc"}
            >
              <StarBorder />
            </TableSortLabel>
          </TableCell>,
      }
    },
    {
      name: "like",
      label: "いいね",
      options: {
        filter: true,
        sort: false,
        customBodyRender: value => value === 'true' ? <ThumbUpAlt /> : <ThumbUpAltOutlined />
      }
    },
    {
      name: "likeSum",
      label: "いいね数",
      options: {
        filter: false,
        sort: true,
        customHeadRender: (o, update) =>
          <TableCell sortDirection={o.sortDirection} onClick={() => update(o.index)}>
            <TableSortLabel
              active={o.sortDirection !== null}
              direction={o.sortDirection || "asc"}
            >
              <ThumbUpAltOutlined />
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
        customBodyRender: value =>
          <Button size="small"color="primary" onClick={handleClickTitle(value.id)}>
            <Typography noWrap>{value.title}</Typography>
          </Button>
      }
    },
    {
      name: "description",
      label: "説明",
      options: {
        display: "false",
        filter: false,
        sort: false,
        viewColumns: false,
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
    visible: { id: string; visible: boolean; };
    favorite: string;
    favoriteSum: string;
    like: string;
    likeSum: string;
    title: { id: string; title: string; };
    description: string;
    owner: string;
    updateAt: string;
  }

  const { user, users, manuals, history, filter, filterReset } = props;
  if (user === null) { throw new Error('LoginUser cannot be null.') }

  const [showUnVisible, setShowUnVisible] = useState(false);
  const data: CellData[] = manuals
    .filter(m => (filter === null || filter.id === m.categoryId) && (showUnVisible || m.visible))
    .map((m, i) => {
      const owner = user.id === m.ownerId ? user : users.find(u => u.id === m.ownerId)!;
      const isFavorite = m.favoriteIds.find(f => f === user.id) !== undefined;
      const isLike = m.likeIds.find(l => l === user.id) !== undefined;
      return {
        visible: { id: m.id, visible: m.visible },
        favorite: isFavorite ? 'true' : 'false',
        favoriteSum: String(m.favoriteIds.length),
        like: isLike ? 'true' : 'false',
        likeSum: String(m.likeIds.length),
        title: { id: m.id, title: m.title },
        description: m.description,
        owner: `${owner.lastName} ${owner.firstName}`,
        updateAt: `2019/6/${i + 1}`
      };
    });

  const options: MUIDataTableOptions = {
    print: false,
    download: false,
    sortFilterList: false,
    selectableRows: 'none',
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      const colSpan = rowData.length + 1;
      console.log(rowData);
      console.log(rowMeta);
      return (
        <TableRow>
          <TableCell colSpan={colSpan}>
            {rowData[6]}
          </TableCell>
        </TableRow>
      )
    },
    onColumnViewChange(changedColumn: string, action: string) {
      console.log(changedColumn)
      console.log(action)
      if (changedColumn === 'visible') {
        setShowUnVisible(action === 'add');
      }
    },
    elevation: 0,
    rowHover: false,
    responsive: 'scroll',
    rowsPerPageOptions: [10, 20, 50],
  };

  return (
    <MuiThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title="マニュアル一覧"
        data={data.concat()}
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
    clearSelect: () => dispatch(selectActions.clear()),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));