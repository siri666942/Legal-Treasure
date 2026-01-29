"""
=============================================================================
文件: app/main.py
模块: 应用入口
描述: FastAPI 应用的创建和配置入口点
      负责初始化应用、配置中间件、注册路由和启动事件
=============================================================================
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.db.session import init_db


def create_app() -> FastAPI:
    """
    创建并配置 FastAPI 应用实例
    
    【功能说明】
    1. 创建 FastAPI 应用，设置项目名称和版本
    2. 配置 CORS（跨域资源共享）中间件，允许前端跨域访问
    3. 注册启动事件，在应用启动时初始化数据库
    4. 添加健康检查端点
    5. 注册 API 路由
    
    【返回值】
    FastAPI: 配置完成的 FastAPI 应用实例
    
    【使用示例】
    使用 uvicorn 启动: uvicorn app.main:app --reload
    """
    # 创建 FastAPI 应用实例，设置项目名称和版本号（用于 API 文档显示）
    app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

    # 配置 CORS 中间件（如果配置了允许的源）
    # CORS 允许浏览器中的前端应用跨域访问此后端 API
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.BACKEND_CORS_ORIGINS,  # 允许的源列表
            allow_credentials=True,                        # 允许携带认证信息（如 Cookie）
            allow_methods=["*"],                          # 允许所有 HTTP 方法
            allow_headers=["*"],                          # 允许所有请求头
        )

    @app.on_event("startup")
    def _startup() -> None:
        """
        应用启动事件处理器
        
        【触发时机】
        FastAPI 应用启动时自动调用
        
        【功能说明】
        调用 init_db() 初始化数据库，创建所有表结构
        """
        init_db()

    @app.get("/health")
    def health() -> dict:
        """
        健康检查端点
        
        【用途】
        供负载均衡器或监控系统检测服务是否正常运行
        
        【返回值】
        dict: {"status": "ok"} 表示服务正常
        """
        return {"status": "ok"}

    # 注册 API 路由，所有接口都以 /api/v1 为前缀
    app.include_router(api_router, prefix=settings.API_V1_STR)
    return app


# 创建全局应用实例
# 这个实例会被 ASGI 服务器（如 uvicorn）加载和运行
app = create_app()
