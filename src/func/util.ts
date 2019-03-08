export default class Util {

  static isEmpty = (str: string): boolean => str.replace(/\n|\t|\f|\s|　/g, '') === '';
}