# Niconicoment
プレゼンターが（Web会議システムで画面共有した）ブラウザ上に、  
参加者から送られてきたコメントをニコニコ動画風に表示する機能を提供する

https://rinoguchi.net/2020/12/niconico-coment-on-browser.html

構成は以下の通り
* Chrome拡張
    * プレゼンターが利用する
    * ミーティング（WebSocket通信）を開始し、参加者用URLを作成する
    * 参加者からサーバ経由で送られてきたコメントをブラウザ上に表示する
* Express（Node.js）on GAE
    * WebSocket通信で参加者からのコメントを受付ける
    * WebSocket通信でプレゼンターにコメントを送信する
    * 参加者がコメントを入力するための静的Webページを提供する

## 環境構築手順

### client（Chrome拡張）
* 事前インストール
    ```sh
    npm install webpack -g
    npm install webpack-cli -g
    ```
* nodeモジュールのインストール
    ```
    cd client
    npm install
    ```
* webpackでchrome拡張をビルド
    ```sh
    webpack
    ```
* 拡張機能のインストール
    * 今のところはストアに申請してないため、ソースコードを直接読み込む形式とする
    * Chrome -> 拡張機能の管理 -> パッケージ化されてない拡張機能を読み込む -> `${project-dir}/client/dist` を指定

### server側（GAE）
* gcloud SDKをインストール
    * https://cloud.google.com/sdk/docs/install#mac
* プロジェクト作成
    ```sh
    cd server
    gcloud projects create niconicoment --set-as-default
    ```
* 作成されたプロジェクトを確認
    ```sh
    gcloud projects describe niconicoment
    ```
 * GAEアプリケーションを初期化
    ```sh
    gcloud app create --project=niconicoment
    ```
* 対象プロジェクトの課金を有効化
    * https://console.cloud.google.com/projectselector/billing
* アプリのデプロイ
    ```sh
    gcloud app deploy
    ```
* アプリの無効化
    * https://console.cloud.google.com/appengine/settings?hl=ja&project=niconicoment
        * `アプリケーションを無効にする`
        * 再起動する場合は、同じ画面で`アプリケーションを有効にする`
