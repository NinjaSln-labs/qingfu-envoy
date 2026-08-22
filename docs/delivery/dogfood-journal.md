# Dogfood 周记 · ADR 002

> 主理人自用记录：验证「提议 → 确认 → 执行」闭环与「放心拍」主观信任。  
> 退出：满 **4 周** 或累计 **≥20 笔** 真实允准（Mock 须标注环境）。

指标定义：[success-metrics.md](../product/success-metrics.md) · 硬门禁：**无人确认扣款 = 0**。

---

## 汇总（每周更新）

| 周次 | 日期 | 允准笔数 | 三端覆盖 | 无人确认扣款 | 备注 |
|------|------|----------|----------|--------------|------|
| W1 | | 0 | CLI / MCP / Web | 0 | |
| W2 | | | | 0 | |
| W3 | | | | 0 | |
| W4 | | | | 0 | |

**累计允准：** 0 / 20  
**北极星抽样（放心拍 ≥4/5）：** —

---

## 单笔记录模板（复制使用）

```markdown
### YYYY-MM-DD · 笔 #N

- **端：** CLI | MCP+CLI | Web | 组合
- **轨：** mock | alipay-sandbox
- **提议 ID：** 
- **金额 / 用途：** 
- **提议→允准耗时：** 
- **放心拍（1–5）：** 
- **异常 / 备注：** 
```

---

## 推荐路径（每周至少 1 条）

1. **MCP 提议** → CLI `approve` + `execute` → MCP `envoy_status` = executed  
   见 [mcp/README](../../packages/mcp/README.md)

2. **Web 允准** → 详情区审计时间线完整  
   见 [web/README](../../packages/web/README.md)

3. **CLI 全路径** propose → approve → execute → export → refund  
   见 [cli/README](../../packages/cli/README.md)

---

## 周记模板

```markdown
## Week N（YYYY-MM-DD – YYYY-MM-DD）

### 本周允准笔数
- 

### 三端
- [ ] CLI
- [ ] MCP
- [ ] Web

### 观察
- 提议堆积？
- 错误文案是否清晰？
- 急停 / 解冻是否顺手？

### 下周
- 
```
