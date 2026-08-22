# 分阶段实施计划

来源：`docs/product/prd.md`；ADR 003。  

**两层纪律**

1. **S0 = 只写实施计划**（文档），不写产品代码。  
2. **S1 起 = 按计划与 stage-spec 实现**；须用户明确授权对应阶段。

| 阶段 | 名 | 类型 | 目标 | Spec |
|------|----|------|------|------|
| **S0** | **实施计划** | **文档** | V1  bite-sized 任务、文件地图、验证步骤、阶段依赖 | `stage-specs/S0.md` → `implementation-plan-v1.md` |
| S1 | 契约对齐 | 代码 | core 与领域对齐（refund/freeze）；门禁测试 | `stage-specs/S1.md` |
| S2 | CLI 垂直切片 | 代码 | 主理人 CLI 全 P0 路径（Mock） | `stage-specs/S2.md` |
| S3 | MCP 垂直切片 | 代码 | Envoy 工具面；禁盲执行 | `stage-specs/S3.md` |
| S4 | Web 垂直切片 | 代码 | 本地任务面 | `stage-specs/S4.md` |
| S5 | 支付宝 sandbox | 代码 | P0-14 适配器 | `stage-specs/S5.md` |

依赖：**S0 → S1 → S2 → (S3 ∥ S4) → S5**。
