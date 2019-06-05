import User from '../../../data-types/user';

export const user1: User = {
  id: '1',
  lastName: '山田',
  firstName: '太郎',
  userManagement: {canCreate: true, canEdit: true, canDelete: true},
  groupManagement: {canCreate: true, canEdit: true, canDelete: true}
};

export const user2: User = {
  id: '2',
  lastName: '佐藤',
  firstName: '花子',
  userManagement: {canCreate: true, canEdit: true, canDelete: false},
  groupManagement: {canCreate: true, canEdit: true, canDelete: true}
};

export const user3: User = {
  id: '3',
  lastName: '江戸川',
  firstName: 'コナン',
  userManagement: {canCreate: false, canEdit: false, canDelete: false},
  groupManagement: {canCreate: false, canEdit: false, canDelete: false}
};

export const user4: User = {
  id: '4',
  lastName: '毛利',
  firstName: '小五郎',
  userManagement: {canCreate: false, canEdit: false, canDelete: false},
  groupManagement: {canCreate: false, canEdit: false, canDelete: false}
};