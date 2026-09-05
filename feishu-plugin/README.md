# Feishu Plugin｜飞书插件骨架

这是 Organization Capability Radar 的第三种产品形态：在飞书群中以机器人方式触发一次受控分析。

## 第一版原则

- 只有群成员主动发送命令才开始；不做隐蔽或持续监听。
- 只处理命令之后、用户明确指定的最小消息范围；历史消息读取必须另行授权。
- 把飞书消息转成同一份 `CanonicalConversation`，复用 Capability Orchestration Core。
- 返回的是私密/群内的建议草案卡片，不自动发起招聘、调动、培养、采购或组织调整。
- 不在仓库中保存 App ID、App Secret、Verification Token、Encrypt Key 或模型 API Key。

## 计划中的命令

```text
@能力雷达 分析本线程
@能力雷达 分析最近 20 条
@能力雷达 帮助
```

第一版只支持用户主动触发的“本线程 / 指定消息窗口”。跨群历史分析、定时扫描和自动告警不在范围内。

## 本地开发

```text
npm start
```

这是一个无依赖的 Node.js 骨架。它可以接收飞书的 URL 校验事件，并把消息事件正规化、生成待发送的卡片草案；其内部流水线已经分为 `Adapter → 脱敏 → Core → 结果卡片`。没有配置真实凭据和模型 Adapter 时，不会连接飞书、读取额外消息或发送任何消息。

真实接入前，请按照 [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) 创建飞书企业自建应用，并把凭据配置在用户级安全位置，不要复制进项目文件。
