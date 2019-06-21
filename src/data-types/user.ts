import Authority from "./authority";

export default interface User {
  id: string;
  lastName: string;
  firstName: string;
}

export interface LoginUser extends User {
  mail: string;
}