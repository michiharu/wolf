import React, { useEffect, useState, useRef } from 'react';
import { pink, blue } from '@material-ui/core/colors';

import { connect } from 'react-redux';
import { LoginUserState } from '../../redux/states/main/loginUserState';
import { AppState } from '../../redux/store';
import MUIDataTable, { MUIDataTableOptions, MUIDataTableColumn } from 'mui-datatables';
import { Star, StarBorder, ThumbUpAlt, ThumbUpAltOutlined, Add } from '@material-ui/icons';
import { TableCell, TableSortLabel, createMuiTheme, Typography, Button, Box, CircularProgress, Badge, Hidden, Fab, Dialog } from '@material-ui/core';
import { MuiThemeProvider, makeStyles, Theme } from '@material-ui/core/styles';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { categoriesAction } from '../../redux/actions/main/categoriesAction';
import { Dispatch } from 'redux';
import { Action } from 'typescript-fsa';
import { CategoriesState } from '../../redux/states/main/categoriesState';
import { UsersState } from '../../redux/states/main/usersState';
import { drawerWidth } from '../layout/layout-component';
import { Manual } from '../../data-types/tree';
import { ManualsQueryParams, baseManualQueryParams, ManualsQueryResponse, manualsURL, Show } from '../../api/definitions';
import axios from '../../api/axios';
import { debounce } from 'lodash';
import Category from '../../data-types/category';
import CreateManualContainer from '../layout/create-manual/create-manual-container';
import { manualAction } from '../../redux/actions/main/manualsAction';
import { getTextLabels } from './text-labels';


const otherWidthSum = 800;

const useStyles = makeStyles((theme: Theme) => ({
  head: {
    position: 'sticky',
    backgroundColor: theme.palette.background.paper,
    top: 0,
    zIndex: 1000,
  },
  description: {
    width: `calc(100vw - ${otherWidthSum + drawerWidth}px)`,
    [theme.breakpoints.down('md')]: {
      width: `calc(100vw - ${otherWidthSum}px)`,
    },
  },
  date: {
    maxWidth: 90
  },
  extendedIcon: {
    marginLeft: theme.spacing(1),
  },
}));

interface Props extends
  LoginUserState,
  UsersState,
  CategoriesState,
  RouteComponentProps {
  filterSet: (category: Category) => Action<Category>;
  filterReset: () => Action<void>;
  clearSelectManual: () => Action<void>;
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
    },
    MUIDataTable: {
      responsiveScroll: {
        maxHeight: 'calc(100vh - 160px)',
      }
    },
  }
});

