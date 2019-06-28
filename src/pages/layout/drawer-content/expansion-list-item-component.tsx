import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Category from '../../../data-types/category';
import { ExpansionActions } from './expansion-list-item-container';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Manual } from '../../../data-types/tree';
import links from '../../../settings/links';

interface Props extends
  ExpansionActions,
  RouteComponentProps {
    filter: Category | null;
    category: Category;
    manuals: Manual[];
  }

function ExpansionListItemComponent(props: Props) {
  const { category: c, filter, manuals, filterSet, filterReset, location, history } = props;
  if (manuals === null) { throw new Error('Manual cannot be null.'); }

  const onClickCategory = () => {
    if (filter !== null && filter.id === c.id) {
      filterReset();
    } else {
      filterSet(c);
      if (location.pathname !== links.dashboard) {
        history.push(links.dashboard);
      }
    }
  }

  return (
    <>
      <ListItem button onClick={onClickCategory} selected={filter !== null && c.id === filter.id}>
        <ListItemText primary={c.name} />
      </ListItem>
    </>
  );
}

export default withRouter(ExpansionListItemComponent);