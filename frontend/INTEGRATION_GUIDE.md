# Idea2Paper Frontend Integration Guide

## 概述

前端已成功更新为现代化的 React + TypeScript + Vite 应用，并完成了与后端 API 的对接。

## 架构说明

### 后端 API

后端服务器位于 `frontend/server/app.py`，提供以下 API 端点：

#### 1. 启动 Pipeline
```
POST /api/runs
Content-Type: application/json

{
  "idea": "研究想法描述",
  "config": {
    "config_overrides": {
      "SILICONFLOW_API_KEY": "your-api-key",
      "LLM_API_URL": "https://api.siliconflow.cn/v1/chat/completions",
      "LLM_MODEL": "Pro/zai-org/GLM-4.7",
      "I2P_NOVELTY_ENABLE": "1",
      "I2P_VERIFICATION_ENABLE": "1",
      ...
    }
  }
}

Response:
{
  "ok": true,
  "ui_run_id": "ui_1234567890_abc123",
  "pid": 12345,
  "run_id": null
}
```

#### 2. 查询运行状态
```
GET /api/runs/{ui_run_id}

Response:
{
  "ok": true,
  "ui_run_id": "ui_1234567890_abc123",
  "run_id": "run_20260205_103045_12345_abc123",
  "status": "running|done|failed",
  "stage": {
    "name": "Story Generation",
    "progress": 0.45,
    "detail": "Generating structured story",
    "activity": {
      "llm_active": true,
      "embedding_active": false
    }
  },
  "started_at": "2026-02-05T10:30:45Z",
  "paths": {
    "log_dir": "/path/to/log/run_xxx",
    "results_dir": "/path/to/results/run_xxx"
  }
}
```

#### 3. 获取事件日志（新增）
```
GET /api/runs/{ui_run_id}/events

Response:
{
  "ok": true,
  "run_id": "run_20260205_103045_12345_abc123",
  "events": [
    {
      "ts": "2026-02-05T10:30:45.123456+00:00",
      "run_id": "run_xxx",
      "type": "event",
      "data": {
        "event_type": "recall_start",
        "payload": {...}
      }
    },
    ...
  ],
  "count": 42
}
```

#### 4. 获取最终结果
```
GET /api/runs/{ui_run_id}/result

Response:
{
  "ok": true,
  "run_id": "run_xxx",
  "final_story": {
    "title": "...",
    "abstract": "...",
    "introduction": "...",
    "methodology": "...",
    "experiments": "...",
    "contributions": [...]
  },
  "pipeline_result": {
    "success": true,
    "review_history": [...],
    "verification_summary": {...},
    "novelty_report": {...}
  },
  "summary": {
    "success": true,
    "avg_score": 8.5,
    "verification": {...},
    "novelty": {...}
  }
}
```

#### 5. 下载日志
```
GET /api/runs/{ui_run_id}/logs.zip

Response: ZIP file download
```

### 前端架构

#### 目录结构
```
web/
├── App.tsx                 # 主应用组件
├── index.tsx              # 入口文件
├── index.html             # HTML 模板
├── types.ts               # TypeScript 类型定义
├── components/            # React 组件
│   ├── Layout.tsx         # 主布局
│   ├── IdeaInput.tsx      # 想法输入
│   ├── PipelineVisualizer.tsx  # Pipeline 可视化
│   ├── ResultViewer.tsx   # 结果查看器
│   ├── ConfigPanel.tsx    # 配置面板
│   └── ApiDocs.tsx        # API 文档
├── services/              # 服务层
│   └── api.ts             # API 服务（已对接）
├── package.json           # 依赖配置
├── vite.config.ts         # Vite 配置
└── tsconfig.json          # TypeScript 配置
```

#### API 服务对接

`services/api.ts` 已完成对接，支持：

1. **Mock 模式**：无需后端，使用模拟数据
2. **真实 API 模式**：连接到后端服务器

**关键功能：**
- 启动 Pipeline 并传递完整配置
- 轮询状态更新（每 2 秒）
- 实时获取事件日志
- 自动转换后端事件为前端日志格式
- 支持中断操作（AbortSignal）

## 使用指南

### 1. 启动后端服务器

```bash
cd frontend/server
python app.py --host 127.0.0.1 --port 8080
```

服务器将在 `http://127.0.0.1:8080` 启动。

### 2. 安装前端依赖

```bash
cd frontend/web
npm install
```

### 3. 启动前端开发服务器

```bash
npm run dev
```

前端将在 `http://localhost:5173` 启动（Vite 默认端口）。

### 4. 配置前端

在浏览器中打开前端，进入 **Configuration** 页面：

#### Mock 模式（默认）
- 切换 "Mock Mode" 开关为 ON
- 无需配置其他参数
- 适合前端开发和演示

#### 真实 API 模式
1. 切换 "Mock Mode" 开关为 OFF
2. 配置后端地址：`http://localhost:8080`
3. 配置 SiliconFlow API Key
4. 配置其他参数（LLM、Embedding 等）
5. 点击保存

### 5. 运行 Pipeline

