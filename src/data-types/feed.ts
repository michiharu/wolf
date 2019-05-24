import Authority from "./authority";
import { Manual } from "./tree";

export default interface Feed {
  id: string;
  title: string;
  isAlreadyRead: boolean;
  manualId: string;
}