# 平台接入与可移植 Skill 架构

## 先说结论

可以把“识别组织能力缺口并提出行动建议”做成一个可被机器人调用的 Skill，但不能把它误解为“只写一个 Skill，就天然读得到所有平台的群聊”。

一个完整能力由三层构成：

```text
飞书 / 钉钉 / 企业微信的群消息
          ↓（各平台授权、事件、格式不同）
Platform Adapter
          ↓（统一 Message、成员/项目上下文）
Organization Capability Analysis Core
          ↓（Signals → Gaps → Evidence → Actions → Recruiting Capability Brief）
机器人卡片 / Web Demo / 管理工作台
```

其中 Core 才是要开源、可迁移、可共创的“Skill 实质”；Adapter 是每个平台各自要开发的一小层集成；机器人是用户在平台中看到并与之交互的入口。

## Core：跨平台复用的分析 Skill

核心提供一个稳定接口。P0 不依赖任何平台 SDK：

```ts
type AnalysisRequest = {
  messages: Message[];
  organizationContext?: OrganizationContext;
  talentDevelopmentPolicy?: TalentDevelopmentPolicy;
  analysisWindow: { start: string; end: string };
  mode: 'demo' | 'pilot';
};

type AnalysisResult = {
  signals: Signal[];
  gaps: CapabilityGap[];
  actions: ActionRecommendation[];
  recruitingBriefs: RecruitingCapabilityBrief[];
  organizationDesignHypotheses: OrganizationDesignHypothesis[];
};

export function analyzeOrganizationCapability(request: AnalysisRequest): AnalysisResult;
```

它包含：能力词典、信号提取器、跨群证据聚合、局部/系统性诊断、行动规则、招聘能力画像生成与测试案例。以后可以把规则提取器换为 LLM，但接口和证据要求不变。

## Platform Adapter：不能省略的接入层

| 平台 | 机器人能做什么 | P1 推荐接入方式 | 不能假设的事 |
|---|---|---|---|
| 飞书 | 机器人可与用户交互；在取得相应权限并订阅事件后，可接收所在群的消息 | 先使用“仅 @ 机器人”或用户主动转发；经明确授权的试点群才考虑读取群内全部新增消息 | 机器人天生拥有整个企业的历史聊天记录 |
| 钉钉 | 企业/自定义机器人可在群内交互 | 先要求成员 @ 机器人提交一段讨论或触发一次分析 | 群内每一句普通消息都会自动送给机器人；官方 Stream 文档说明群内机器人消息回调通常要求 @ 机器人 |
| 企业微信 | 有机器人/应用与回调式集成路径 | 从“用户主动触发—提交上下文—返回建议”开始，具体可读范围以试点租户的官方权限为准 | 一个跨平台 Skill 可以绕过企业管理员、授权和数据边界 |

平台支持的机器人、事件与授权能力会迭代；实现前须根据当时官方文档逐项确认权限、可读范围、审核与数据保留要求。

## 三种接入模式（从低风险到高能力）

### A. 主动触发分析（推荐第一个真实版本）

用户在群里 @ 机器人：`@组织能力雷达 请分析最近这段讨论的能力缺口`。Adapter 只发送用户明确提供/授权的近期上下文给 Core，机器人返回一张“观察—证据—建议草案”卡片。

优点：最易取得信任，跨三平台更接近通用，开发和合规复杂度最低。限制：Agent 不会自动长期积累全部群聊。

### B. 明确授权的项目群观察

将机器人加入一个指定试点群，管理员和成员知情。Adapter 仅增量缓存该群新消息，按固定窗口（例如每周）调用 Core，输出只读的组织能力周报草案。

优点：开始具备“持续感知”。限制：需要事件订阅、存储/删除策略、权限与用户告知。

### C. 企业级能力雷达

跨多个项目群，结合项目、能力目录与人才信息。此阶段才可能可靠识别跨边界的系统性问题，也因此必须完成最小权限、目的限制、保留期限、访问控制、审计、人工复核与申诉机制设计。

## 建议 GitHub 交付物

```text
packages/core/                  # 平台无关的分析 Skill
packages/adapters/feishu/       # 将飞书事件正规化为 Message
packages/adapters/dingtalk/     # 将钉钉事件正规化为 Message
packages/adapters/wecom/        # 将企业微信事件正规化为 Message
services/analysis-api/          # 可选 HTTP 包装，供机器人调用
apps/web/                       # 互动 Demo：可视化与解释
data/seed/                      # 虚构案例、规则、测试期望
docs/                           # 设计与各平台接入说明
```

这不是一个“下载安装到任意 IM 的通用插件包”。各平台的应用形态、鉴权、事件格式、审核流程不同；但 Core 可以由同一仓库维护，各 Adapter 由社区独立贡献。这样开源才既有产品灵魂，也不被单一平台锁住。

## 飞书的下一步（Demo 验证后）

先做一个企业自建机器人：用户 @ 它时，机器人调用 `analysis-api` 并返回建议卡片。飞书官方资料显示，接收消息需要开启机器人能力和订阅接收消息事件；权限可限定为群内 @ 机器人的消息，或在更高授权下接收机器人所在群的全部消息。事件可通过长连接或开发者服务器接收。

不要把真实飞书凭证放进 GitHub、代码仓库或 Demo。试点使用单独的企业自建应用、最小权限和独立的机密配置。

## 参考官方资料

- [飞书开放平台：机器人与应用形态](https://open.feishu.cn/?lang=zh-CN)
- [飞书：接收消息事件与权限范围](https://feishu.apifox.cn/doc-1945610)
- [飞书：事件订阅方式](https://feishu.apifox.cn/doc-1940218)
- [钉钉：机器人/消息能力中心](https://open.dingtalk.com/)
- [钉钉：Stream 模式下的机器人消息回调](https://opensource.dingtalk.com/developerpedia/docs/learn/stream/protocol/)
