---
name: organization-capability-radar
description: Analyze authorized, anonymized collaboration records to identify evidence-backed organizational capability gaps and propose action portfolios. Use when a user asks to diagnose recurring work friction, capability supply, operating mechanisms, or next actions beyond a simple chat summary.
---

# Organization Capability Radar

Turn collaboration evidence into a testable organizational capability diagnosis. The objective is not to name a person to hire or to summarize a chat. It is to distinguish local incidents from recurring capability or operating-system gaps, then recommend a responsible combination of development, internal mobility, flexible external supply, recruitment, AI enablement, and mechanism changes.

## Before analysis

- Work only with material the user is authorized to analyze. Do not request or retain raw internal records when a minimized or anonymized sample is enough.
- Confirm the business purpose and time window if they are missing. Treat names, locations, organizations, account credentials, customers, and project codenames as sensitive even if they occur in an ostensibly anonymized file.
- Do not rank individuals, infer performance, or recommend automated employment decisions. Do not infer a role from writing style alone.
- State data limits: missing roles, incomplete timestamps, attachments/media not visible to the model, or partial conversation coverage materially lower confidence.

## Analyze the work system, not isolated statements

1. Identify business goals, commitments, constraints and decision points.
2. Look openly for repeated friction across these lenses: capability supply, resource allocation, operating mechanism, decision/information interface, external dependency, and local delivery risk.
3. Form a candidate only when the record provides repetition, diversity of evidence, business linkage, traceability and a counter-evidence check. A one-off complaint remains an observation.
4. Define the desired **business outcome and capability**, not a job title. Break it into the smallest *responsible* units: each unit needs a deliverable, acceptance condition, interfaces and an accountable owner.
5. Create an action portfolio. Be decisive where evidence supports it, but say what would change the recommendation.

For the detailed output structure, evidence gate and handoff boundary, read [references/core-contract.md](references/core-contract.md).

## Action portfolio rules

- Assign a stable internal Integration Owner for outcomes that are high-coupling, strategic or continuous. Flexible supply may support this owner but cannot remove accountability.
- Recommend **Development** only with a real task, support owner, readiness gap and review gate. Do not relabel an unsupported person as ready.
- Recommend **External Flexible** only for units whose output, interface and acceptance condition can be stated clearly.
- Recommend **Recruitment** only when the capability is demonstrated to be continuous, core and high-coupling, and internal/external alternatives have failed or incur unacceptable context and coordination loss.
- Recommend **AI Enablement** for amplification, retrieval, variant generation, tagging, synthesis or administrative work. Keep factual, strategic and high-impact judgments with a named human owner.
- State the “now”, “next cycle” and “conditional long term” actions separately. Human decision makers retain final authority, but do not hide behind that fact to avoid making a reasoned recommendation.

## Boundary and handoff

After the portfolio, generate a `Capability Handoff Brief` for the selected next action. This skill stops after specifying the outcome, evidence, capability units, constraints, accountable owner, success evidence and open questions.

Do not expand unasked into a full curriculum, vendor purchase, recruiting execution, or AI tool implementation. Those belong to downstream systems such as a Capability Growth Studio, talent marketplace, procurement workflow, ATS or AI Enablement Workbench.
