"""
=============================================================================
文件: app/models/law_article.py
模块: 法条模型
描述: 定义法律条文数据表结构（law_articles 表）
      存储法律法规的具体条款内容，用于法律查询功能
=============================================================================

【表结构】
law_articles 表
├── id          - 主键，自增整数
├── law_name    - 法律名称（如"民法典"）
├── article_no  - 条款编号（如"第一百条"）
├── content     - 条款内容
└── created_at  - 创建时间

【使用场景】
1. 法条搜索：用户输入关键词，在 content 中模糊匹配
2. 法律浏览：按法律名称筛选，查看该法律的所有条款
3. 合同审查：AI 引用相关法条作为法律依据
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class LawArticle(Base):
    """
    法条模型类
    
    【类说明】
    ORM 映射类，对应数据库中的 law_articles 表。
    存储法律法规的条款内容，支持法条搜索和引用功能。
    
    【数据来源】
    法条数据通常来自：
    1. 官方法律法规数据库导入
    2. 人工整理录入
    3. 第三方法律数据API
    
    【字段说明】
    - id: 主键
    - law_name: 法律名称，如 "中华人民共和国民法典"
    - article_no: 条款编号，如 "第五百零一条"
    - content: 条款的完整内容
    - created_at: 数据创建/导入时间
    
    【查询优化】
    - law_name 和 article_no 都有索引，支持快速精确查询
    - 对于 content 的全文搜索，简单场景使用 LIKE
    - 生产环境建议使用专门的全文搜索引擎（如 Elasticsearch）
    """
    
    __tablename__ = "law_articles"

    # ======================== 主键 ========================
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # ======================== 法条标识字段 ========================
    # 法律名称，如 "民法典"、"刑法"、"合同法" 等
    # 索引用于快速按法律名称过滤
    law_name: Mapped[str] = mapped_column(String(255), index=True)
    
    # 条款编号，如 "第一条"、"第一百二十三条" 等
    # 可空，因为有些法规可能没有明确的条款编号
    article_no: Mapped[str | None] = mapped_column(String(50), index=True)
    
    # ======================== 内容字段 ========================
    # 法条的完整文本内容
    # 使用 Text 类型，支持长文本存储
    content: Mapped[str] = mapped_column(Text)
    
    # ======================== 时间戳字段 ========================
    # 数据创建时间
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
