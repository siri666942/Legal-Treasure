"""
=============================================================================
文件: app/api/endpoints/feedback.py
模块: 反馈接口
描述: 提交用户反馈，与前端帮助与反馈页对接
=============================================================================
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user_optional
from app.db.session import get_db
from app.models.feedback import Feedback
from app.models.user import User
from app.schemas.feedback import FeedbackCreateIn, FeedbackOut

router = APIRouter()


@router.post("", response_model=FeedbackOut, status_code=201)
def create_feedback(
    payload: FeedbackCreateIn,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    """提交反馈；已登录则记录 user_id，未登录也可提交。"""
    fb = Feedback(
        user_id=current_user.id if current_user else None,
        type=payload.type,
        content=payload.content,
        contact=payload.contact,
        images=payload.images[:3] if payload.images else None,
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return FeedbackOut(
        id=fb.id,
        type=fb.type,
        content=fb.content,
        contact=fb.contact,
        created_at=fb.created_at,
    )
