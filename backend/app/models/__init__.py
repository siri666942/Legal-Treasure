"""
=============================================================================
文件: app/models/__init__.py
模块: 数据模型包
描述: 导出所有数据库模型类
      集中管理模型的导出，方便其他模块统一导入
=============================================================================

【子模块说明】
- user.py: 用户模型 - 存储用户账户信息
- uploaded_file.py: 上传文件模型 - 存储文件元数据
- contract.py: 合同模型 - 存储合同信息
- law_article.py: 法条模型 - 存储法律条文
- model_call_log.py: 模型调用日志 - 记录AI模型调用情况

【导入方式】
推荐从此包统一导入：
from app.models import User, Contract, LawArticle

而不是从各子模块单独导入：
from app.models.user import User  # 不推荐

【设计说明】
__all__ 列表定义了使用 from app.models import * 时会导出的名称。
这是 Python 模块的最佳实践，用于控制公开 API。
"""

from app.models.contract import Contract
from app.models.law_article import LawArticle
from app.models.model_call_log import ModelCallLog
from app.models.uploaded_file import UploadedFile
from app.models.user import User

# __all__ 定义了 "from app.models import *" 时导出的名称列表
# 这类似于 Java 中 public 和 package-private 的访问控制概念
__all__ = ["User", "UploadedFile", "Contract", "LawArticle", "ModelCallLog"]
