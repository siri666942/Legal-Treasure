"""
=============================================================================
文件: app/models/feedback.py
模块: 反馈模型
描述: 用户反馈表，与前端帮助与反馈页提交结构对齐
=============================================================================
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Feedback(Base):
    """反馈：type 1-5，content，contact，images 为 URL 或路径列表（JSON）。"""

    __tablename__ = "feedbacks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), index=True, default=None)
    type: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text)
    contact: Mapped[str | None] = mapped_column(String(128), default=None)
    images: Mapped[list | None] = mapped_column(JSON, default=None)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    user = relationship("User")
