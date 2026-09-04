# 能力缺口识别、证据聚合与 Action 规则

## 1. 可解释流水线

每条消息经 `MessageSourceAdapter` 输入。P0 用词典/模式规则产生 `Signal`，而不是调用模型：

| 信号类型 | 例子 | 权重 |
|---|---|---:|
| business_goal | “美国版下个月必须上线” | 2 |
| delivery_blocker | “支付失败定位不出来” | 3 |
| missing_skill | “没人有 Stripe 经验” | 4 |
| urgency | “不能再拖” | 2 |
| solution_hint | “找外部的人 / 补一个人” | 1 |

`Signal.capabilityTags` 映射到能力分类表，例如 Stripe、国际支付、支付架构 → `international_payment_integration`。每个信号保留 `messageId`、原文片段、规则 ID，成为不可丢失的 evidence。

## 2. 先判断：局部硬伤还是系统性问题

局部硬伤是边界清楚、影响局限于一个交付事项、可由外部服务/短训/工具解决的问题，例如一次 Stripe 集成故障。它可以产生能力信号，但不能仅凭一条项目链就生成“新增岗位”。

系统性问题至少满足以下三项中的两项，才进入“组织能力诊断”：

1. **跨边界重复**：在两个以上产品、项目或部门中出现相同障碍。
2. **目标—组织错配**：业务目标需要跨域协同，但当前部门边界、预算或决策权按孤立产品设置。
3. **能力组合错配**：岗位需要软件、硬件、产品迁移等组合能力，市场供给与内部工作饱和度均不支持将它拆成一个标准职位。

诊断输出新增字段：`problemNature: 'local' | 'systemic'` 与 `systemicDrivers: ('structure'|'operating_model'|'capability_portfolio'|'resource_allocation')[]`。只有 `systemic` 问题才可显示“组织设计建议”。注意：`systemic` 不是 Recruit 的反面。系统应独立计算“人才供给缺口”，当岗位/能力在多个项目持续需要、内部供给不足、且可形成稳定能力单元时，仍应将 Recruit 作为必要行动。

## 3. 缺口计算

针对能力 c、最近 14 天已播放信号：

`score(c) = Σ(signal.weight × confidence) + deadlineBonus + repeatedBlockerBonus - existingCapacityBonus`

- `deadlineBonus`: 14 天内上线 +2；30 天内 +1。
- `repeatedBlockerBonus`: 不同消息中 blocker ≥2，+3。
- `existingCapacityBonus`: 员工目录中有可用同类高级能力，−4。
- `confidence`: `min(0.95, 0.35 + 0.12 × distinctEvidenceCount + 0.15 × directMissingSkillCount)`。
- Priority：score ≥9 为 High；5–8 为 Medium；其余 Low。置信度 <0.55 时状态为 `observing`，不推荐不可逆行动。

支付种子数据期望：国际支付集成可成为 High，但 `problemNature=local`；行动优先为 Outsource/Train，Recruit 必须低于 40，除非后续多个项目证明该能力为长期核心。

IP 跨品类种子数据期望：“IP 生命周期经营与跨品类协同”应为 High/High、`problemNature=systemic`，并有三个产品组的独立证据。

## 4. 行动决策（排序而非单选）

先生成五种 `ActionRecommendation`，再按 score 排序。行动分数范围 0–100；显示前两项，允许展开全部。

| Action | 加分条件 | 减分条件 |
|---|---|---|
| Recruit | 长期需求、无内部能力、紧急且核心能力 | 上线窗口 <30 天、可外包解决 |
| Internal Mobility | 员工目录有相邻能力、可用性高 | 无相邻能力或当前项目不可释放 |
| Train | 时间窗口 ≥60 天、基础能力存在、能力可学习 | 关键上线 <30 天或无导师 |
| Outsource | 突发/项目制、外部专家可快速进场 | 属于长期核心差异化能力 |
| AI Enablement | 工作可拆成标准化、工具能可靠辅助 | 需要架构责任、合规/安全高风险 |

### P0 决策伪代码

```ts
recruit = longTerm*30 + noInternalCapacity*25 + coreCapability*20 - urgentUnder30Days*15
internal = adjacentTalent*45 + availability*25 - releaseRisk*20
train = learningWindow*35 + foundationSkill*30 - urgentUnder30Days*35
outsource = urgentUnder30Days*30 + projectBased*30 + vendorAvailable*15 - longTerm*20
ai = standardizable*35 + toolMaturity*25 - architectureOwnership*35 - complianceRisk*20
```

“国际支付集成”示例：Outsource 82（短期止血）、Train 48（形成基础认知）、Recruit 22、Internal 18、AI 10。界面必须说明：这是局部硬伤，当前不构成新增岗位理由。

“IP 生命周期经营与跨品类协同”示例：Recruit 86（补足稳定的跨域研发能力供给）、Internal Mobility 84（建立 IP 级虚拟团队/共享能力池）、Train 72（培养软硬一体与技术迁移能力）、Outsource 45（峰值弹性）、AI 30。Recruit 的对象不是一个“即插即用的全能人”，而是少量具备强技术迁移能力、可在非标准产品间工作的核心研发人员；画像必须允许通过培养与团队组合弥补单人不具备的深度。额外的组织设计建议：从“以单一产品部门为唯一管理单元”转向“IP Owner + 跨品类产品线 + 共享技术能力池”的矩阵式协同机制。此建议不是自动重组命令，而是需管理层验证的假设。

## 5. 未来 LLM 增强（非 P0）

保留 `SignalExtractor` 接口。LLM 实现必须返回相同结构、引用原消息、显示模型与置信度；其结果须经规则校验，且不得自行触发 HR 或招聘动作。
