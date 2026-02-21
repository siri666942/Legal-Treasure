"""
=============================================================================
文件: app/schemas/lawyer.py
模块: 律师数据模式
描述: 律师列表项、详情响应，与前端 allLawyers / lawyerInfo 对齐
=============================================================================
"""

from pydantic import BaseModel, ConfigDict


class LawyerListItem(BaseModel):
    """律师列表项，与前端 allLawyers 项一致。"""
    model_config = ConfigDict(populate_by_name=True)

    id: int
    name: str
    title: str | None = None
    avatarEmoji: str | None = None
    introduction: str | None = None
    tags: list[str] | None = None
    categories: list[str] | None = None


class LawyerStats(BaseModel):
    """律师统计数据（前端 stats）。"""
    caseCount: str | None = None
    winRate: str | None = None
    clientSatisfaction: str | None = None
    years: str | None = None


class LawyerEducation(BaseModel):
    """教育背景。"""
    degree: str | None = None
    school: str | None = None
    major: str | None = None


class LawyerDetailOut(BaseModel):
    """律师详情，与前端 lawyerInfo 对齐。"""
    model_config = ConfigDict(populate_by_name=True)

    name: str
    title: str | None = None
    avatarEmoji: str | None = None
    organization: str | None = None
    licenseNumber: str | None = None
    practiceYears: str | None = None
    practiceArea: str | None = None
    expertise: str | None = None
    stats: LawyerStats | None = None
    education: LawyerEducation | dict | None = None
    languageSkills: str | None = None
    introduction: str | None = None
    expertiseAreas: list[str] | None = None
    workExperience: list[dict] | None = None
    caseExperience: list[dict] | None = None
