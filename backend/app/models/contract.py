"""
=============================================================================
文件: app/models/contract.py
模块: 合同模型
描述: 定义合同数据表结构（contracts 表）
      存储用户的合同信息，包括标题、描述、状态等
=============================================================================

【表结构】
contracts 表
├── id          - 主键，自增整数
├── user_id     - 外键，关联 users 表
├── file_id     - 外键，关联 uploaded_files 表（可空）
├── title       - 合同标题
├── description - 合同描述
├── status      - 合同状态（draft/active/expired 等）
└── created_at  - 创建时间

【关联关系】
- Contract N:1 User (多个合同属于一个用户)
- Contract N:1 UploadedFile (一个合同可以关联一个文件)
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Contract(Base):
    """
    合同模型类
    
    【类说明】
    ORM 映射类，对应数据库中的 contracts 表。
    存储用户的合同信息，可以关联上传的合同文件。
    
    【状态说明】
    status 字段的可能值：
    - "draft": 草稿，合同正在编辑中
    - "active": 生效中，合同已签署正在执行
    - "expired": 已过期，合同已到期
    - "terminated": 已终止，合同被提前终止
    
    【字段说明】
    - id: 主键
    - user_id: 合同所有者的用户ID
    - file_id: 关联的文件ID（可选）
    - title: 合同标题
    - description: 合同详细描述
    - status: 合同状态
    - created_at: 创建时间
    """
    
    __tablename__ = "contracts"

    # ======================== 主键 ========================
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # ======================== 外键关联 ========================
    # 合同所有者
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    
    # 关联的文件（可空）
    # Mapped[int | None] 表示此字段可以为 NULL
    file_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("uploaded_files.id"), index=True
    )

    # ======================== 合同信息字段 ========================
    # 合同标题
    title: Mapped[str] = mapped_column(String(255))
    
    # 合同描述，使用 Text 类型支持长文本
    # Text 在 MySQL 中映射为 TEXT 类型，在 SQLite 中也是 TEXT
    description: Mapped[str | None] = mapped_column(Text)
    
    # 合同状态，默认为 "draft"（草稿）
    # index=True: 为状态字段创建索引，因为经常按状态查询
    status: Mapped[str] = mapped_column(String(50), default="draft", index=True)

    # ======================== 时间戳字段 ========================
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # ======================== 关系映射 ========================
    # 关联的用户对象，可通过 contract.user 访问
    user = relationship("User")
    
    # 关联的文件对象，可通过 contract.file 访问
    file = relationship("UploadedFile")
