# Flow Like 開発環境の立ち上げ方

## How to use

SFSのgitサーバーからプロジェクトをクローンします。

```sh
git clone https://trac.sfsolutions.jp:55443/git/FlowLike/
```

Install it and run:

```sh
npm install
```

muidatatableというライブラリーの型定義ファイルを修正する必要があるので修正を行います。

```ts:node_modules/@types/mui-datatables/index.d.ts
// 43行目にMUIDataTableColumnOptionsを追加
interface MUIDataTableCustomHeadRenderer extends MUIDataTableColumn, MUIDataTableColumnOptions {
    index: number;
}
```

実行します。

```sh
npm run start
```
