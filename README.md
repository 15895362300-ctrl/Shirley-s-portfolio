# Shirley’s Portfolio

个人作品集：首页、履历、项目目录、精选项目与联系方式，以及各项目独立案例页。

## 本地运行

静态页面已保存在 `dist/`，可直接通过 HTTP 服务预览：

```sh
python3 -m http.server 8080 --directory dist
```

打开 http://localhost:8080 。

## 更新首页组件

```sh
npm ci
npm run build
```

`src/` 为首页 React 组件源代码，`build.mjs` 输出至 `dist/hero.js` 与 `dist/hero.css`。其他页面为可直接编辑的 HTML、CSS 与 JavaScript。

## 内容维护

- `dist/project-catalog.js`：项目名称、简介与默认图片。
- `dist/app.js`：页面切换、卡片交互与本机内容编辑。
- `dist/project-navigation.js`：项目间导航。
- `dist/auction/`：收藏拍卖小程序案例及演示原型。
- `dist/paint-app/`：涂装辅助 APP 案例。

页面编辑功能保存在当前浏览器，不会自动写回 GitHub。原型中的示例金额、拍品与演示数据不代表真实交易。

## 部署

静态发布目录为 `dist/`。原网站的托管账户配置和访问凭据不包含在迁移文件中。仓库同步本身不会改变原网站地址或可见范围。
