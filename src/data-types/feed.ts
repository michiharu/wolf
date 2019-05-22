import Authority from "./authority";
import { Manual } from "./tree";

export default interface Feed {
  id: string;
  title: string;
  contents: string;
  manual: Manual; // childrenは空の配列で問題ない
}