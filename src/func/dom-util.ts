export default class DOMUtil {
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