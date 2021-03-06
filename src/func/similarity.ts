import { NodeWithSimilarity, Tree } from "../data-types/tree";
import textDistPercent from "./text-dist";

export default class SimilarityUtil {

  static get = (target: Tree, nodeList: Tree[]): NodeWithSimilarity[] => {
    return nodeList.map(n => ({
      ...n,
      _label: textDistPercent(target.label, n.label),
      _input: textDistPercent(target.input[0], n.input[0]),
      _output: textDistPercent(target.output, n.output),
      _childrenLength: (() => {
        const short = Math.min(target.children.length, n.children.length);
        const long = Math.max(target.children.length, n.children.length);
        return short / long * 100;
      })(),
    }));
  }
}