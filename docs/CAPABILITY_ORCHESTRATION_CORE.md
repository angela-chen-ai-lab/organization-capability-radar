# Capability Orchestration Core｜可开发规格 v0.1

## 0. Core 的职责

Core 不止“从群聊生成招聘需求”。它要让一个暂时不可满足的非标准需求，变成一个 **可执行、可负责、可验证的能力组合方案**。

```text
业务证据 → 能力缺口 → 能力架构 → 供给与发展编排 → 人工确认 → 执行反馈
```

它不自动调人、发 offer、采购外部服务或改变组织职责；它生成带证据、边界与风险的草案，由有相应权限的人确认。

## 1. 五项核心能力

| 能力 | Core 要回答的问题 | 主要输出 |
|---|---|---|
| 1. 缺口识别 | 这是局部硬伤、人才供给不足，还是系统性组织问题？ | `CapabilityGap`、证据、置信度 |
| 2. 能力定义 | 我们真正要达成的结果和能力是什么，而非职位名是什么？ | `CapabilityOutcome` |
| 3. 能力架构 | 哪些部分必须由稳定负责人承担，哪些能独立交付，接口和验收是什么？ | `CapabilityUnit[]`、依赖图、责任边界 |
| 4. 供给与发展编排 | 招、借、练、外包、AI 怎样组合，才能在时间、质量和成本约束下可行？ | `CapabilitySolution`、招聘画像、成长计划 |
| 5. 闭环校验 | 方案是否真的降低返工、单点依赖、资源冲突和交付风险？ | 指标、复盘、方案调整建议 |

## 2. 核心原则与反模式

### 原则 A：先定义交付结果，再定义人

“招一名全能研发”不是能力定义。对案例而言，结果应写作：**在指定 IP 节奏内，交付满足安全/体验/成本约束的互动实体产品，并在需求变化时协调结构、电子、软件和供应链的接口。**

### 原则 B：最小可负责单元，而不是最小技能颗粒

能力单元只有同时满足下列条件时才可被独立调用：

1. 有清晰输入、输出和验收标准；
2. 对外接口可描述；
3. 有一个可追责的 Owner；
4. 拆开后的协调成本低于保留在一起的收益；
5. 不会泄漏需要长期积累的关键上下文或核心 IP/技术责任。

否则应保留在稳定的整机系统集成单元中，不能为了“灵活”而碎片化。

### 原则 C：一个项目可以是灵活组合，但不能没有总负责

每个 `CapabilitySolution` 必须包含一个 `IntegrationOwner`：对目标、关键取舍、跨专业接口和最终验收负责。外部专家、内部借调人员、AI 都可以供给能力，但不能让责任消失。

### 原则 D：培养不是“低配替代”，是有闸门的 readiness 加速

对“差一点点”的内部人，Core 只能建议一条有目标、支持资源和评审闸门的成长路径；未通过闸门前，不把其标记为可独立承担高风险整机责任。

## 3. 能力模型

### 3.1 能力结果（Outcome）

```ts
type CapabilityOutcome = {
  id: string;
  label: string;
  businessPurpose: string;
  successCriteria: string[];
  timeHorizon: 'immediate' | 'quarter' | 'ongoing';
  criticality: 'supporting' | 'important' | 'core';
  evidenceIds: string[];
};
```

### 3.2 能力单元（不是岗位）

```ts
type CapabilityUnit = {
  id: string;
  outcomeId: string;
  label: string;
  deliverable: string;
  acceptanceCriteria: string[];
  interfaces: { withUnitId: string; contract: string }[];
  durationProfile: 'continuous' | 'phase_based' | 'burst';
  coupling: 'high' | 'medium' | 'low';
  strategicSensitivity: 'high' | 'medium' | 'low';
  accountableOwnerRequired: boolean;
  supplyModesAllowed: SupplyMode[];
};
type SupplyMode = 'core_hire'|'internal_mobility'|'development'|'external_flexible'|'ai_enablement';
```

### 3.3 人才不是一个“岗位标签”，而是一张能力与 readiness 图

```ts
type TalentCapabilityProfile = {
  personId: string;
  professionalAnchors: { capability: string; level: 1|2|3|4|5; evidence: string[] }[];
  integrationLevel: 1|2|3|4|5;
  lifecycleExposure: string[];
  collaborationEvidence: string[];
  availability: number;
  systemGrowthLevel: 1|2|3|4|5;
};

type ReadinessDelta = {
  targetUnitId: string;
  candidateId: string;
  readyNow: boolean;
  gaps: string[];
  risks: string[];
  accelerators: DevelopmentIntervention[];
  reviewGates: ReviewGate[];
};
```

