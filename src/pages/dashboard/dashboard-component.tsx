import React, { useEffect } from 'react';
import { pink, blue } from '@material-ui/core/colors';

import { connect } from 'react-redux';
import { LoginUserState } from '../../redux/states/main/loginUserState';
import { ManualsState } from '../../redux/states/main/manualsState';
import { AppState } from '../../redux/store';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableColumn } from 'mui-datatables';
import { Star, StarBorder, ThumbUpAlt, ThumbUpAltOutlined } from '@material-ui/icons';
import { TableCell, TableSortLabel, createMuiTheme, Typography, Button, Box } from '@material-ui/core';
import { MuiThemeProvider, makeStyles, Theme } from '@material-ui/core/styles';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { categoriesAction } from '../../redux/actions/main/categoriesAction';
import { Dispatch } from 'redux';
import { Action } from 'typescript-fsa';
import { CategoriesState } from '../../redux/states/main/categoriesState';
import { UsersState } from '../../redux/states/main/usersState';
import { selectActions } from '../../redux/actions/main/manualsAction';
import { drawerWidth } from '../layout/layout-component';

const otherWidthSum = 720;

const useStyles = makeStyles((theme: Theme) => ({
  description: {
    width: `calc(100vw - ${otherWidthSum + drawerWidth}px)`,
    [theme.breakpoints.down('sm')]: {
      width: `calc(100vw - ${otherWidthSum}px)`,
    },
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
  typography: {
    // fontSize: 12,
    button: {
        textTransform: "none"
    }
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

  const columns: MUIDataTableColumn[] = [
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
        customBodyRender: value =>
        <Box display="flex" justifyContent="center">
          {value === 'true' ? <Star /> : <StarBorder />}
        </Box>
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
        customBodyRender: value => <Typography align="center">{value}</Typography>
      }
    },
    {
      name: "like",
      label: "いいね",
      options: {
        filter: true,
        filterOptions: {
          names: ["いいね登録済み", "いいね未登録"],
          logic(value: string, filters: string[]) {
            const show =
              (filters.indexOf("いいね登録済み") >= 0 && value === 'true') ||
              (filters.indexOf("いいね未登録") >= 0 && value === 'false');
            const filtered = !show;
            return filtered;
          }
        },
        sort: false,
        customBodyRender: value =>
        <Box display="flex" justifyContent="center">
          {value === 'true' ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
        </Box>
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
        customBodyRender: value => <Typography align="center">{value}</Typography>
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
      name: "owner",
      label: "オーナー",
      options: {
        filter: true,
        sort: false,
      }
    },
    {
      name: "description",
      label: "説明",
      options: {
        filter: false,
        sort: false,
        customBodyRender: value => <Typography className={classes.description} noWrap>{value}</Typography>
      }
    },
    {
      name: "updateAt",
      label: "更新日時",
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: "createAt",
      label: "作成日時",
      options: {
        filter: false,
        sort: true,
      }
    },
  ];

  interface CellData {
    favorite: string;
    favoriteSum: string;
    like: string;
    likeSum: string;
    title: { id: string; title: string; };
    description: string;
    owner: string;
    updateAt: string;
    createAt: string;
  }

  const { user, users, manuals, history, filter, filterReset } = props;
  if (user === null) { throw new Error('LoginUser cannot be null.') }

  const data: CellData[] = manuals
    .filter(m => (filter === null || filter.id === m.categoryId))
    .map((m, i) => {
      const owner = user.id === m.ownerId ? user : users.find(u => u.id === m.ownerId)!;
      const isFavorite = m.favoriteIds.find(f => f === user.id) !== undefined;
      const isLike = m.likeIds.find(l => l === user.id) !== undefined;
      return {
        favorite: isFavorite ? 'true' : 'false',
        favoriteSum: String(m.favoriteIds.length),
        like: isLike ? 'true' : 'false',
        likeSum: String(m.likeIds.length),
        title: { id: m.id, title: m.title },
        description: m.description,
        owner: `${owner.lastName} ${owner.firstName}`,
        updateAt: m.updateAt,
        createAt: m.createAt,
      };
    });

  const options: MUIDataTableOptions = {
    print: false,
    download: false,
    sortFilterList: false,
    selectableRows: 'none',
    viewColumns: false,
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