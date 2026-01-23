from datetime import datetime

from pydantic import BaseModel


class ContractOut(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    file_id: int | None
    created_at: datetime


class LawArticleOut(BaseModel):
    id: int
    law_name: str
    article_no: str | None
    content: str
    created_at: datetime

