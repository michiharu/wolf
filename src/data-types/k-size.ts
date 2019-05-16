import { Size } from "./tree";

export default interface KSize {
  unit: number,
  rect: Size,
  margin: Size,
  spr: Size,
  indent: number,
  fontSize: number,
  fontHeight: number,
  textline: number,
  icon: number,
  badgeFontSize: number,
  badgeFontHeight: number,
  cornerRadius: number,
  pointerSpace: number,
  pointerLength : number,
  pointerWidth : number
}