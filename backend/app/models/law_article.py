from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class LawArticle(Base):
    __tablename__ = "law_articles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    law_name: Mapped[str] = mapped_column(String(255), index=True)
    article_no: Mapped[str | None] = mapped_column(String(50), index=True)
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

