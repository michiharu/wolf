export default interface Authority {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
} 

export type AuthType = 'canCreate' | 'canEdit' | 'canDelete';