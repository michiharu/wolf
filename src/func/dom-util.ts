export default class DOMUtil {
  // input要素でtype="number"を指定した時の便利関数
  // 数字以外を受け取ってら何もせず、数字を受け取った時のみ渡された関数を実行する
  static receiveNumber = (e: any, onSuccess: (num: number) => void, min?: number, max?: number) => {
    const value = e.target.value;
    const num = Number(value.length !== 0 ? e.target.value : min);
    if (isNaN(num)) { return; }
    if (min !== undefined && num < min) { return; }
    if (max !== undefined && max < num) { return; }
    if (isNaN(num)) { return; }
    onSuccess(num);
  }
}