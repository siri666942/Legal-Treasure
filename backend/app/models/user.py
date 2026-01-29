"""
=============================================================================
文件: app/models/user.py
模块: 用户模型
描述: 定义用户数据表结构（users 表）
      存储用户的账户信息，包括用户名、密码、邮箱等
=============================================================================

【表结构】
users 表
├── id          - 主键，自增整数
├── username    - 用户名，唯一索引
├── email       - 邮箱，可空，有索引
├── hashed_password - 加密后的密码
├── is_active   - 是否激活，布尔值
└── created_at  - 创建时间

【关联关系】
- User 1:N UploadedFile (一个用户可以上传多个文件)
- User 1:N Contract (一个用户可以有多个合同)
"""

from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class User(Base):
    """
    用户模型类
    
    【类说明】
    ORM 映射类，对应数据库中的 users 表。
    存储用户的基本账户信息和认证信息。
    
    【与 Java 的对比】
    类似于 JPA 的 @Entity 类：
    - __tablename__ 对应 @Table(name="users")
    - mapped_column 对应 @Column 注解
    - Mapped[int] 是 SQLAlchemy 2.0 的类型注解语法
    
    【字段说明】
    - id: 主键，自增
    - username: 用户名，唯一，用于登录
    - email: 邮箱，可选
    - hashed_password: bcrypt 加密后的密码
    - is_active: 账户是否激活，用于禁用账户
    - created_at: 账户创建时间
    
    【安全说明】
    密码不以明文存储，而是存储 bcrypt 哈希值。
    验证密码时，使用 bcrypt.checkpw() 比对。
    """
    
    # 指定对应的数据库表名
    __tablename__ = "users"

    # ======================== 主键 ========================
    # primary_key=True: 主键
    # index=True: 创建索引，加速查询
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # ======================== 用户标识字段 ========================
    # unique=True: 唯一约束，不允许重复用户名
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    
    # Mapped[str | None] 表示可空字段
    # Python 3.10+ 使用 | 表示类型联合，相当于 Java 的 @Nullable
    # 早期版本使用 Optional[str] 或 Union[str, None]
    email: Mapped[str | None] = mapped_column(String(255), index=True)
    
    # ======================== 认证字段 ========================
    # 存储 bcrypt 加密后的密码哈希值
    hashed_password: Mapped[str] = mapped_column(String(255))
    
    # 账户激活状态，默认为 True（激活）
    # default=True: 插入新记录时的默认值
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # ======================== 时间戳字段 ========================
    # 账户创建时间
    # default 使用 lambda 函数获取当前 UTC 时间
    # 注意：lambda 是 Python 的匿名函数，Java 中用 Lambda 表达式 () -> ...
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
