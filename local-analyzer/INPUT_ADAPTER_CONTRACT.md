# Input Adapter Contract｜输入适配层契约

## 目的

Adapter 的职责是把用户明确授权的输入转换为 `CanonicalConversation`。它不分析组织问题、不做脱敏决策，也不调用模型。

```text
原始文件 / 截图 / 转发记录
        ↓ Adapter
CanonicalConversation + 数据质量报告
        ↓ 本地脱敏与人工确认
Capability Orchestration Core
```

## 最小输出

```ts
type CanonicalMessage = {
  id: string;
  sequence: number;
  sentAt?: string;
  author?: string;
  text: string;
  sourceConfidence: 'high' | 'medium' | 'low';
  extractionNotes?: string[];
};

type AdapterResult = {
  sourceType: 'json' | 'markdown' | 'text' | 'image' | 'document' | 'forwarded-chat';
  messages: CanonicalMessage[];
  quality: {
    messageBoundaryConfidence: 'high' | 'medium' | 'low';
    timeCoverage: 'full' | 'partial' | 'missing';
    authorCoverage: 'full' | 'partial' | 'missing';
    warnings: string[];
  };
};
```

## 不可违反的规则

1. 不得捏造时间、发言人、消息顺序、群组或附件含义。
2. OCR 或转发消息解析不确定时，必须保留 `sourceConfidence` 与 `warnings`。
3. 若时间或发言人缺失，Core 只能降低证据强度；不能把结果标为强系统性判断。
4. Adapter 默认只在本地处理；若使用云端 OCR，必须在发送前显示服务商、发送范围和独立确认项。
5. 原始文件不写入 Git 仓库、浏览器持久化存储或遥测日志。

## 共创优先级

1. 可配置 JSON 字段映射。
2. 微信/飞书转发记录与 Markdown Adapter。
3. 图片 OCR Adapter 与人工修订界面。
4. PDF、Word、表格提取。

每个 Adapter 贡献必须附带完全虚构的测试样例，不能提交真实聊天截图或真实组织记录。
