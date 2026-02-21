"""
=============================================================================
文件: app/schemas/feedback.py
模块: 反馈数据模式
描述: 提交反馈请求体与响应，与前端 feedback 表单对齐
=============================================================================
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class FeedbackCreateIn(BaseModel):
    """提交反馈请求体：type 1-5，content 必填，contact、images 可选。"""
    type: int = Field(..., ge=1, le=5, description="1:功能建议 2:使用问题 3:投诉举报 4:合作咨询 5:认证问题")
    content: str = Field(..., min_length=10, max_length=500)
    contact: str | None = Field(default=None, max_length=128)
    images: list[str] | None = Field(default=None, max_length=3, description="最多3张图片 URL")


class FeedbackOut(BaseModel):
    """反馈提交成功响应。"""
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: int
    content: str
    contact: str | None
    created_at: datetime | None = None