const Dashboard: React.FC<Props> = (props: Props) => {

  const favoriteColumn = 0;
  const likeColumn = 1;
  // const titleColumn = 2;
  // const ownerColumn = 3;
  const categoryColumn = 4;
  // const discriptionColumn = 5;
  // const updateAtColumn = 6;
  // const createAtColumn = 7;

  const favoriteColumnName = 'favorite';
  const favoriteFilterName = 'お気に入り登録済み';
  const unfavoriteFilterName = 'お気に入り未登録';

  const likeColumnName = 'like';  
  const likeFilterName = 'いいね登録済み';
  const unlikeFilterName = 'いいね未登録';

  const [isLoading, setLoading] = useState(false);
  const {
    filters: {favorite: baseFavorite, like: baseLike},
    searchText: baseSearchText,
    sortColumn: baseSortColumn,
    sortDirection: baseSortDirection,
    page: basePage,
    rowsPerPage: baseRowsPerPage,
  } = baseManualQueryParams;
  const [favorite, setFavorite] = useState(baseFavorite);
  const [like, setLike] = useState(baseLike);

  const [searchText, setSearchText] = useState(baseSearchText);
  const [sortColumn, setSortColumn] = useState(baseSortColumn);
  const [sortDirection, setSortDirection] = useState(baseSortDirection);
  const [page, setPage] = useState(basePage);
  const [rowsPerPage, setRowsPerPage] = useState(baseRowsPerPage);
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [count, setCount] = useState(0);

  const [isFirstRendering, setIsFirstRendering] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const categoryId = props.filter === null ? null : props.filter.id;
  useEffect(() => {
    if (!isFirstRendering) {
      props.clearSelectManual();
      setLoading(true);
      const params: ManualsQueryParams = {
        filters: {favorite, like, categoryId},
        searchText,
        sortColumn,
        sortDirection,
        page,
        rowsPerPage
      };


      axios
      .post<ManualsQueryResponse>(manualsURL, params)
      .then(res => {
        setIsFirstLoad(false);
        setLoading(false);
        setManuals(res.data.manuals);
        setCount(res.data.count);
      })
    }
    setIsFirstRendering(false);
    // eslint-disable-next-line
  }, [favorite, like, categoryId, searchText, sortColumn, sortDirection, page, rowsPerPage]);

  const changeFilter = (filterList: string[][]) => {
    const favoriteFilterList = filterList[favoriteColumn];
    const newFavoriteFilter = favoriteFilterList.length === 0 ? Show.ALL : 
                              favoriteFilterList.indexOf('true') >= 0 ? Show.CHECK : Show.UNCHECK;
    setFavorite(newFavoriteFilter);

    const likeFilterList = filterList[likeColumn];
    const newLikeFilter = likeFilterList.length === 0 ? Show.ALL : 
                          likeFilterList.indexOf('true') >= 0 ? Show.CHECK : Show.UNCHECK;
    setLike(newLikeFilter);

    const categoryFilterList = filterList[categoryColumn];

    if (categoryFilterList.length === 0) {
      props.filterReset();
    } else {
      const newCategory = props.categories.find(c => c.name === categoryFilterList[0])!
      props.filterSet(newCategory);
    }
  }

  const [currentSearchText, setCurrentSearchText] = useState<string>('');
  const debounced = useRef(
    debounce(
      (str: string) => setSearchText(
        str.split(/( |　)+/).filter(txt => txt.match(/( |　)/) === null && txt !== '')
      ),
      500
    )
  );
  useEffect(() => debounced.current(currentSearchText), [currentSearchText]);
  
  const changeSearchText = (searchText: string | null) => {
    setCurrentSearchText(searchText || '');
  };

  const onColumnSortChange = (colName: string, dirStr: string) => {
    const dir = dirStr === 'ascending' ? 'asc' : 'desc';
    setSortColumn(colName);
    setSortDirection(dir);
  }

  const changePage = (p: number) => {
    setPage(p)
  };

  const changeRowsPerPage = (rows: number) => {
    setRowsPerPage(rows);
  }

  const handleClickTitle = (id: string) => () => {
    history.push(`/manual/${id}/tree`);
    filterReset();
  }

  const classes = useStyles();

  const columns: MUIDataTableColumn[] = [
    {
      name: favoriteColumnName, // column: 0
      label: "お気に入り",
      options: {
        filter: true,
        filterOptions: {
          names: [favoriteFilterName, unfavoriteFilterName],
          logic(value: string, filters: string[]) { return false; }
        },
        sort: true,
        customHeadRender: (o, update) =>
        <TableCell className={classes.head} sortDirection={o.sortDirection} onClick={() => update(o.index)}>
          <TableSortLabel
            active={o.sortDirection !== null}
            direction={o.sortDirection || "asc"}
          >
            <StarBorder />
          </TableSortLabel>
        </TableCell>,
        customBodyRender: (value: { bool: boolean; sum: number; }) =>
        <Box display="flex" justifyContent="left">
          <Badge badgeContent={value.sum}>
            {value.bool ? <Star /> : <StarBorder />}
          </Badge>
        </Box>,
      }
    },
    {
      name: likeColumnName, // column: 2
      label: "いいね",
      options: {
        filter: true,
        filterOptions: {
          names: [likeFilterName, unlikeFilterName],
          logic(value: string, filters: string[]) { return false; }
        },
        sort: true,
        customHeadRender: (o, update) =>
        <TableCell className={classes.head} sortDirection={o.sortDirection} onClick={() => update(o.index)}>
          <TableSortLabel
            active={o.sortDirection !== null}
            direction={o.sortDirection || "asc"}
          >
            <ThumbUpAltOutlined />
          </TableSortLabel>
        </TableCell>,
        customBodyRender: (value: { bool: boolean; sum: number; }) =>
        <Box display="flex" justifyContent="left">
          <Badge badgeContent={value.sum}>
            {value.bool ? <ThumbUpAlt /> : <ThumbUpAltOutlined />}
          </Badge>
        </Box>,
      }
    },
    {
      name: "title", // column: 4
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
      name: "owner", // column: 5
      label: "オーナー",
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "category", // column: 6
      label: "カテゴリー",
      options: {
        filter: true,
        filterOptions: {
          names: props.categories.map(c => c.name),
          logic(value: string, filters: string[]) { return false; }
        },
        sort: false,
        customBodyRender: value => <Typography>{value.name}</Typography>
      }
    },
    {
      name: "description", // column: 7
      label: "説明",
      options: {
        filter: false,
        sort: false,
        customBodyRender: value => <Typography className={classes.description} noWrap>{value}</Typography>
      }
    },
    {
      name: "updateAt", // column: 8
      label: "更新日時",
      options: {
        filter: false,
        sort: true,
        sortDirection: 'desc',
        customBodyRender: value => <Typography className={classes.date}>{value}</Typography>

      }
    },
    {
      name: "createAt", // column: 9
      label: "作成日時",
      options: {
        filter: false,
        sort: true,
        customBodyRender: value => <Typography className={classes.date}>{value}</Typography>

      }
    },
  ];

  interface CellData {
    favorite: { bool: boolean; sum: number; };
    like: { bool: boolean; sum: number; };
    title: { id: string; title: string; };
    description: string;
    owner: string;
    category: Category;
    updateAt: string;
    createAt: string;
  }

  const { user, users, categories, history, filterReset } = props;
  if (user === null) { throw new Error('LoginUser cannot be null.') }

  const data: CellData[] = manuals
    .map((m, i) => {
      const owner = user.id === m.ownerId ? user : users.find(u => u.id === m.ownerId)!;
      const isFavorite = m.favoriteIds.find(f => f === user.id) !== undefined;
      const isLike = m.likeIds.find(l => l === user.id) !== undefined;
      return {
        favorite: { bool: isFavorite, sum: m.favoriteIds.length },
        like:     { bool: isLike,     sum: m.likeIds.length },
        title: { id: m.id, title: m.title },
        description: m.description,
        owner: `${owner.lastName} ${owner.firstName}`,
        category: categories.find(c => c.id === m.categoryId)!,
        updateAt: m.updateAt,
        createAt: m.createAt,
      };
    });

  const options: MUIDataTableOptions = {
    print: false,
    download: false,
    selectableRows: 'none',
    viewColumns: false,
    sortFilterList: false,
    elevation: 0,
    rowHover: false,
    responsive: 'scroll',
    serverSide: true,
    count,
    searchText: currentSearchText || '',
    rowsPerPageOptions: [10, 20, 50],
    onTableChange: (action, tableState) => {
      // console.log(action)
      switch (action) {
        
        case 'filterChange' :
          changeFilter(tableState.filterList);
          break;
        case 'search' :
          changeSearchText(tableState.searchText);
          break;
        case 'changePage':
          changePage(tableState.page);
          break;
        case 'changeRowsPerPage' :
          changeRowsPerPage(tableState.rowsPerPage);
          break;
      }
    },
    onColumnSortChange,
    textLabels: getTextLabels(isFirstLoad),
  };

  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  const title = (
    <Box display="flex" flexDirection="row" alignItems="center" py={2}>
      <Box mr={2}><Typography variant="h5">マニュアル一覧</Typography></Box>
      <Hidden lgUp implementation="css">
        <Box mr={2}>
          <Fab variant="extended" color="primary" onClick={handleOpen}>
            新規作成
            <Add className={classes.extendedIcon} />
          </Fab>
        </Box>
      </Hidden>
      {isLoading && <Box><CircularProgress size={24}/></Box>}
    </Box>
  );

  return (
    <>
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={title}
          data={data}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <CreateManualContainer onClose={handleClose}/>
      </Dialog>
    </>
  );
};

function mapStateToProps(appState: AppState) {
  return {
    user: appState.loginUser.user!,
    ...appState.users,
    ...appState.categories
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    filterSet: (category: Category) => dispatch(categoriesAction.filterSet(category)),
    filterReset: () => dispatch(categoriesAction.filterReset()),
    clearSelectManual: () => dispatch(manualAction.clear()),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));