"""
=============================================================================
文件: app/db/__init__.py
模块: 数据库包
描述: 包含数据库连接、会话管理和基础模型定义
      类似于 Java 中的数据访问层（DAO/Repository 层）
=============================================================================

【子模块说明】
- base.py: SQLAlchemy 声明式基类，所有模型都继承自它
- session.py: 数据库引擎和会话管理

【技术栈】
- SQLAlchemy 2.0: Python 最流行的 ORM 框架
- 声明式映射: 使用 Python 类定义数据库表结构

【与 Java 的对比】
- SQLAlchemy 类似于 Java 的 Hibernate/JPA
- Base 类类似于 JPA 的 @Entity 注解
- Session 类似于 JPA 的 EntityManager
"""
