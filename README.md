[Uploading README.md…]()# Organization Capability Radar

> 组织不必等待一张“我要招人”的表单；它可以从真实业务协作中识别能力缺口，再讨论最合适的补足方式。

**Organization Capability Radar** 是一个公开的互动 Web Demo，用来探索一个问题：当招聘难并不只是“缺一个人”时，组织如何从日常协作信号中看见更深层的能力与协同缺口？

## 在线试玩

打开 [互动 Demo](https://angela-chen-ai-lab.github.io/organization-capability-radar/)，点击 **Play scenario** 或 **Step**。随着虚构项目群聊逐步出现，右侧面板会展示：

`业务信号 → 能力缺口 → 跨群证据 → 行动组合 → 招聘能力画像草案`

## 这个 Demo 想说明什么

第一版模拟一家 IP 驱动、多品类开发的互动产品公司。它展示两类不同但彼此相关的缺口：

- **跨域产品工程能力供给**：组织需要能在非标准产品中串联结构、电子、软件与测试的人才供给，也需要相应的培养路径与灵活资源组合。
- **IP 生命周期经营与跨品类协同**：同一 IP 跨越不同品类时，产品部门之间需要共享目标、节奏、资源优先级与版本治理机制。

这不是“看到一个问题，就自动创建招聘需求”的工具。它首先帮助人区分：这是一次局部硬伤，还是一个跨项目反复出现的系统性能力缺口？

## 建议不是自动决定

Demo 提供可解释的建议草案，可能包含：

- Recruit
- Internal Mobility
- Train
- Outsource / External Flexible Supply
- AI Enablement

最终的招聘、调动、培养、采购与组织设计决策必须由负责的人确认。所有对话、角色和组织情境均为原创虚构内容；Demo 不接入真实聊天记录、员工数据、候选人数据或外部业务系统。

## 当前范围

已包含：可播放的模拟协作对话、信号提取、能力缺口、证据抽屉、行动建议与招聘能力画像草案。

尚未包含：登录与权限、真实飞书接入、真实 ATS 发布、简历筛选、自动决策，或向任何外部系统写入数据。

## 文档

- [产品需求](docs/PRD.md)
- [页面与交互](docs/UI_INTERACTION.md)
- [识别、证据与行动规则](docs/INTELLIGENCE_LOGIC.md)
- [Capability Orchestration Core](docs/CAPABILITY_ORCHESTRATION_CORE.md)
- [案例库](docs/SCENARIO_LIBRARY.md)
- [技术架构](docs/TECHNICAL_ARCHITECTURE.md)
- [平台接入方向](docs/PLATFORM_INTEGRATION.md)
- [路线图](docs/ROADMAP.md)

## 共创

欢迎 HR、组织发展、业务、研发、设计和工程视角的贡献。尤其欢迎：更真实但已匿名化的组织摩擦、对规则的反例、不同场景下的行动边界，以及让 Demo 更易理解的改进。

请先阅读 [贡献指南](CONTRIBUTING.md)。请勿提交真实聊天记录、个人信息、候选人资料、客户数据、访问凭证或未经授权的内部材料。

## 未来方向

当前版本是静态、可公开试玩的原型。后续若进入明确授权的试点，核心分析逻辑可通过 Adapter 接入飞书、钉钉或企业微信等协作平台；平台接入不应改变“最小权限、可解释、由人确认”的基本原则。

