"""
=============================================================================
文件: app/api/endpoints/query.py
模块: 数据查询端点
描述: 提供合同和法条的查询功能
      支持关键字搜索和条件过滤
=============================================================================

【接口列表】
GET /api/v1/query/contracts  - 查询合同列表（需要认证）
GET /api/v1/query/laws       - 搜索法条（公开接口）

【查询功能】
1. 合同查询：支持按标题/描述关键字搜索，按状态过滤
2. 法条搜索：支持按法律名称过滤，按内容关键字搜索
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.contract import Contract as ContractModel
from app.models.law_article import LawArticle as LawArticleModel
from app.models.user import User
from app.schemas.query import ContractOut, LawArticleOut

# 创建查询模块的路由器
router = APIRouter()


@router.get("/contracts", response_model=list[ContractOut])
def list_contracts(
    q: str | None = Query(default=None, description="标题/描述关键字"),
    status: str | None = Query(default=None, description="合同状态过滤"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ContractModel]:
    """
    查询合同列表
    
    【功能说明】
    查询当前用户的合同列表，支持以下过滤条件：
    1. 关键字搜索：在合同标题和描述中模糊匹配
    2. 状态过滤：按合同状态精确匹配
    
    【请求参数】
    - q: str | None - 搜索关键字（可选），在标题和描述中模糊查询
    - status: str | None - 状态过滤（可选），如 "draft"、"active" 等
    - db: Session - 数据库会话（依赖注入）
    - current_user: User - 当前登录用户（依赖注入，需要 Token）
    
    【返回值】
    list[ContractOut]: 合同信息列表
        - id: int - 合同ID
        - title: str - 合同标题
        - description: str | None - 合同描述
        - status: str - 合同状态
        - file_id: int | None - 关联的文件ID
        - created_at: datetime - 创建时间
    
    【使用示例】
    GET /api/v1/query/contracts?q=租赁&status=active
    Authorization: Bearer <token>
    
    【注意事项】（与Java的区别）
    Query() 是 FastAPI 的查询参数装饰器，类似 Java Spring 的 @RequestParam
    default=None 设置默认值为 None，description 用于 API 文档
    """
    # 构建基础查询：只查询当前用户的合同
    query = db.query(ContractModel).filter(ContractModel.user_id == current_user.id)
    
    # 如果指定了状态，添加状态过滤条件
    if status:
        query = query.filter(ContractModel.status == status)
    
    # 如果指定了关键字，添加模糊查询条件
    if q:
        like = f"%{q}%"  # 构建 LIKE 模式：%关键字%
        # 使用 | 运算符组合 OR 条件（标题包含关键字 OR 描述包含关键字）
        query = query.filter(
            (ContractModel.title.like(like)) | (ContractModel.description.like(like))
        )
    
    # 按 ID 降序返回结果（最新的在前）
    return query.order_by(ContractModel.id.desc()).all()


@router.get("/laws", response_model=list[LawArticleOut])
def search_laws(
    keyword: str | None = Query(default=None, description="内容关键字"),
    law_name: str | None = Query(default=None, description="法律名称过滤"),
    db: Session = Depends(get_db),
) -> list[LawArticleModel]:
    """
    搜索法条
    
    【功能说明】
    搜索法条数据库，支持以下过滤条件：
    1. 法律名称：按法律名称精确过滤
    2. 关键字搜索：在法条内容中模糊匹配
    
    注意：此接口为公开接口，无需登录即可访问。
    
    【请求参数】
    - keyword: str | None - 搜索关键字（可选），在法条内容中模糊查询
    - law_name: str | None - 法律名称（可选），精确匹配
    - db: Session - 数据库会话（依赖注入）
    
    【返回值】
    list[LawArticleOut]: 法条信息列表（最多返回50条）
        - id: int - 法条ID
        - law_name: str - 法律名称
        - article_no: str | None - 条款号
        - content: str - 法条内容
        - created_at: datetime - 创建时间
    
    【使用示例】
    GET /api/v1/query/laws?law_name=民法典&keyword=合同
    
    【设计说明】
    1. 此接口不需要认证，方便用户快速查询法条
    2. 结果限制为50条，防止返回过多数据影响性能
    """
    # 构建基础查询
    query = db.query(LawArticleModel)
    
    # 如果指定了法律名称，添加精确过滤条件
    if law_name:
        query = query.filter(LawArticleModel.law_name == law_name)
    
    # 如果指定了关键字，添加内容模糊查询条件
    if keyword:
        like = f"%{keyword}%"
        query = query.filter(LawArticleModel.content.like(like))
    
    # 按 ID 降序返回结果，限制最多返回50条
    # limit(50) 相当于 SQL 的 LIMIT 50
    return query.order_by(LawArticleModel.id.desc()).limit(50).all()
