#!/bin/bash

git pull
echo "🍓🍓🍓新的代码已拉取🍓🍓🍓"
npm run build
echo "🍓🍓🍓新版本构建完成🍓🍓🍓"
rm -rf /usr/share/nginx/html/dist
echo "🍓🍓🍓旧版本已删除🍓🍓🍓"
cp -r ./dist /usr/share/nginx/html/
echo "🍉🍉🍉新版本已发布🍉🍉🍉"