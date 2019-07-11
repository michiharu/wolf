export default class Util {
  static isEmpty = (str: string): boolean => str.replace(/\n|\t|\f|\s|　/g, '') === '';
  
  static getID = (): string => `tmp:${String(Math.random()).slice(2)}`;

  static validPassword = (password: string): string | undefined => {
    const textRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])./;
    if (!textRegex.test(password)) { return "パスワードは大文字、小文字、数字を組み合わせて下さい"; }

    const lengthRegex = /^.{6,30}$/;
    if (!lengthRegex.test(password)) { return "パスワードは6~30文字である必要があります"; }

    return undefined;
  }
}