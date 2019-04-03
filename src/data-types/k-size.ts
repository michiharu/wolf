import { Size } from "./tree-node";

export default interface KSize {
  unit: number,
  rect: Size,
  spr: Size,
  indent: number,
  fontSize: number,
  fontHeight: number,
  textline: number,
  icon: number,
  badgeFontSize: number,
  badgeFontHeight: number,
  cornerRadius: number,
}