`integrationLevel`（也即 `systemGrowthLevel`）不是“会所有专业”的程度，而是从入职起，承担完整产品系统责任的成熟度：

| Level | 能力边界 | 可承担的责任 |
|---:|---|---|
| 1 | 理解自己的专业任务和上游/下游接口 | 在明确任务下交付、记录问题 |
| 2 | 能参与单一模块的联调和排查 | 负责一个模块的接口与测试 |
| 3 | 能将两个以上专业的局部问题串联 | 在导师支持下负责子系统集成 |
| 4 | 能在非标准产品中做跨专业取舍 | 负责整机/关键子系统集成与评审 |
| 5 | 能定义技术路线、建立机制并培养他人 | 负责能力单元、带领多个项目的集成方法 |

## 4. 人才发展假设：螺旋上升的全局能力坐标

P0 将“**螺旋上升的全局能力坐标**”设为案例的默认假设。每位研发从入职开始就面向完整产品/整机系统培养，而不是先被永久定义成前端、后端、结构或电子岗位。其专业深度和系统视野会在真实项目中同步、分层增长：初级全栈的“全”是理解完整链路和自己所在接口，不是要求一人完成所有工作；资深全栈的“全”才是能对跨专业取舍、方向和结果负责。

```text
专业锚点加深 ───→ 结构 / 电子 / 嵌入式 / 软件等真实技术能力
       ↗
系统能力扩展 ───→ 需求理解 → 接口协作 → 子系统集成 → 整机取舍 → 能力建设
```

这是一条螺旋：每个项目既加深一个技术锚点，也扩大对完整产品的理解与责任范围。Core 据此不问“此人是否转入整合通道”，而问“其当前层级，下一次能在完整系统中多承担哪一级责任”。

| Level | 全局能力的含义 | 专业能力的含义 | 下一步培养任务 |
|---:|---|---|---|
| 1 | 知道产品目标、主要模块、上下游接口与自己任务的影响 | 在一个明确专业任务下可靠交付 | 参加整机评审；写出本模块接口与风险 |
| 2 | 能在导师支持下识别跨模块影响，并参与联调 | 能独立完成一个小模块/专项任务 | 完成一次接口变更和联调复盘 |
| 3 | 能负责一个子系统的目标、接口与验收，并理解整机取舍 | 在至少一个技术锚点形成可复用能力 | 担任子系统 Owner，参与产品方案权衡 |
| 4 | 能统筹整机或关键产品线的跨专业取舍、节奏与风险 | 有一项足以赢得专业人员信任的技术锚点 | 担任 Integration Owner，带领跨专业评审 |
| 5 | 能定义技术路线、培养他人并建设可复制的系统能力 | 能形成技术方法/标准并判断何时调用专家 | 建立共享能力机制与培养体系 |

### 4.1 保留的替代假设：分流模型

我提出的“深度专家/整合责任分流”保留为可检验的替代假设，而不是默认答案。它可能在高专业壁垒模块中有效，也可能反过来制造孤岛。开源项目应让组织在试点中比较二者，而不替用户替世界下结论。

```ts
type TalentDevelopmentPolicy = {
  model: 'spiral_integrator_first' | 'dual_track' | 'compare_in_pilot';
  rationale: string;
  reviewPeriodWeeks: number;
  successMetrics: string[];
};
```

当 `model='compare_in_pilot'` 时，Agent 不推荐任一方胜出；它输出两种方案的适用前提、风险与需要采集的验证指标：交付返工率、关键人依赖、跨项目资源冲突、员工成长速度、专项质量和留任意愿。

## 5. 供给与发展编排规则

Core 为每个能力单元产生候选供给方式，并给出 0–100 的适配分。它不按“最便宜”排序，而以可达成结果为先。

```text
solutionScore = outcomeFit + timeFit + qualityConfidence + learningValue
              - coordinationCost - accountabilityRisk - contextLoss - complianceRisk
```

| 情形 | 高分方式 | 低分方式 |
|---|---|---|
| 高耦合、核心、连续、需长期判断 | core_hire + development | 按小时切成多个外包任务 |
| 低耦合、阶段性、验收清楚 | internal_mobility 或 external_flexible | 因短峰值永久扩编 |
| 内部人只差有限经验、有导师/真实项目窗口 | development + 受监督的 stretch assignment | 直接任命为独立总负责 |
| 资料检索、版本对照、纪要、标准化分析 | ai_enablement + 人工复核 | 将最终工程责任交给 AI |

### 5.1 对稀缺 Integration Owner 的具体方案

