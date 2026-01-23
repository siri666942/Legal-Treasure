# 律宝小队 - 后端（FastAPI）

## 运行环境
- Python 3.10+（推荐 3.11）

## 安装依赖
在 `backend/` 目录下执行：

```bash
python -m pip install -r requirements.txt
```

## 启动服务
在 `backend/` 目录下执行：

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

启动后：
- Swagger：`http://127.0.0.1:8000/docs`
- OpenAPI：`http://127.0.0.1:8000/openapi.json`

## 本地自测
先启动服务，再在 `backend/` 目录下执行：

```bash
python scripts/self_test.py
```

