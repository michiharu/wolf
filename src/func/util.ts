export default class Util {
  static isEmpty = (str: string): boolean => str.replace(/\n|\t|\f|\s|　/g, '') === '';
  static getID = (): string => String(Math.random()).slice(2);
}