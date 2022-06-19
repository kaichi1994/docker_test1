# dockerHubから持ってくるImageの指定
FROM node:16.13.1-alpine3.13
# ローカル側のファイルをdocker内にコピーする
COPY ./front /front
# docker内に入った時の初期パスの指定
WORKDIR /front
# パッケージをインストール
RUN npm install
# コンテナの使用ポート指定
EXPOSE 3000
# コンテナが勝手に終了してしまわないようにする設定
ENV CI true
CMD npm start