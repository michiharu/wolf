import Authority from "./authority";

export default interface User {
  id: string;
  lastName: string;
  firstName: string;
  userManagement: Authority;   // ユーザー管理権限
  groupManagement: Authority;  // グループ管理権限
  isOperationManager: boolean; // 運用権限
  canPullRequest: boolean;     // プルリク権限
  starIds: string[];           // お気に入り登録しているID
}