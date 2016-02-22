```
# common
npm install

#dev
npm start

# test redis
redis-cli
PUBLISH "create_msg" "{\"id\":100,\"mes_type\":\"system\",\"contents\":\"hi!\",\"chat_name\":\"tanaka\"}"

# production
npm install pm2 -g
pm2 start index.js --interpreter ./node_modules/.bin/babel-node
pm2 list
pm2 stop :id
```
