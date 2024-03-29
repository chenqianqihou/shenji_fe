import { IConfig, IPlugin } from 'umi-types';

import defaultSettings from './defaultSettings';
// https://umijs.org/config/
import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        { path: '/user', redirect: '/user/login' },
        { path: '/user/login', name: 'login', component: './user/login' },
        // { path: '/user/register', name: 'register', component: './User/Register' },
        // {
        //   path: '/user/register-result',
        //   name: 'register.result',
        //   component: './User/RegisterResult',
        // },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        {
          path: '/',
          name: 'index',
          icon: 'home',
          component: './index/Index',
        },
        { 
          path: '/role/center', 
          name: '个人中心', 
          component: './center' ,
          hideInMenu:true,
        },
        {
          //项目管理
          path: '/project',
          name: 'project',
          icon: 'project',
          // component: './project/ProjectManage',
          routes: [
            //项目管理详情
            {
              path: '/project/detail',
              name: 'projectDetail',
              component: './project/detail',
            },
            //项目管理录入
            {
              path: '/project/edit',
              name: 'projectEdit',
              component: './project/edit',
            },
          ]
        },
        {
          path: '/result',
          // 角色管理
          name: 'result',
          icon: 'profile',
          component: './result/ResultManage',
        },
        {
          path: '/analysis',
          // 角色管理
          name: 'analysis',
          icon: 'area-chart',
          routes: [
            {
              path: '/analysis/project',
              name: 'project',
              component: './analysis/ProjectAnalysis',
            },
            {
              path: '/analysis/user',
              name: 'role',
              component: './analysis/RoleAnalysis',
            },
          ]
        },
        {
          path: '/setting',
          name: 'setting',
          icon: 'setting',
          routes: [
            {
              path: '/setting/user',
              name: 'role',
              component: './setting/RoleSetting',
            },
            // {
            //   path: '/setting/assign',
            //   name: 'assign',
            //   component: './setting/RoleAssign',
            // },
            {
              path: '/setting/auth',
              name: 'auth',
              component: './setting/AuthSetting',
            },
            {
              path: '/setting/org',
              name: 'org',
              component: './setting/mechanism/list/index',
            },
            {
              path: '/setting/check',
              name: 'check',
              component: './setting/CheckManage',
            },
            //新建人员，修改人员
            {
              path: '/setting/roleEdit',
              name: 'roleEdit',
              component: './setting/role/roleEdit',
              hideInMenu:true,
            },
            //人员信息展示
            {
              path: '/setting/roleShow',
              name: 'roleShow',
              component: './setting/role/roleShow',
              hideInMenu:true,
            },
            //机构新建，修改
            {
              path: '/setting/mechanism/edit',
              name: 'mechanismEdit',
              component: './setting/mechanism/edit',
              hideInMenu:true,
            },
            //机构展示
            {
              path: '/setting/mechanism/show',
              name: 'mechanismShow',
              component: './setting/mechanism/show',
              hideInMenu:true,
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    '/api/': {
      target: 'http://39.106.225.194:80/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
} as IConfig;
