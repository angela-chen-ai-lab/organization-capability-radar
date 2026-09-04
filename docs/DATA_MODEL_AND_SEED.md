# 数据结构与模拟飞书群聊数据

## TypeScript 核心类型

```ts
type Message = { id: string; channelId: string; authorId: string; sentAt: string; text: string; sequence: number };
type SignalType = 'business_goal'|'delivery_blocker'|'missing_skill'|'urgency'|'solution_hint';
type Signal = { id: string; messageId: string; type: SignalType; capabilityTags: string[]; weight: number; confidence: number; excerpt: string; ruleId: string };
type Evidence = { messageId: string; signalId: string; reason: string; excerpt: string };
type CapabilityGap = { id: string; capabilityId: string; label: string; score: number; confidence: number; priority: 'low'|'medium'|'high'; impact: string; status: 'observing'|'active'; problemNature: 'local'|'systemic'; systemicDrivers: ('structure'|'operating_model'|'capability_portfolio'|'resource_allocation')[]; evidenceIds: string[] };
type ActionKind = 'recruit'|'internal_mobility'|'train'|'outsource'|'ai_enablement';
type ActionRecommendation = { kind: ActionKind; score: number; rationale: string[]; timing: 'now'|'next_30_days'|'later' };
type PortfolioEvidenceRequirement = { requestedArtifacts: string[]; aiCollaborationDisclosure: string[]; confidentialityNote: string };
type WorkSampleAssessment = { scenario: string; aiUsePolicy: 'allowed_and_disclosed'; expectedOutputs: string[]; evaluationDimensions: string[] };
type RecruitingCapabilityBrief = { capabilityUnit: string; purpose: string; suggestedHeadcountRange: string; mustHave: string[]; strongPreferences: string[]; trainable: string[]; antiRequirements: string[]; portfolioEvidence: PortfolioEvidenceRequirement; workSample: WorkSampleAssessment; proposedOperatingContext: string; evidenceIds: string[]; status: 'draft_requires_human_confirmation' };
type EmployeeSkillProfile = { employeeId: string; availability: number; skills: { capabilityId: string; level: 1|2|3|4|5 }[] };
```

## 种子目录建议

```text
data/seed/
├─ organization.json       # 虚构公司、项目、成员、能力目录
├─ us-launch-messages.json # 以下消息
└─ capability-rules.json   # 词典、阈值、行动权重
```

## `us-launch-messages.json` 内容

| seq | 发言人（虚构） | 消息 |
|---:|---|---|
| 1 | 林然 / 产品经理 | 美国版下个月必须上线，最近海外用户反馈的支付失败越来越多。 |
| 2 | 周衡 / 技术负责人 | 我们定位两天了，失败主要在 Stripe webhook 和退款状态同步。 |
| 3 | 周衡 / 技术负责人 | 现有后端都没有 Stripe 或国际支付集成经验，这块一直靠猜。 |
| 4 | 陈曦 / 运营 | 上周已有 18 个付费用户因支付失败流失，客服无法解释。 |
| 5 | 林然 / 产品经理 | 这个问题会直接挡住美国版上线，不能再拖。 |
| 6 | 周衡 / 技术负责人 | 短期可以请懂 Stripe 的顾问一起排查；长期还是要补支付架构能力。 |
| 7 | 王祺 / HRBP | 团队内有人可以支援吗？ |
| 8 | 周衡 / 技术负责人 | 查过了，没有做过国际支付的同事能在本月投入。 |

组织目录中设置：没有 `international_payment_integration` 高级技能；有一名 `backend_engineering` 3 级但 availability=0.1 的成员。这确保 Internal Mobility 不被误判为可行。此场景仅用于验证“局部硬伤不能自动导向招聘”。核心 Demo 应使用案例库中的 IP 场景。
