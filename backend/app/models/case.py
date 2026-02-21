"""
=============================================================================
文件: app/models/case.py
模块: 案件模型
描述: 定义案件数据表结构（cases 表）
      存储律师/客户案件信息，与前端案件列表、详情、创建表单对齐
=============================================================================

【表结构】
cases 表
├── id             - 主键
├── case_no        - 案号
├── title          - 案件标题
├── case_type      - 案件类型（合同纠纷、婚姻家庭等）
├── status         - pending/processing/completed（对应前端 statusType）
├── progress       - 进度 0-100
├── court          - 受理法院
├── judge          - 承办法官
├── filing_date    - 立案时间（日期字符串或 date）
├── amount         - 标的金额（字符串）
├── applicable_law  - 适用法律
├── lawyer_id      - 外键，承办律师
├── client_id      - 外键，客户（可空，待绑定）
└── created_at     - 创建时间
"""

from datetime import date, datetime, timezone

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Case(Base):
    """案件模型：律师创建，关联律师与客户，前端案件列表/详情/创建表单对接。"""

    __tablename__ = "cases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    case_no: Mapped[str] = mapped_column(String(64), index=True)
    title: Mapped[str] = mapped_column(String(255))
    case_type: Mapped[str | None] = mapped_column(String(64), default=None)
    status: Mapped[str] = mapped_column(String(32), default="pending", index=True)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    court: Mapped[str | None] = mapped_column(String(255), default=None)
    judge: Mapped[str | None] = mapped_column(String(64), default=None)
    filing_date: Mapped[date | None] = mapped_column(Date, default=None)
    amount: Mapped[str | None] = mapped_column(String(64), default=None)
    applicable_law: Mapped[str | None] = mapped_column(Text, default=None)
    lawyer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    client_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), index=True, default=None)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    lawyer = relationship("User", foreign_keys=[lawyer_id])
    client = relationship("User", foreign_keys=[client_id])
