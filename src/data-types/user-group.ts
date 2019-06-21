import Authority from "./authority";

export default interface UserGroup {
  id: string;
  name: string;
  memberIds: string[];
}