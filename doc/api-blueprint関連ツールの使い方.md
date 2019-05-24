# api blueprint関連ツールの使い方

## htmlファイルを出力する

~~~
aglio -i ./doc/api.apib -o ./doc/api.html
~~~
---

## ブラウザーを自動更新しながら編集する（更新は保存時）

~~~
aglio -i ./doc/api.apib -s
~~~
---

## API モックサーバーを起動する

~~~
drakov -f "doc/*.apib" --watch -p 3001 --autoOptions
~~~

|オプション|機能|
|:--|--:|
|--watch|自動更新|
|-p |ポート設定|
|--autoOptions |CORS対応|

---