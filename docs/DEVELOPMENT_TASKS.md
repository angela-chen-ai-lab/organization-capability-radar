# 开发任务拆分

## P0｜可演示 MVP（建议按顺序）

- [ ] 初始化 pnpm workspace、React/Vite、TypeScript、ESLint、Prettier、Vitest；写出一条 `pnpm dev` 命令。
- [ ] 在 `packages/shared` 定义数据类型与 `data/seed` JSON，完成种子加载；主场景使用 IP 跨品类开发。
- [ ] 编写并测试 `extractSignals()`：覆盖跨品类依赖、版本冲突、招聘画像重叠、全能研发难招/不饱和等模式。
- [ ] 编写并测试 `classifyProblemNature()`、`calculateGaps()`、`buildCapabilityArchitecture()`、`orchestrateSupply()`；断言支付为 local 且不推荐 Recruit，IP 场景为 systemic，且输出“协同机制 + 跨域工程供给”的关联诊断。
- [ ] 实现三栏 UI、模拟消息列表、Play/Pause/Step/Reset。
- [ ] 将播放状态接入规则引擎；信号和卡片随消息出现。
- [ ] 完成能力缺口抽屉、跨群证据引用、行动说明、组织设计建议、能力架构图、关键人才 Hiring Brief 与人才发展建议卡。
- [ ] 处理空状态、响应式窄屏、键盘可访问性与优先级色彩对比。
- [ ] Playwright 测试：Reset → 播放完成 → 打开缺口 → 看见证据与 Brief。
- [ ] 完善 README 的本地运行、截图/GIF、部署说明；部署 preview。
- [ ] 为 `packages/core` 定义平台无关的 `analyzeOrganizationCapability()` 接口；Web Demo 必须通过该接口调用规则，而不是直接耦合飞书式群聊 UI。

## P1｜更像产品

- [ ] 场景切换：新增“AI 数据分析能力缺口”场景，验证 AI Enablement/Train。
- [ ] 参数面板：展示并可本地调整阈值和权重。
- [ ] Express API 与 Zod schema；前端改走 API。
- [ ] 导出 Brief 为 Markdown/PDF（仅本地下载）。
- [ ] 新建 `packages/adapters/feishu` 的接口骨架和假事件 fixture；不接真实凭证或真实群聊。
- [ ] 实现 P0.5 的“@机器人主动分析”契约：Adapter 取经授权的最近消息 → Core 分析 → 返回建议卡片数据；先选择一个平台，不并行接三家。

## Done 定义

`pnpm install && pnpm dev` 可运行；无 API key；三分钟脚本可完整演示；`pnpm test` 和核心 E2E 通过；所有结论可查看证据；仓库不包含真实组织或个人数据。
