"""
=============================================================================
文件: app/db/base.py
模块: 数据库基类
描述: 定义 SQLAlchemy 的声明式基类
      所有数据库模型都需要继承此基类
=============================================================================

【什么是声明式基类】
SQLAlchemy 的声明式映射允许我们用 Python 类来定义数据库表结构。
所有模型类都需要继承同一个基类，这个基类负责：
1. 收集所有模型的元数据（表结构信息）
2. 提供创建表的功能

【与 Java 的对比】
类似于 JPA 中所有实体类都需要标注 @Entity 注解，
在 SQLAlchemy 中，所有模型类都需要继承 Base 类。
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    SQLAlchemy 声明式基类
    
    【类说明】
    所有数据库模型（ORM 映射类）都必须继承此类。
    继承 DeclarativeBase 后，模型类会自动：
    1. 被 SQLAlchemy 注册为映射类
    2. 关联到 metadata 对象（用于创建/删除表）
    
    【使用示例】
    class User(Base):
        __tablename__ = "users"
        id = mapped_column(Integer, primary_key=True)
        name = mapped_column(String(50))
    
    【注意事项】（与Java的区别）
    Python 中的 pass 语句表示"什么都不做"，用于占位。
    在 Java 中，空的类体用 {} 表示，而 Python 中必须有语句，
    所以用 pass 来表示空的类体。
    """
    pass
