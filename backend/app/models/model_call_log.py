"""
=============================================================================
文件: app/models/model_call_log.py
模块: 模型调用日志
描述: 定义 AI 模型调用日志表结构（model_call_logs 表）
      用于追踪和审计大语言模型 API 的调用情况
=============================================================================

【表结构】
model_call_logs 表
├── id              - 主键，自增整数
├── user_id         - 用户ID（可空，匿名调用时为空）
├── endpoint        - 调用的接口/模块标识
├── model_name      - 使用的模型名称
├── prompt_hash     - 输入内容的哈希值（用于去重统计）
├── input_tokens    - 输入 Token 数
├── output_tokens   - 输出 Token 数
├── status          - 调用状态（ok/error）
├── error_message   - 错误信息
├── duration_ms     - 调用耗时（毫秒）
└── created_at      - 调用时间

【使用场景】
1. 成本统计：根据 Token 数计算 API 调用费用
2. 性能监控：分析响应时间，发现性能瓶颈
3. 错误排查：记录错误信息，方便问题定位
4. 使用审计：追踪每个用户的模型使用情况
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ModelCallLog(Base):
    """
    模型调用日志模型类
    
    【类说明】
    ORM 映射类，对应数据库中的 model_call_logs 表。
    记录每次 AI 模型 API 调用的详细信息，用于监控和审计。
    
    【设计目的】
    1. 成本控制：记录 Token 消耗，计算 API 费用
    2. 性能优化：分析耗时分布，优化调用策略
    3. 故障排查：保存错误信息，支持问题追溯
    4. 合规审计：记录谁在什么时候调用了什么模型
    
    【字段说明】
    - id: 主键
    - user_id: 调用者的用户ID，匿名调用时为 NULL
    - endpoint: 触发调用的接口标识，如 "contract_review"
    - model_name: 使用的模型，如 "gpt-4", "claude-3"
    - prompt_hash: 输入 prompt 的 SHA256 哈希，用于去重分析
    - input_tokens: 输入消耗的 Token 数
    - output_tokens: 输出生成的 Token 数
    - status: 调用结果状态，"ok" 或 "error"
    - error_message: 失败时的错误信息
    - duration_ms: 调用耗时（毫秒）
    - created_at: 调用发生时间
    """
    
    __tablename__ = "model_call_logs"

    # ======================== 主键 ========================
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # ======================== 调用者信息 ========================
    # 用户ID，可空（匿名调用或系统内部调用时为空）
    # nullable=True 显式声明允许 NULL 值
    user_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    
    # ======================== 调用标识 ========================
    # 调用的接口/模块标识，用于区分不同的调用场景
    # 例如："contract_review"（合同审查）、"law_query"（法律咨询）
    endpoint: Mapped[str] = mapped_column(String(255))
    
    # 使用的模型名称
    # 例如："gpt-4", "gpt-3.5-turbo", "claude-3-opus"
    model_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    # ======================== 输入输出统计 ========================
    # 输入内容的哈希值，用于识别重复请求
    # 使用 SHA256 哈希，64 字符
    prompt_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    
    # 输入 Token 数量
    # 大语言模型按 Token 计费，Token 大约是 0.75 个单词
    input_tokens: Mapped[int] = mapped_column(Integer, default=0)
    
    # 输出 Token 数量
    output_tokens: Mapped[int] = mapped_column(Integer, default=0)
    
    # ======================== 调用状态 ========================
    # 调用状态：ok（成功）或 error（失败）
    status: Mapped[str] = mapped_column(String(50), default="ok")
    
    # 错误信息，仅在 status="error" 时有值
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # ======================== 性能指标 ========================
    # 调用耗时，单位：毫秒
    # 用于监控 API 响应性能
    duration_ms: Mapped[int] = mapped_column(Integer, default=0)
    
    # ======================== 时间戳字段 ========================
    # 调用发生时间
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
