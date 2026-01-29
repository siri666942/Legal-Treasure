"""
=============================================================================
文件: app/schemas/files.py
模块: 文件数据模式
描述: 定义文件上传相关的响应数据结构
      用于序列化上传文件的元数据信息
=============================================================================

【数据模式列表】
- UploadedFileOut: 上传文件信息响应体

【设计说明】
文件上传使用 multipart/form-data 格式，不需要定义请求体 Schema。
这里只定义响应 Schema，用于返回文件元数据。
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UploadedFileOut(BaseModel):
    """
    上传文件信息响应模式
    
    【类说明】
    定义上传文件信息的响应数据结构。
    用于文件上传成功后返回文件信息，或获取文件列表。
    
    【字段说明】
    - id: 文件记录 ID
    - original_filename: 原始文件名（用户上传时的文件名）
    - stored_filename: 存储文件名（带 UUID 前缀，服务器上的实际文件名）
    - content_type: MIME 类型（如 "application/pdf"）
    - size: 文件大小（字节）
    - path: 服务器存储路径
    - created_at: 上传时间
    
    【使用场景】
    1. 文件上传成功后的响应
    2. 获取用户文件列表
    3. 获取单个文件详情
    """
    
    # 允许从 ORM 对象创建
    # 这样可以直接将 UploadedFile 模型对象转换为此 Schema
    model_config = ConfigDict(from_attributes=True)

    # 文件记录的唯一标识
    id: int
    
    # 用户上传时的原始文件名
    # 用于显示给用户，让用户知道这是什么文件
    original_filename: str
    
    # 服务器上的存储文件名
    # 格式：{UUID}_{原始文件名}，用于避免文件名冲突
    stored_filename: str
    
    # 文件的 MIME 类型
    # 例如："application/pdf", "image/png", "text/plain"
    # 可能为 None，如果无法识别文件类型
    content_type: str | None
    
    # 文件大小，单位：字节
    # 可用于显示文件大小或限制下载
    size: int
    
    # 文件在服务器上的存储路径
    # 内部使用，可用于后续的文件读取操作
    path: str
    
    # 文件上传时间
    # datetime 类型会自动序列化为 ISO 8601 格式的字符串
    created_at: datetime
