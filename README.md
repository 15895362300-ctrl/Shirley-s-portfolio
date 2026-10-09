# Shirley’s Portfolio

本仓库同步原作品集的已发布内容，保留页面、文案、样式、图片、案例和演示原型。

原站：https://ai-story-portfolio.citrus-moon-5505.chatgpt.site

## 本地预览

```sh
python3 -m http.server 8080 --directory dist
```

## 源码

- `dist/`：完整发布文件。
- `src/`：首页 React 组件源代码。
- `build.mjs`：首页组件构建脚本；需要更新组件时执行 `npm ci` 与 `npm run build`。
- `dist/auction/`、`dist/paint-app/`、`dist/inches-agent/`：独立案例和演示页面。

网站为只读作品集，已移除履历及内容编辑入口、编辑表单、保存与导入功能。已有浏览器草稿不会被删除；后续内容更新通过源码修改并发布。演示数据不代表真实交易。

## GitHub Pages

在仓库 Settings → Pages 中使用 GitHub Actions 作为发布来源。
推送至 `main` 时，工作流原样发布 `dist/`，不重新构建或改写页面。

原始来源提交：`d408fad0c69bb500877bd025c9bda9b96d04062a`。
