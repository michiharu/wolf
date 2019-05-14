import Authority from "./authority";

export default interface User {
  id: string;
  lastName: string;
  firstName: string;
  userManagement: Authority;
  groupManagement: Authority;
  isOperationManager: boolean;
}