# 青蚨使 · Qingfu Envoy

开源 **Agent 付款控制面**：Envoy **提议** → 主理人 **确认** → 持牌通道 **执行**（可退款请求）。  
不做支付牌照业务；**禁止静默自付**（[ADR 001](docs/decisions/001-no-license-no-silent-pay.md)）。

## 路线图（开源披露）

**完整路线图与里程碑：** [ROADMAP.md](ROADMAP.md)  
**披露维护说明：** [docs/OPEN-SOURCE-DISCLOSURE.md](docs/OPEN-SOURCE-DISCLOSURE.md)

当前：**规格与实施计划已就绪**；可运行产品 **尚未发布**；实现从 **S1** 起按公开 stage-spec 推进。

## 文档

| 文档 | 说明 |
|------|------|
| [ROADMAP](ROADMAP.md) | 里程碑、V1 范围、计划披露 |
| [PRD](docs/product/prd.md) | 产品范围权威 |
| [实施计划](docs/design/implementation-plan-v1.md) | 任务级计划（公开） |
| [文档索引](docs/README.md) | 全量链接 |
| [Contributing](CONTRIBUTING.md) | 贡献流程 |
| [Security](SECURITY.md) | 安全报告 |

## 开发

```bash
npm install && npm test   # 探索骨架（可选）
```

`packages/core` 为探索骨架；**S1** 起与 [实施计划](docs/design/implementation-plan-v1.md) 对齐。

## 许可

Apache-2.0
