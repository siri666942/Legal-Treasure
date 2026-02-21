"""
=============================================================================
文件: app/schemas/case.py
模块: 案件数据模式
描述: 案件列表、详情、创建请求的请求/响应结构，与前端 caseList/caseInfo 对齐
=============================================================================
"""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class CaseCreateIn(BaseModel):
    """创建案件请求体，与前端 create-case 表单一致。"""
    caseNo: str = Field(..., max_length=64, description="案号")
    caseTitle: str = Field(..., max_length=255, description="案件标题")
    caseType: str | None = Field(default=None, max_length=64)
    court: str | None = Field(default=None, max_length=255)
    judge: str | None = Field(default=None, max_length=64)
    filingDate: str | None = Field(default=None, description="立案时间，如 2024-01-15 或 2024年1月15日")
    amount: str | None = Field(default=None, max_length=64)
    applicableLaw: str | None = None
    client_id: int | None = Field(default=None, alias="clientId", description="客户用户ID，可选")


class CaseListItem(BaseModel):
    """案件列表项，与前端 caseList 项一致（camelCase 输出）。"""
    model_config = ConfigDict(populate_by_name=True)

    id: int
    caseNo: str
    title: str
    status: str
    statusType: str
    date: str
    progress: int
    type: str | None = None
    lawyer: str | None = None
    client: str | None = None


class CaseDetailOut(BaseModel):
    """案件详情，与前端 caseInfo + 可选 timeline/documents 对齐。"""
    model_config = ConfigDict(populate_by_name=True)

    id: int
    caseNo: str
    caseTitle: str
    caseType: str | None = None
    court: str | None = None
    judge: str | None = None
    filingDate: str | None = None
    amount: str | None = None
    applicableLaw: str | None = None
    client: str | None = None
    lawyer: str | None = None
    status: str
    statusType: str
    progress: int
    created_at: datetime | None = None
    timeline: list[dict] | None = None
    documents: list[dict] | None = None
    parties: list[dict] | None = None


class CaseOut(BaseModel):
    """创建案件成功返回的简要信息。"""
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    caseNo: str
    title: str
    status: str
    statusType: str = "pending"
    progress: int = 0
    caseType: str | None = None
    filingDate: str | None = None
    created_at: datetime | None = None
