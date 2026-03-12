<!-- intelligent-community-admin: originally initialized from main branch -->

<p align="center">
<img alt="logo" src="https://oscimg.oschina.net/oscnet/up-d3d0a9303e11d522a06cd263f3079027715.png">
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">RuoYi v3.9.1</h1>
<h4 align="center">基于 Vue3 + TypeScript + Vite + Element Plus 的前端管理系统（intelligent-community-admin）</h4>

> 源码来源：https://gitcode.com/yangzongzhuan/RuoYi-Vue3/tree/typescript

---

## 快速运行

```bash
# 1. 克隆并切换分支
git clone https://github.com/overbearingceofirst/intelligent-community-admin.git
git checkout feat/vue3-admin-template

# 2. 安装依赖
npm install

# 3. 启动开发服务器（默认代理 /api -> http://localhost:3000）
npm run dev

# 4. 构建生产产物
npm run build:prod
```

## 适配说明

- **Vite Dev Proxy**：`/api` 请求自动转发到 `http://localhost:3000`，对接 `intelligent-community-node` 后端。
- **环境变量示例**：`.env.development` 与 `.env.production` 中 `VITE_APP_BASE_API` 分别设为 `/api` 与 `/api`。
- **Axios 响应适配**：`src/utils/request.ts` 已适配后端通用返回结构 `{ code, msg, data }`，自动注入 `Authorization: Bearer <token>`（token 优先从 `localStorage` 读取），收到 `401` 时自动跳转 `/login`。
- **Dockerfile**：多阶段构建，先 `npm run build:prod`，再用 nginx 提供静态产物。
- **CI**：`.github/workflows/ci.yml` 包含 checkout → install → build → lint 步骤。

## 新增 / 调整文件列表

| 文件 | 说明 |
|------|------|
| `.env.development` | 开发环境变量，`VITE_APP_BASE_API=/api` |
| `.env.production` | 生产环境变量，`VITE_APP_BASE_API=/api` |
| `vite.config.ts` | 新增 `/api` proxy → `http://localhost:3000` |
| `src/utils/request.ts` | token 注入（localStorage）+ 401 跳转 `/login` |
| `Dockerfile` | 多阶段构建（node build → nginx serve） |
| `.github/workflows/ci.yml` | GitHub Actions CI 流水线 |

## 后续建议

- 按 `intelligent-community-node` 实际 API 路径进一步调整 `src/api/` 中的接口定义；
- 加入 `husky` + `lint-staged` 实现提交时代码检查；
- 完善 CI/CD 部署流程（自动部署到测试/生产环境）；
- 根据需要引入 i18n 多语言支持；
- 在 `nginx.conf` 中按需配置缓存策略与 HTTPS。

## 技术栈

- Vue 3 + TypeScript
- Vite 6
- Element Plus
- Pinia
- Vue Router
- Axios

## 原始项目说明

本前端基于 [RuoYi-Vue3 typescript 分支](https://gitcode.com/yangzongzhuan/RuoYi-Vue3/tree/typescript) 引入，遵循其 MIT 许可证。
