"""
=============================================================================
文件: app/schemas/__init__.py
模块: 数据模式包
描述: 包含 Pydantic 数据验证模型（DTO/Schema）
      定义 API 请求和响应的数据结构
=============================================================================

【子模块说明】
- auth.py: 认证相关的数据模式（注册、登录、Token）
- files.py: 文件相关的数据模式（文件信息）
- query.py: 查询相关的数据模式（合同、法条）

【Schema vs Model 的区别】
- Model (models/): ORM 模型，映射到数据库表，负责持久化
- Schema (schemas/): Pydantic 模型，负责数据验证和序列化

【与 Java 的对比】
Schema 类似于 Java 中的 DTO（Data Transfer Object）或 VO（Value Object）
在 Spring 中，通常用 @RequestBody 和 @ResponseBody 配合 DTO 类使用

【命名约定】
- XxxIn: 输入模式，用于请求体验证
- XxxOut: 输出模式，用于响应体序列化
- XxxCreate/XxxUpdate: 创建/更新操作的输入模式
"""
