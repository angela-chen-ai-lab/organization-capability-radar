# 技术架构建议

## 原则

单仓库、TypeScript 全栈、先本地可跑、零外部 AI 依赖。开发时先让前端从 `packages/shared` 读取种子数据；需要 API 再启用 Express，避免过早引入数据库、认证与云服务。

### 当前实现说明

为使 v0.1 能被任何共创者直接打开，当前 Demo 使用无构建步骤的 `index.html` + `styles.css` + `app.js`。它已实现播放、逐步信号提取、能力缺口、证据抽屉与行动建议。文中 React/Vite/Express 是下一阶段的推荐演进，而非当前运行前提；当场景、规则与交互被验证后，再迁移为 TypeScript monorepo。

## 推荐栈

- Web：React + Vite + TypeScript；Tailwind CSS；React Router（仅在需要独立 Brief 路由时）。
- 状态：Zustand 或 React Context，保存播放索引和派生雷达状态。
- API：Node.js + Express + TypeScript；Zod 做输入/输出验证。
- 测试：Vitest（规则单测）+ Playwright（播放到 Brief 的关键路径）。
- 部署：Vercel 静态前端优先；如启用 API，部署 Render 或 Vercel Functions。

## 分层

```text
UI → application/demoStore → shared rule engine → seed repository
                                      ↑
                              MessageSourceAdapter
                                      ↑
                       SeedAdapter (P0) / FeishuAdapter (future)
```

`MessageSourceAdapter` 只负责把外部消息正规化为 `Message[]`；它不能直接做判断。`SignalExtractor` 与 `ActionEngine` 是纯函数，输入相同数据必须得出相同输出。

```ts
interface MessageSourceAdapter { listMessages(channelId: string): Promise<Message[]> }
interface SignalExtractor { extract(message: Message, rules: RuleSet): Signal[] }
```

## 未来飞书预留

在 `packages/adapters/feishu/` 预留实现，但 P0 不安装或配置飞书 SDK。未来 Adapter 应处理 OAuth、事件订阅、消息权限、去标识化和增量游标；业务规则保持不变。真实接入前需单独完成权限、用户告知、数据保留与审计设计。

### 为什么插件在 P0 之后

Web Demo 的核心是 `SignalExtractor`、`ActionEngine`、证据解释和互动界面；这些可先完全使用虚构数据验证。飞书接入只是消息来源 Adapter 与身份/权限/事件基础设施，不应绑架前述产品验证。

飞书企业自建应用通常还需要创建应用、配置所需最小权限、启用机器人（若需要机器人交互）、配置事件订阅和可公开访问的回调地址，并经管理员审核/发布后才在企业内生效。因此先做一个只读、单租户、明确授权的试点，且只接经批准的群聊；不要从“读取全公司日常对话”开始。

### 建议的插件演进

| 阶段 | 飞书能力 | 产品动作 | 风险边界 |
|---|---|---|---|
| P0 | 无 | 使用 SeedAdapter 的互动 Web Demo | 只含虚构数据 |
| P0.5 | 机器人消息/手动导入（可选） | 将用户主动转发给机器人的消息做临时分析 | 用户主动选择输入，不扫描群聊 |
| P1 | 单个试点群的事件订阅 | FeishuAdapter 只读接收批准群的新增消息，输出建议草稿 | 最小权限、用户告知、可删除、人工复核 |
| P2 | 多群/企业级接入 | 增量同步、权限治理、审计与管理员工作台 | 需单独安全、隐私与合规评估 |

## API（P0 可选）

- `GET /api/demo/scenarios`：场景列表。
- `GET /api/demo/scenarios/:id`：消息、目录、规则。
- `POST /api/analyze`：传入已播放消息 IDs，返回 Signals/Gaps/Actions/Brief；无持久化。

不要在 P0 使用数据库。若需要持久化演示偏好，使用浏览器 localStorage。
