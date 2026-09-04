# Organization Capability Radar

> 组织不该等待“我要招人”的表单；它应从真实业务运行中识别能力缺口，并推荐最合适的补足动作。

这是一个 **70–80 分可演示的 Web Demo**。它模拟飞书项目群中的日常对话，持续提取业务信号、聚合为能力缺口，并在 **Recruit / Internal Mobility / Train / Outsource / AI Enablement** 中给出建议。第一版不接真实飞书、不做真实招聘发布、不使用真实员工或候选人数据。

它区分两类问题：**局部硬伤**（一次性、可局部修复的交付问题）与 **系统性组织能力缺口**（跨项目反复出现、涉及组织设计/协同机制/人才供给的问题）。产品的核心价值是后者；不将单点技术故障直接等同于招聘需求，也不因看见系统问题而否认关键人才的刚性需求。系统性场景通常需要“组织机制 + 人才供给”双轨解决。

## 演示一句话

**Nobody submitted a hiring request. The organization discovered the capability gap itself.**

## 快速开始（交给 Codex 的首条指令）

将本开工包作为仓库根目录，并对 Codex 说：

> 请依据 `docs/PRD.md`、`docs/TECHNICAL_ARCHITECTURE.md` 和 `docs/DEVELOPMENT_TASKS.md` 实现 MVP。先完成 P0：可播放的模拟飞书群聊、信号/能力缺口面板、证据抽屉、行动建议和 Hiring Brief；使用仓库内 `data/seed/` 的模拟数据；不接任何外部服务。完成每个任务后运行测试、更新 README，并保持 TypeScript 类型完整。

## 当前可运行 Demo

当前版本是零依赖的互动 Web Demo，入口为 [index.html](index.html)。双击文件即可预览；为获得最稳定的本地体验，在本目录运行：

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

然后访问 `http://127.0.0.1:4173`。点击 **Play scenario** 或 **Step**，让 Agent 随对话积累证据；播放完成后点击右侧任一能力缺口卡片，查看推理、行动组合和招聘能力画像草案。

该实现刻意不依赖飞书、模型 API、账号或真实组织数据，适合直接提交 GitHub Pages/任意静态托管平台。规则与数据目前保存在 [app.js](app.js)，下一阶段再拆到 `packages/core` 与各平台 Adapter。

## 第一版范围

- 用预置或播放的模拟群聊展示业务活动。
- 将消息映射为信号、能力缺口、证据、行动建议与 Hiring Brief。
- 以可解释的规则引擎为准；LLM 仅作为未来可插拔增强，不是 Demo 的依赖。
- 保留消息源 Adapter 接口，未来可接飞书开放平台。

不做：登录权限、真实飞书 OAuth、真实 ATS 发布、简历筛选、向任何外部系统写入数据。

## 文档导航

- [产品需求](docs/PRD.md)
- [页面与交互](docs/UI_INTERACTION.md)
- [识别、证据与行动规则](docs/INTELLIGENCE_LOGIC.md)
- [Capability Orchestration Core 规格](docs/CAPABILITY_ORCHESTRATION_CORE.md)
- [数据模型与模拟数据](docs/DATA_MODEL_AND_SEED.md)
- [案例库：局部硬伤与系统性组织问题](docs/SCENARIO_LIBRARY.md)
- [技术架构](docs/TECHNICAL_ARCHITECTURE.md)
- [平台接入与可移植 Skill 架构](docs/PLATFORM_INTEGRATION.md)
- [Demo 演示脚本](docs/DEMO_SCRIPT.md)
- [开发任务](docs/DEVELOPMENT_TASKS.md)
- [路线图](docs/ROADMAP.md)
- [贡献指南](CONTRIBUTING.md)

## 推荐仓库结构

```text
organization-capability-radar/
├─ apps/
│  ├─ web/                 # React + Vite 单页 Demo
│  └─ api/                 # Express API；也可先由 web 本地数据替代
├─ packages/
│  ├─ core/                # 可移植的组织能力分析核心（Skill 的实质）
│  ├─ shared/              # TypeScript 类型、规则、种子读取器
│  └─ adapters/            # Feishu/DingTalk/WeCom 的消息接入器
├─ services/
│  └─ analysis-api/        # 可选：让各平台机器人调用核心的 HTTP 服务
├─ data/seed/              # 可公开的模拟群聊与组织目录
├─ docs/                   # 本开工包
├─ tests/                  # 规则与关键交互测试
├─ CONTRIBUTING.md
└─ README.md
```

## 建议发布方式

GitHub 开源仓库 + Vercel（前端）或 Render（全栈）即可。Demo 默认只含虚构数据，适合公开部署。

## 产品推进顺序

1. **互动 Web Demo（现在）**：部署一个可直接打开的网址；播放虚构群聊、查看 Agent 的证据与建议。它由浏览器渲染为 HTML，但有完整点击/播放/状态变化交互，不是静态 PPT 或图片。
2. **GitHub 共创（紧接着）**：公开代码、虚构案例与贡献指南；邀请 HR、组织发展、产品、研发人员改进场景、规则、画像和界面。线上 Demo 链接放在 README。
3. **受控飞书试点（验证后）**：复用规则引擎，新增 Feishu Adapter，在一个明确授权的测试租户/少量群聊中先做只读采集与“建议草稿”。
4. **正式插件（最后）**：再处理企业授权、权限范围、事件订阅、回调服务、数据治理、管理员审核与发布。

不要先做插件再开源：那会让第一个版本被平台集成、权限和真实数据风险拖慢。开源 Demo 与未来插件并不冲突；前者验证产品判断，后者验证真实工作流。

“Skill”在这里应理解为可移植的分析能力，而不是只在某个平台配置的一段提示词。GitHub 开源的主体应是 `packages/core`（规则、数据结构、提示词/模型接口、测试场景）和各平台的 Adapter 模板；飞书、钉钉、企业微信分别用薄薄一层机器人/事件接入代码调用同一个核心。
