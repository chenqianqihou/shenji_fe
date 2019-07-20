#!/bin/bash

rm -rf /usr/share/nginx/html/dist
echo "旧的静态资源已删除"
git checkout master
git pull
echo "新的代码已拉取"
npm run build
cp -r ./dist /usr/share/nginx/html/