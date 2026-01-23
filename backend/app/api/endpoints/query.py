from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.contract import Contract as ContractModel
from app.models.law_article import LawArticle as LawArticleModel
from app.models.user import User
from app.schemas.query import ContractOut, LawArticleOut

router = APIRouter()


@router.get("/contracts", response_model=list[ContractOut])
def list_contracts(
    q: str | None = Query(default=None, description="标题/描述关键字"),
    status: str | None = Query(default=None, description="合同状态过滤"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ContractOut]:
    query = db.query(ContractModel).filter(ContractModel.user_id == current_user.id)
    if status:
        query = query.filter(ContractModel.status == status)
    if q:
        like = f"%{q}%"
        query = query.filter(
            (ContractModel.title.like(like)) | (ContractModel.description.like(like))
        )
    rows = query.order_by(ContractModel.id.desc()).all()
    return [
        ContractOut(
            id=r.id,
            title=r.title,
            description=r.description,
            status=r.status,
            file_id=r.file_id,
            created_at=r.created_at,
        )
        for r in rows
    ]


@router.get("/laws", response_model=list[LawArticleOut])
def search_laws(
    keyword: str | None = Query(default=None, description="内容关键字"),
    law_name: str | None = Query(default=None, description="法律名称过滤"),
    db: Session = Depends(get_db),
) -> list[LawArticleOut]:
    query = db.query(LawArticleModel)
    if law_name:
        query = query.filter(LawArticleModel.law_name == law_name)
    if keyword:
        like = f"%{keyword}%"
        query = query.filter(LawArticleModel.content.like(like))
    rows = query.order_by(LawArticleModel.id.desc()).limit(50).all()
    return [
        LawArticleOut(
            id=r.id,
            law_name=r.law_name,
            article_no=r.article_no,
            content=r.content,
            created_at=r.created_at,
        )
        for r in rows
    ]

