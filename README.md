# Sgin Shop Antd Admin

一个基于 `@umijs/max` 的后台管理模版（Ant Design + Ant Design Pro 组合），用于 Sgin 系列项目的电商/管理后台。该仓库为 sgin-shop 前端管理端的 UI 实现，包含页面、hooks、models 与服务调用约定。

**主要目标**
- 统一将网络请求与副作用放入 Umi/DVA 风格的 `models`（effects），并提供薄层 domain hooks（`useXxx`）供页面使用；
- 保持组件层轻量、可复用，便于迁移与单元测试；
- 使用 TypeScript + ESLint + Prettier 保持代码质量。

**更多说明**: https://umijs.org/docs/max/introduce

## 技术栈
- React 18
- @umijs/max (Umi + DVA 风格 models)
- Ant Design / Ant Design Pro 组件（ProTable、PageContainer 等）
- TypeScript
- pnpm（包管理）
- TailwindCSS（项目部分样式）

## 目录结构（简要）
- `src/`：前端源码
	- `src/pages`：页面视图
	- `src/components`：可复用组件
	- `src/hooks`：domain hooks（useUsers、useProducts 等）
	- `src/models`：DVA/umi model（effects/reducers/state）
	- `src/services`：HTTP 请求封装（request）
	- `src/utils`：工具库

## 设计原则（迁移约定）
- 所有网络请求与副作用优先放入 `src/models` 的 `effects` 中；
- 页面与组件通过 `src/hooks/useXxx.ts`（薄层）调用对应 model：hook 内部使用 `useDispatch` 调用 model effects，并用 `useSelector`/局部 state 管理展示数据；
- 避免在页面中直接 `import '@/services'`，迁移时可暂时使用动态导入作为兼容。

## 开发环境准备
前提：Node 版本与仓库 `package.json` 要求一致（建议 Node >= 18 且 < 23），使用 pnpm 作为包管理。

安装依赖：
```bash
pnpm install
```

常用脚本（位于 `package.json`）：
- `pnpm run dev`：启动开发服务器（vite/umi dev）
- `pnpm run build`：构建生产包
- `pnpm run lint`：运行 ESLint
- `pnpm run type-check`：TypeScript 类型检查（`tsc --noEmit`）

具体脚本以仓库 `package.json` 为准。

## 本地运行（示例）
1. 安装依赖：`pnpm install`
2. 启动：`pnpm run dev`
3. 打开浏览器访问开发地址（控制台输出）

## 迁移说明（当前仓库已进行）
- 本项目正在从直接在页面/组件中调用 `@/services` 迁移到 `models (effects) + hooks` 模式；
- 已完成迁移示例：资源上传（`resource` model + `useResources`）、用户、订单、分类、API 管理、日志、支付等；
- 迁移原则：创建/补全 model effects → 编写薄层 hook（`useXxx`）封装 dispatch/select → 更新页面使用 hook → 移除直接 service 调用。

## 代码风格与校验
- TypeScript：`pnpm run type-check`
- ESLint：`pnpm run lint`
- 请在提交 PR 前运行上述校验，保持零错误为目标。

## 提交与分支策略
- 按 feature 分支开发，提交前确保 `type-check` 与 `lint` 通过；
- PR 描述请包含本次迁移/改动的范围与影响点（涉及哪些 model/hook/page）。

## 贡献
欢迎提交 Issues 与 PR。若要贡献迁移工作，建议按领域分批次迁移（例如：先迁移 `products` -> `orders` -> `payments`），并在 PR 中说明已验证的类型/页面。

## 联系与参考
- Umi Max 文档：https://umijs.org/docs/max/introduce
- Ant Design 文档：https://ant.design

---
（此 README 已根据当前项目架构补充核心说明，如需更详细的启动 / CI / 环境变量 说明，请告诉我要补充的部分。）
