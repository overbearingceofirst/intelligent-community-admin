# intelligent-community-admin

> 基于 [RuoYi-Vue3 (TypeScript 分支)](https://gitcode.com/yangzongzhuan/RuoYi-Vue3/tree/typescript) 的智能社区后台管理前端，对接 intelligent-community-node 后端。

---

## 快速开始

### 前置条件

- Node.js >= 18
- 包管理器：`npm`、`yarn` 或 `pnpm`（项目默认使用 `npm`）
- 后端服务（intelligent-community-node）运行于 `http://localhost:3000`

### 安装与运行

```bash
# 1. 克隆仓库并切换到分支
git clone https://github.com/overbearingceofirst/intelligent-community-admin.git
cd intelligent-community-admin
git checkout feat/vue3-admin-template

# 2. 安装依赖（任选其一）
npm install
# 或 yarn
# 或 pnpm install

# 3. 本地开发（dev server，带 proxy 转发到 Node 后端）
npm run dev
# 访问 http://localhost:80

# 4. 构建生产包
npm run build:prod
# 产物在 dist/ 目录

# 5. 预览生产构建
npm run preview
```

### 脚本说明

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动本地开发服务（端口 80，含 proxy） |
| `npm run build:prod` | 生产环境构建 |
| `npm run build:stage` | staging 环境构建 |
| `npm run preview` | 预览生产构建产物 |

---

## 环境配置

### 开发环境 `.env.development`

```
VITE_APP_TITLE = 智能社区管理系统
VITE_APP_ENV = 'development'
VITE_APP_BASE_API = /dev-api
```

开发时，前端请求 `/dev-api/*` 会经由 Vite dev-server proxy 转发到 `http://localhost:3000/api/*`（见 `vite.config.ts` 中的 `baseUrl` 变量）。

**修改后端地址**：打开 `vite.config.ts`，将顶部 `const baseUrl = 'http://localhost:3000'` 改为你的后端地址即可。

### 生产环境 `.env.production`

```
VITE_APP_TITLE = 智能社区管理系统
VITE_APP_ENV = 'production'
VITE_APP_BASE_API = /api
```

生产环境下，接口路径为 `/api/*`，通常通过 Nginx 反代到 Node 后端（见下方 Nginx 配置示例）。

---

## Docker 部署

### 构建并运行

```bash
# 构建镜像
docker build -t intelligent-community-admin .

# 运行（映射到宿主机 8080 端口）
docker run -d -p 8080:80 intelligent-community-admin
```

### Nginx 反代示例（生产）

在 Docker 容器或独立 Nginx 中配置将 `/api` 代理到 Node 后端：

```nginx
location /api/ {
    proxy_pass http://node-backend:3000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 技术选型说明

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | ^3.5 | Composition API + `<script setup>` |
| TypeScript | ^5.6 | 全量类型支持 |
| Vite | ^6 | 极速热更新，ESM 原生构建 |
| Element Plus | ^2.13 | 完整 Admin 组件生态 |
| Pinia | ^3 | 轻量状态管理，TypeScript 友好 |
| vue-router | ^4.6 | 动态路由 + 权限守卫 |
| axios | ^1.13 | HTTP 请求封装，含 Token 注入与 401 跳转 |

**为什么选用 RuoYi-Vue3 (TypeScript)**：
- 功能完整：内置登录/权限/菜单/用户/角色等 RBAC 体系，开箱即用。
- TypeScript 分支：全量 TS，代码可维护性更高。
- 与 intelligent-community-node 对接：后端返回 `{ code, msg, data }` 结构，RuoYi 的 `request.ts` 已完整适配此格式，含 Token 注入（`Authorization: Bearer <token>`）、401 自动弹出重登录、500/601 错误提示等。

**已做适配**：
- `vite.config.ts`：`baseUrl` 由原来的 `http://localhost:8080`（Java 后端）改为 `http://localhost:3000`（Node 后端）；`/dev-api` proxy rewrite 规则改为 `/api`（Node 后端路由前缀）。
- `.env.development`/`.env.production`：标题改为"智能社区管理系统"，生产环境 `VITE_APP_BASE_API` 改为 `/api`。
- `src/utils/request.ts`：保留原有完整适配，含 `{ code, msg, data }` 响应解析、Token Bearer 注入、401 重登录、500/601 错误通知。

---

## 后续建议

- [ ] 根据 `intelligent-community-node` 的实际 API 路径/字段调整 `src/api/` 下的接口文件
- [ ] 配置 CI/CD 自动部署（GitHub Actions + Docker）
- [ ] 加入 husky + lint-staged 做 pre-commit 代码检查
- [ ] 按需接入 i18n（vue-i18n）实现多语言支持
- [ ] 按项目实际需求裁剪或扩展 RuoYi 的菜单/权限/代码生成等模块
- [ ] 生产环境配置 HTTPS 和 Nginx 反代

---

## 来源声明

本项目前端代码来自 [RuoYi-Vue3 typescript 分支](https://gitcode.com/yangzongzhuan/RuoYi-Vue3/tree/typescript)，遵循原项目 [MIT License](./LICENSE)。

原始仓库：https://gitcode.com/yangzongzhuan/RuoYi-Vue3  
参考分支：`typescript`
