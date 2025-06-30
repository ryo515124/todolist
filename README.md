# ToDo List App

udemyのWeb Developer Bootcampという講座を受講後のアウトプットとしてToDoListを作りました。Node.js と MongoDB（Mongoose）を使った ToDo リストアプリです。タスクの登録・編集・削除・表示ができます。まだ製作段階で、画面のデザインや他の機能も追加する予定です。READ.MEはまだgithubに使い慣れていなくて、ChatGPTで生成しました。

## デプロイ先

- [Heroku での動作確認はこちら](https://immense-brook-28283-458436aee5a0.herokuapp.com)
- 無料枠でスリープ機能があるため、初回アクセスが遅い場合があります。

## 🔧 使用技術

- Node.js
- Express
- MongoDB / Mongoose
- EJS（テンプレートエンジン）

## 📦 インストール手順

```bash
git clone https://github.com/ryo515124/todolist.git
cd todolist
npm install

🚀 起動方法
npm start
ブラウザで http://localhost:3000 にアクセス。
※ MongoDB がローカルで起動している必要があります。

📁 ディレクトリ構成（概要）
models/：Mongoose スキーマ

routes/：ルーティング

views/：EJS テンプレート

index.js：エントリーポイント

📝 ライセンス
MIT