1. 进入 **Dashboard** 页面
2. 输入研究想法
3. 点击 "Generate Story"
4. 实时查看 Pipeline 执行进度
5. 完成后在 **Paper Viewer** 查看结果

## 配置参数映射

前端配置面板的参数会自动映射为后端环境变量：

| 前端配置 | 后端环境变量 | 说明 |
|---------|------------|------|
| `siliconFlowApiKey` | `SILICONFLOW_API_KEY` | SiliconFlow API 密钥 |
| `llmUrl` | `LLM_API_URL` | LLM API 地址 |
| `llmModel` | `LLM_MODEL` | LLM 模型名称 |
| `embeddingUrl` | `EMBEDDING_API_URL` | 嵌入 API 地址 |
| `embeddingModel` | `EMBEDDING_MODEL` | 嵌入模型名称 |
| `ideaPackaging.enable` | `I2P_IDEA_PACKAGING_ENABLE` | 是否启用 Idea Packaging |
| `novelty.enable` | `I2P_NOVELTY_ENABLE` | 是否启用新颖性检查 |
| `novelty.action` | `I2P_NOVELTY_ACTION` | 新颖性检查动作 |
| `verification.enable` | `I2P_VERIFICATION_ENABLE` | 是否启用验证 |
| `verification.collisionThreshold` | `I2P_COLLISION_THRESHOLD` | 碰撞阈值 |
| `llmTemperatures.default` | `I2P_LLM_TEMPERATURE_DEFAULT` | 默认温度 |
| `critic.strictJson` | `I2P_CRITIC_STRICT_JSON` | 严格 JSON 模式 |
| `logging.enable` | `I2P_ENABLE_LOGGING` | 启用日志 |
| `results.enable` | `I2P_RESULTS_ENABLE` | 启用结果保存 |

## Pipeline 可视化

### 阶段映射

后端的 stage 会自动映射为前端的 PipelineStep：

| 后端 Stage | 前端 Step | 进度 |
|-----------|----------|------|
| Recall | RETRIEVAL | 15% |
| Pattern Selection | RETRIEVAL | 30% |
| Story Generation | GENERATION | 45% |
| Critic Review | REVIEW | 60% |
| Refinement | REFINEMENT | 70% |
| Novelty Check | REFINEMENT | 80% |
| Verification | REFINEMENT | 88% |
| Bundling | REFINEMENT | 95% |
| Done | DONE | 100% |
| Failed | ERROR | 100% |

### 实时日志

前端会每 2 秒轮询后端的 `/api/runs/{ui_run_id}/events` 端点，获取新的事件日志并显示在 Pipeline Visualizer 中。

## 生产部署

### 构建前端

```bash
cd frontend/web
npm run build
```

构建产物会生成在 `web/dist/` 目录。

### 部署方案

#### 方案 1：使用后端服务器提供静态文件

后端服务器已经支持提供静态文件，将构建产物复制到 `web/` 目录即可：

```bash
npm run build
# 构建产物已在 web/dist/ 中
# 后端会自动从 web/ 目录提供静态文件
```

#### 方案 2：使用 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/web/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 故障排查

### 前端无法连接后端

1. 检查后端服务器是否运行：`curl http://localhost:8080/api/health`
2. 检查前端配置中的 `baseUrl` 是否正确
3. 检查浏览器控制台的网络请求

### Pipeline 启动失败

1. 检查 SiliconFlow API Key 是否正确
2. 检查后端日志：`tail -f frontend/server/logs/*.log`
3. 检查 Pipeline 脚本是否可执行：`python Paper-KG-Pipeline/scripts/idea2story_pipeline.py "test"`

### 日志不更新

1. 检查 `I2P_ENABLE_LOGGING` 是否为 `1`
2. 检查日志目录是否存在：`ls -la log/`
3. 检查事件日志文件：`tail -f log/run_*/events.jsonl`

## 开发建议

### 添加新的配置参数

1. 在 `web/types.ts` 的 `AppConfig` 接口中添加新字段
2. 在 `web/App.tsx` 的默认配置中添加默认值
3. 在 `web/components/ConfigPanel.tsx` 中添加 UI 控件
4. 在 `web/services/api.ts` 的 `config_overrides` 中添加映射
5. 确保后端 `idea2paper/config.py` 支持该环境变量

### 添加新的 Pipeline 阶段

1. 在后端 `frontend/server/stage_mapper.py` 的 `STAGE_ORDER` 中添加新阶段
2. 在 `EVENT_TO_STAGE` 中添加事件映射
3. 在前端 `web/services/api.ts` 的 `stageToStep` 中添加映射

## 总结

✅ **已完成：**
- 后端 API 增强，支持完整配置参数
- 新增事件日志端点 `/api/runs/{ui_run_id}/events`
- 前端 API 服务完整对接
- 实时 Pipeline 状态轮询
- 事件日志实时获取和显示
- 配置参数自动映射

🎯 **可以使用：**
- Mock 模式：立即可用，无需后端
- 真实 API 模式：配置后端地址和 API Key 即可

📝 **下一步：**
- 测试完整流程
- 根据需要调整轮询间隔
- 添加更多错误处理
- 优化用户体验
