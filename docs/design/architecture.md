# 架构 · 青蚨使（概念）

- Status: accepted
- Date: 2026-08-22
- 服从：`docs/product/prd.md`；`docs/design/domain-model.md`

## 视图

```text
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  CLI 壳     │  │  MCP 壳     │  │ 本地 Web 壳 │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────────────┬───┴────────────────┘
                    ▼
            ┌───────────────┐
            │ Application   │  用例：propose/approve/execute/refund/freeze/export
            │ + 单主理人门禁 │
            └───────┬───────┘
                    ▼
            ┌───────────────┐
            │ Domain Core   │  PaymentProposal / Envoy / Audit
            └───────┬───────┘
         ┌──────────┼──────────┐
         ▼          ▼          ▼
   AuditSink   PaymentRail   (未来) Notify
   (文件/SQLite)  Mock │ Alipay sandbox
```

## 部署与信任

| 项 | V1 |
|----|-----|
| 拓扑 | 单机本地进程；Web 默认 bind localhost |
| 主理人 | 本地单用户；无多租户 |
| 密钥 | 环境变量 / OS 钥匙串；禁止写入仓库与审计明文 |
| 审计存储 | 本地目录或 SQLite；只追加 |
| 网络 | 仅轨适配器出站调用支付宝 sandbox/生产网关 |

## 包结构（目标）

```text
packages/core          领域 + 应用用例
packages/cli           主理人 CLI
packages/mcp           Envoy 工具面
packages/web           本地任务面
packages/rails-mock    （可内嵌 core）
packages/rails-alipay  支付宝 sandbox/生产适配器
```

## 风险控制

- MCP 不得暴露「免确认 execute」给不可信客户端。  
- 生产密钥切换须人工确认（Spec 六核心 Ask first）。
