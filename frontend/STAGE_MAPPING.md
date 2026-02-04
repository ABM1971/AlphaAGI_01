# Pipeline Stage Mapping 分析

## 前端显示的步骤（按顺序）

1. **Init** (初始化)
2. **KG Search** (图谱搜索)
3. **Retrieval** (三路检索)
4. **Story Gen** (故事生成)
5. **Agent Review** (智能评审)
6. **Refinement** (润色完善)

## 后端 Stage 定义 (stage_mapper.py)

| Stage Name | Progress | 对应前端步骤 |
|-----------|----------|------------|
| Initializing | 0.05 | Init |
| Recall | 0.15 | Retrieval |
| Pattern Selection | 0.30 | Retrieval |
| Story Generation | 0.45 | Story Gen |
| Critic Review | 0.60 | Agent Review |
| Refinement | 0.70 | Refinement |
| Novelty Check | 0.80 | Refinement |
| Verification | 0.88 | Refinement |
| Bundling | 0.95 | Refinement |
| Done | 1.0 | Done |
| Failed | 1.0 | Error |

## 后端事件类型到Stage的映射 (EVENT_TO_STAGE)

```python
EVENT_TO_STAGE = [
    ("run_error", "Failed"),
    ("run_end", "Done"),
    ("results_bundled", "Bundling"),
    ("verification_", "Verification"),
    ("novelty_", "Novelty Check"),
    ("critic_", "Critic Review"),
    ("review_", "Critic Review"),
    ("iteration", "Refinement"),
    ("pattern_selected", "Pattern Selection"),
    ("recall_", "Recall"),
]
```

## 前端映射 (api.ts stageToStep)

```typescript
const stageToStep: Record<string, PipelineStep> = {
  'Initializing': PipelineStep.INIT,
  'Recall': PipelineStep.RETRIEVAL,
  'Pattern Selection': PipelineStep.RETRIEVAL,
  'Story Generation': PipelineStep.GENERATION,
  'Critic Review': PipelineStep.REVIEW,
  'Refinement': PipelineStep.REFINEMENT,
  'Novelty Check': PipelineStep.REFINEMENT,
  'Verification': PipelineStep.REFINEMENT,
  'Bundling': PipelineStep.REFINEMENT,
  'Done': PipelineStep.DONE,
  'Failed': PipelineStep.ERROR,
};
```

## 问题和解决方案

### ❌ 问题1: KG Search 步骤没有对应的后端Stage

**现状：**
- 前端显示 "KG Search" 步骤
- 后端没有对应的 stage 或 event

**原因：**
- 后端的知识图谱查询是在 Recall 阶段完成的
- 没有单独的 KG Search 阶段

**建议方案：**

**方案A（推荐）：** 移除前端的 KG Search 步骤
- 简化为：Init → Retrieval → Story Gen → Agent Review → Refinement
- 与后端实际流程一致

**方案B：** 在后端添加 KG Search 事件
- 在 Recall 开始前添加 `kg_search_start` 事件
- 修改 stage_mapper.py 添加 "KG Search" stage

### ✅ 已修复: Initializing 和 Bundling 的映射

已添加到 stageToStep 映射中。

## 实际执行流程

```
1. run_start → Initializing (Init)
2. index_preflight_* → Initializing (Init) [如果需要构建索引]
3. recall_start → Recall (Retrieval)
4. pattern_selected → Pattern Selection (Retrieval)
5. story_generation → Story Generation (Story Gen)
6. critic_* / review_* → Critic Review (Agent Review)
7. iteration → Refinement (Refinement)
8. novelty_* → Novelty Check (Refinement)
9. verification_* → Verification (Refinement)
10. results_bundled → Bundling (Refinement)
11. run_end → Done
```

## 测试建议

1. 启动一个完整的 pipeline
2. 观察前端步骤是否正确高亮
3. 检查日志是否正确显示在对应步骤下
4. 验证进度条是否平滑过渡

## 当前状态

✅ 已修复映射关系
⚠️ KG Search 步骤需要决定保留或移除
✅ 所有后端 stage 都有对应的前端步骤
