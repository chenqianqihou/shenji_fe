## 开始

### Install

```bash
# 使用taobao镜像会快一点
npm install  --registry=https://registry.npm.taobao.org

# 如果报无权限的错误:
sudo chown -R user ~/.npm  # user替换为你的用户名
```

or

```bash
yarn
```

### Start

```shell
npm start
```

## 页面路径

页面都在`src/pages/`下

- index/Index 主页

- project/PorjectManager 审计项目管理
- setting/SettingIndex 配置首页
- setting/AuthSetting 权限配置
- setting/OrgSetting 机构配置
- setting/RoleSetting 角色配置
- setting/UserSetting 用户配置

## 版本

react@16.8.6

redux@4.0.1

umi@2.7.2

dva@2.4.1

antd@3.19.2

## 命令

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).
