"""
=============================================================================
文件: app/api/router.py
模块: API 路由注册器
描述: 汇总所有 API 端点的路由，统一注册到主路由器
      类似于 Java Spring 中的路由配置类
=============================================================================

【路由结构】
/api/v1/
├── /auth/      # 认证相关接口
│   ├── POST /register  # 用户注册
│   ├── POST /login     # 用户登录
│   └── POST /token     # 获取 Token（OAuth2 标准格式）
├── /files/     # 文件管理接口
│   ├── POST /upload    # 上传文件
│   └── GET /           # 获取文件列表
└── /query/     # 数据查询接口
    ├── GET /contracts  # 查询合同列表
    └── GET /laws       # 查询法条列表
"""

from fastapi import APIRouter

from app.api.endpoints import auth, cases, feedback, files, lawyers, query

# 创建 API 主路由器
# 类似于 Java Spring 中的 @RequestMapping 注解在控制器类上的效果
api_router = APIRouter()

# 注册各模块的子路由
# include_router 类似于 Java Spring 中注册 Controller 到 DispatcherServlet
# prefix: 路由前缀，所有该模块的接口都会加上这个前缀
# tags: 用于 Swagger 文档分组显示
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(cases.router, prefix="/cases", tags=["cases"])
api_router.include_router(files.router, prefix="/files", tags=["files"])
api_router.include_router(lawyers.router, prefix="/lawyers", tags=["lawyers"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
api_router.include_router(query.router, prefix="/query", tags=["query"])
