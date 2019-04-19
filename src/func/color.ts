import { Theme, PropTypes } from "@material-ui/core";
import { PaletteColor } from "@material-ui/core/styles/createPalette";

export default class ColorUtil {
  static getBase = (theme: Theme, color: PropTypes.Color, on: boolean): string => {
    return color === 'primary'
    ? on ? theme.palette.primary.dark : theme.palette.primary.main
    : on ? theme.palette.secondary.dark : theme.palette.secondary.main;
  }
}