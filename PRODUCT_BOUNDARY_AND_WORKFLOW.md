# 产品边界与未来工作流

## 结论

Organization Capability Radar 不应变成一个无边界的“组织问题万能助手”。

它的核心价值在于：从协作信号中发现可验证的组织能力问题，把模糊的“缺人/做不好”变为能力结果、能力单元、证据和行动组合，并指出下一步应由哪类机制承接。

它应该**大胆建议**，但不应假装自己已经完成了建议所需的全部实施工作。

## Radar 的停止线

当 Radar 输出下列建议时，应同时产生一份 `Capability Handoff Brief`，然后停止深入：

| Radar 的建议 | Radar 负责到哪里 | 后续系统负责什么 |
|---|---|---|
| Internal Mobility | 能力结果、候选范围、责任边界、释放条件与待确认问题 | 内部人才市场/管理者完成邀请、匹配与调动 |
| Development / Train | readiness 差距、真实任务方向、导师需求、评审闸门与成功证据 | Capability Growth Studio 设计培养路径、学习机制与追踪 |
| External Flexible | 可独立验收的能力单元、接口、内部 Owner 与风险 | 采购/供应商协作系统完成寻源、合同与交付管理 |
| Recruit | 触发条件、能力画像、作品/工作样本验证方式 | ATS/招聘系统完成 requisition、搜寻与录用 |
| AI Enablement | 可被放大的工作环节、输入输出、人工复核点与风险 | AI Enablement Workbench 选择工具、配置工作流、提供 Demo 与运行治理 |

## Capability Handoff Brief 最小结构

```ts
type CapabilityHandoffBrief = {
  sourceGap: string;
  businessOutcome: string;
  evidenceSummary: string[];
  chosenAction: 'internal_mobility' | 'development' | 'external_flexible' | 'recruit' | 'ai_enablement';
  capabilityUnits: string[];
  constraints: string[];
  accountableOwner: string;
  successEvidence: string[];
  openQuestions: string[];
};
```

它让下游产品从“某人说要培训”升级为“要让谁在什么真实业务结果中，形成什么能力，并以什么证据判断是否成长”。

## 未来独立方向：Capability Growth Studio

这是一个值得开源共创、但不应在 Radar v0.1 内硬做进去的独立产品方向。

它要回答的不是“推荐一门课”，而是：组织如何让“差一点点”的人，通过合适的真实工作、支持资源和评审闸门，更安全地成长到可承担下一层责任。

### 进入前先评估组织条件

| 要检查什么 | 为什么 |
|---|---|
| 组织规模、岗位重复度与项目节奏 | 决定是否值得建设正式平台，还是以项目制培养为主 |
| 现有文档、案例、专家时间与复盘习惯 | 判断知识库/课程是否有真实素材，而非只搭一个空平台 |
| 任务风险、导师可用性与容错空间 | 决定可否采用 learning by doing，以及责任能放到什么层级 |
| 能力是否连续、跨项目复用 | 区分一次专项补课和长期能力建设 |

### 三种培养模式不是谁更先进，而是适用条件不同

| 模式 | 更适合 | 典型风险 |
|---|---|---|
| 碎片化学习 | 明确、低风险、可快速补齐的知识或工具差距 | 学了但没有真实任务，无法转化为能力 |
| 集中训练 | 共性高、需要统一语言/标准、多人同时进入新领域 | 脱离真实项目，学习成果难以沉淀 |
| Learning by doing | 高耦合、非标准、依赖上下文的系统能力 | 没有导师、边界和闸门时，变成把风险交给新人 |

Capability Growth Studio 的输出应是一条成长路径：目标能力、真实任务、导师/同伴支持、知识与工具资源、阶段闸门和失败后的调整方案。

## AI Enablement 的边界

当 Radar 建议 AI Enablement，它只指出“AI 可以放大哪个环节、谁要复核、不能替代什么责任”。

下游的 AI Enablement Workbench 再进一步回答：

- 应使用现有工具还是制作新的 Skill；
- 使用哪个模型、怎样接入、是否需要 API；
- 输入数据如何脱敏、保留和审计；
- 具体工作流、提示词、Demo 与验收方式是什么。

## 开放问题

1. Capability Growth Studio 应独立成为产品，还是先作为 Radar 的“交接 Brief 页面”验证需求？
2. 哪些组织规模/项目特征下，正式知识库的投入真的值得？
3. 如何把 learning by doing 的导师时间、项目风险与能力成长证据量化？
4. AI Enablement 的 Demo 应由谁维护，如何避免工具越多、工作流越碎？
