"""
=============================================================================
文件: app/models/uploaded_file.py
模块: 上传文件模型
描述: 定义上传文件元数据表结构（uploaded_files 表）
      存储用户上传文件的相关信息，实际文件存储在文件系统中
=============================================================================

【表结构】
uploaded_files 表
├── id              - 主键，自增整数
├── user_id         - 外键，关联 users 表
├── original_filename - 原始文件名
├── stored_filename - 存储文件名（带UUID前缀）
├── content_type    - MIME 类型
├── size            - 文件大小（字节）
├── path            - 服务器存储路径
└── created_at      - 上传时间

【关联关系】
- UploadedFile N:1 User (多个文件属于一个用户)
- UploadedFile 1:1 Contract (一个文件可以关联一个合同)
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UploadedFile(Base):
    """
    上传文件模型类
    
    【类说明】
    ORM 映射类，对应数据库中的 uploaded_files 表。
    存储上传文件的元数据，实际文件内容保存在服务器文件系统中。
    
    【设计说明】
    - 文件内容不存入数据库，避免数据库膨胀
    - stored_filename 使用 UUID 前缀，避免文件名冲突
    - path 记录文件的绝对路径，方便后续读取
    
    【字段说明】
    - id: 主键
    - user_id: 上传者的用户ID，外键关联 users 表
    - original_filename: 用户上传时的原始文件名
    - stored_filename: 服务器上的存储文件名
    - content_type: 文件的 MIME 类型（如 application/pdf）
    - size: 文件大小，单位：字节
    - path: 文件在服务器上的完整路径
    - created_at: 上传时间
    """
    
    __tablename__ = "uploaded_files"

    # ======================== 主键 ========================
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # ======================== 外键关联 ========================
    # ForeignKey 定义外键约束，关联到 users 表的 id 字段
    # 类似于 Java JPA 的 @ManyToOne + @JoinColumn
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)

    # ======================== 文件信息字段 ========================
    # 用户上传时的原始文件名
    original_filename: Mapped[str] = mapped_column(String(255))
    
    # 服务器上的存储文件名，格式：{UUID}_{原始文件名}
    # unique=True: 确保存储文件名唯一，避免覆盖
    stored_filename: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    
    # 文件的 MIME 类型，如 "application/pdf", "image/png" 等
    # 可空，因为有些上传可能无法识别类型
    content_type: Mapped[str | None] = mapped_column(String(100))
    
    # 文件大小，单位：字节
    size: Mapped[int] = mapped_column(Integer, default=0)
    
    # 文件在服务器上的完整存储路径
    path: Mapped[str] = mapped_column(String(500))

    # ======================== 时间戳字段 ========================
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # ======================== 关系映射 ========================
    # relationship 定义 ORM 关系，可以通过 file.user 访问关联的用户对象
    # 类似于 Java JPA 的 @ManyToOne
    # 注意：参数是字符串 "User" 而非类，这是为了避免循环导入
    user = relationship("User")
