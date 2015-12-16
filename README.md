```
npm install        # bundle install的なやつ
npm install pm2 -g # pm2...unicorn的なやつ、グローバルにインストール
pm2 start main.js  # プロセス起動
pm2 list           # 動いているプロセスを確認
pm2 stop :id       # プロセス停止
```