当市场供给不足时，Core 不把“招聘难”当作无解状态，而输出三层方案：

1. **现在**：由现有 Level 4/5 或外部资深顾问临时担任 Integration Owner；明确责任边界与交接期限。
2. **下一项目周期**：给最接近的内部 Level 2/3 人员配置真实 stretch assignment、导师、专项专家搭档和评审闸门，使其沿全局能力坐标螺旋上升。
3. **长期**：持续招聘具有一个专业锚点且有系统迁移潜力的人，按螺旋模型培养；不执着于寻找极少数“完全即插即用”的候选人。

### 5.2 发展干预与闸门

```ts
type DevelopmentIntervention = {
  kind: 'mentored_assignment'|'paired_delivery'|'rotation'|'targeted_learning'|'external_coaching';
  purpose: string;
  durationWeeks: number;
  supportOwner: string;
};
type ReviewGate = {
  after: string;
  evidenceRequired: string[];
  decision: 'advance'|'extend_with_support'|'adjust_scope_and_support';
};
```

示例：一名 Level 2 嵌入式工程师不是立刻升为整机负责人；他先与 Level 4 导师配对，负责一个互动子系统，完成两次接口变更复盘和一次跨专业评审后，才能在下个项目承担 Level 3 子系统集成。

## 6. IP 案例的预期方案

### 6.1 能力架构

| 单元 | 耦合 | Owner | 主要供给 | 理由 |
|---|---|---|---|---|
| IP 资产、版本与共同节奏治理 | 高 | IP Owner | internal_mobility / role assignment | 是决策权与责任，不是可采购技能 |
| 整机系统集成与技术取舍 | 高 | Integration Owner | core_hire + development | 需要连续上下文和最终技术责任 |
| 嵌入式互动实现 | 中 | 子系统 Owner | shared pool + core_hire | 跨 IP 复用，但需稳定积累 |
| 结构/电子专项设计 | 中 | 专项 Owner | specialist + external_flexible | 需专业深度，样机高峰可弹性供给 |
| 打样与标准化测试 | 低至中 | 项目测试 Owner | external_flexible + internal | 有阶段峰值且可定义验收 |
| 版本检索、依赖提醒与知识沉淀 | 低 | IP Owner 复核 | ai_enablement | AI 适合作为放大器，不承担决策 |

### 6.2 Agent 应呈现的“人才发展建议卡”

> 发现：组织当前缺少可独立承担整机集成的 Level 4/5 人员，且外部即插即用供给稀少。
>
> 建议：将两名具有结构/嵌入式专业锚点的 Level 2/3 内部人员列入整合通道候选池；在下个重点 IP 中分别承担受导师支持的子系统集成。外部招募定位为“有专业锚点 + 系统迁移潜力”，而非“全技能覆盖”。在 12 周后以接口评审、变更复盘、样机验收和跨专业协同证据决定是否进入下一等级。
>
> 人工确认项：候选人意愿、当前项目释放条件、导师可用性、项目风险承受度、薪酬/职级机制与外部合作预算。

## 7. 人工确认点与安全边界

| 触发 | Core 可以做什么 | 必须由人决定 |
|---|---|---|
| 内部邀请 | 生成能力需求、候选范围与推荐理由 | 联系谁、是否允许转岗、优先级/绩效影响 |
| 发展计划 | 生成 readiness gap、培养建议和闸门 | 候选人意愿、导师、职级、工作安排 |
| 外部灵活供给 | 生成 SOW 草案、能力单元与验收条件 | 供应商选择、采购、合同、数据/IP 边界 |
| 招聘 | 生成能力画像和作品/工作样本 | Headcount、薪酬、JD 发布、录用决定 |
| AI Enablement | 建议可自动化的辅助环节 | 工具批准、数据范围、最终责任人 |

## 8. P0 开发顺序与验收

1. 用 IP 种子语料输出两个关联缺口：协同机制 + 跨域工程供给。
2. 用规则生成 5–6 个能力单元，并标出耦合、Owner、接口和可用供给方式。
3. 为“整机系统集成”输出核心招聘画像和两个 Level 2/3 的成长计划草案。
4. 页面展示两套方案的比较：仅外招“全能人” vs 稳定核心 + 内部培养 + 专项/弹性供给；解释前者为何风险更高。
5. 每项建议均可展开到原始聊天证据，且所有外部/人事动作均显示“需人工确认”。

P0 成功不在于“自动找到人”，而在于让业务、技术和 HR 共同看清：需求为什么难满足，什么能力必须稳定拥有，什么可以灵活调用，以及怎样把接近的人更安全、更快地培养到可承担的层级。
