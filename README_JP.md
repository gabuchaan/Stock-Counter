
# Stock Counter

## 概要
Stock Counterは、WindowsとMac用のシンプルな在庫管理用デスクトップアプリです。このアプリを使用することでユーザーは商品のストックを一目で確認することができます。また商品ごとに最低必要数を設定することができ、最低必要数を下回っているプロダクトを一覧表示する機能を使うことで発注漏れを防ぐことができます。

## 使用技術
* Node.js
* Electron
* Sqlite
* HTML
* Tailwind CSS
* CSS
* JavaScript

## インストール方法
* ### Windows
     こちらのリンクからインストーラーをダウンロードできます。Microsoft Defender SmartScreenが警告を表示する場合があります。
     [Stock Counter for windows](https://github.com/gabuchaan/Stock-Counter/releases/tag/v1.0.0)
* ### Mac
　　__Macの場合はNode.jsがインストールされている必要があります。__
   
1. このリポジトリをクローンします。
   ```
   git clone https://github.com/gabuchaan/Stock-Counter.git
   ```
3. npmをインストールします。
   ```
   npm install
   ```
5. アプリをビルドします。
   ```
   node_modules/.bin/electron-builder --mac --x64
   ```
7. プロジェクト内のdistフォルダ内に __Stock_counter-1.0.0.dmg__ (インストーラー)が作成されます。
   

## 使用方法

* ### カテゴリー作成
Stock Counterのメイン画面からカテゴリーを作成します。メニューバーの「Category」をクリックし、「Add category」を選択します。カテゴリー名を入力して作成できます。

* ### プロダクト作成
カテゴリー一覧画面からプロダクトを追加したいカテゴリーを選択し、＋アイコンをクリックします。プロダクトの詳細情報を入力するとプロダクトがそのカテゴリー内に作成されます。

* ### プロダクト編集
プロダクトのストック数、最低ストック数、画像を変更できます。カテゴリー一覧画面から変更したいプロダクトを選択し、「Detail」をクリックします。変更したい情報を入力し、「Change」をクリックします。

* ### 表示変更
カードビューとリストビューの変更ができます。リストビューでは直接ストックの増減が可能です。

* ### フィルタリング
最低必要数を下回っているプロダクトを一覧表示します。メニューバーの「プロダクト」をクリックし、「在庫切れプロダクト」を選択します。在庫切れのプロダクトが表示されます。
