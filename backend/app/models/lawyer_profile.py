"""
=============================================================================
文件: app/models/lawyer_profile.py
模块: 律师扩展信息模型
描述: 与 User 一对一，仅 role=lawyer 的用户可有记录；与前端律师列表/详情对齐
=============================================================================
"""

from sqlalchemy import ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class LawyerProfile(Base):
    """律师扩展信息：user_id 唯一，对应 users 表中 role=lawyer 的用户。"""

    __tablename__ = "lawyer_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(64))
    title: Mapped[str | None] = mapped_column(String(64), default=None)
    organization: Mapped[str | None] = mapped_column(String(255), default=None)
    license_number: Mapped[str | None] = mapped_column(String(64), default=None)
    practice_years: Mapped[str | None] = mapped_column(String(20), default=None)
    practice_area: Mapped[str | None] = mapped_column(String(128), default=None)
    expertise: Mapped[str | None] = mapped_column(String(255), default=None)
    introduction: Mapped[str | None] = mapped_column(Text, default=None)
    expertise_areas: Mapped[list | None] = mapped_column(JSON, default=None)
    language_skills: Mapped[str | None] = mapped_column(String(255), default=None)
    education: Mapped[dict | None] = mapped_column(JSON, default=None)
    work_experience: Mapped[list | None] = mapped_column(JSON, default=None)
    case_experience: Mapped[list | None] = mapped_column(JSON, default=None)
    avatar_emoji: Mapped[str | None] = mapped_column(String(20), default=None)
    tags: Mapped[list | None] = mapped_column(JSON, default=None)
    categories: Mapped[list | None] = mapped_column(JSON, default=None)

    user = relationship("User", backref="lawyer_profile")
