"""
=============================================================================
文件: app/schemas/query.py
模块: 查询数据模式
描述: 定义数据查询相关的响应数据结构
      包括合同和法条的查询结果格式
=============================================================================

【数据模式列表】
- ContractOut: 合同信息响应体
- LawArticleOut: 法条信息响应体

【设计说明】
查询接口使用 GET 方法，查询参数通过 URL Query String 传递，
不需要定义请求体 Schema。这里只定义响应 Schema。
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ContractOut(BaseModel):
    """
    合同信息响应模式
    
    【类说明】
    定义合同查询结果的数据结构。
    用于合同列表查询和单个合同详情的响应。
    
    【字段说明】
    - id: 合同记录 ID
    - title: 合同标题
    - description: 合同描述（可能为空）
    - status: 合同状态
    - file_id: 关联的文件 ID（可能为空）
    - created_at: 创建时间
    
    【状态值说明】
    status 的可能值：
    - "draft": 草稿
    - "active": 生效中
    - "expired": 已过期
    - "terminated": 已终止
    """
    
    # 允许从 ORM 对象创建
    model_config = ConfigDict(from_attributes=True)

    # 合同的唯一标识
    id: int
    
    # 合同标题
    # 通常是合同的简短名称，如 "房屋租赁合同"
    title: str
    
    # 合同描述
    # 可能包含合同的详细说明、备注等
    # 可选字段，某些合同可能没有描述
    description: str | None
    
    # 合同状态
    # 用于跟踪合同的生命周期
    status: str
    
    # 关联的文件 ID
    # 如果合同有上传的文件（如 PDF 扫描件），这里记录文件 ID
    # 可选字段，不是所有合同都有关联文件
    file_id: int | None
    
    # 合同创建时间
    created_at: datetime


class LawArticleOut(BaseModel):
    """
    法条信息响应模式
    
    【类说明】
    定义法条查询结果的数据结构。
    用于法条搜索和法条详情的响应。
    
    【字段说明】
    - id: 法条记录 ID
    - law_name: 法律名称
    - article_no: 条款编号（可能为空）
    - content: 条款内容
    - created_at: 记录创建时间
    
    【使用场景】
    1. 法条关键词搜索结果
    2. 按法律名称浏览法条
    3. AI 合同审查时引用的法律依据
    """
    
    # 允许从 ORM 对象创建
    model_config = ConfigDict(from_attributes=True)

    # 法条记录的唯一标识
    id: int
    
    # 法律名称
    # 例如："中华人民共和国民法典"、"中华人民共和国刑法"
    law_name: str
    
    # 条款编号
    # 例如："第一条"、"第五百零一条"
    # 可选字段，某些法规可能没有明确的条款编号
    article_no: str | None
    
    # 条款的完整内容
    # 包含法条的正文文本
    content: str
    
    # 记录创建时间
    # 表示这条法条数据何时被导入系统
    created_at: datetime
