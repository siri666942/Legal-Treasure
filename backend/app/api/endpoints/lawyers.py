"""
=============================================================================
文件: app/api/endpoints/lawyers.py
模块: 律师接口
描述: 律师列表、律师详情，与前端 find-lawyer / lawyer-detail 对接
=============================================================================
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.lawyer_profile import LawyerProfile
from app.models.user import User
from app.schemas.lawyer import LawyerDetailOut, LawyerEducation, LawyerListItem, LawyerStats

router = APIRouter()


@router.get("", response_model=list[LawyerListItem])
def list_lawyers(
    keyword: str | None = Query(default=None, description="搜索关键词"),
    category: str | None = Query(default=None, description="专业领域/分类"),
    db: Session = Depends(get_db),
):
    """律师列表：可公开访问；支持关键词与分类过滤。"""
    q = (
        db.query(LawyerProfile)
        .join(User, User.id == LawyerProfile.user_id)
        .filter(User.role == "lawyer")
    )
    if keyword:
        like = f"%{keyword}%"
        q = q.filter(
            LawyerProfile.name.like(like)
            | (LawyerProfile.introduction.like(like) if LawyerProfile.introduction else False)
            | (LawyerProfile.expertise.like(like) if LawyerProfile.expertise else False)
        )
    profiles = q.all()
    if category:
        profiles = [
            p
            for p in profiles
            if p.categories and category in p.categories
        ]
    out = []
    for p in profiles:
        out.append(
            LawyerListItem(
                id=p.user_id,
                name=p.name,
                title=p.title,
                avatarEmoji=p.avatar_emoji,
                introduction=p.introduction,
                tags=p.tags or [],
                categories=p.categories or [],
            )
        )
    return out


@router.get("/{lawyer_id}", response_model=LawyerDetailOut)
def get_lawyer(
    lawyer_id: int,
    db: Session = Depends(get_db),
):
    """律师详情：可公开访问；lawyer_id 为 user_id。"""
    profile = (
        db.query(LawyerProfile)
        .filter(LawyerProfile.user_id == lawyer_id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="律师不存在")
    edu = profile.education
    if isinstance(edu, dict):
        edu_out = LawyerEducation(
            degree=edu.get("degree"),
            school=edu.get("school"),
            major=edu.get("major"),
        )
    else:
        edu_out = None
    return LawyerDetailOut(
        name=profile.name,
        title=profile.title,
        avatarEmoji=profile.avatar_emoji,
        organization=profile.organization,
        licenseNumber=profile.license_number,
        practiceYears=profile.practice_years,
        practiceArea=profile.practice_area,
        expertise=profile.expertise,
        stats=LawyerStats(
            years=profile.practice_years,
            caseCount=None,
            winRate=None,
            clientSatisfaction=None,
        ),
        education=edu_out,
        languageSkills=profile.language_skills,
        introduction=profile.introduction,
        expertiseAreas=profile.expertise_areas,
        workExperience=profile.work_experience,
        caseExperience=profile.case_experience,
    )
