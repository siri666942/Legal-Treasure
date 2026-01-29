"""
=============================================================================
文件: app/api/endpoints/files.py
模块: 文件管理端点
描述: 提供文件上传和文件列表查询功能
      用于管理用户上传的合同文件等文档
=============================================================================

【接口列表】
POST /api/v1/files/upload  - 上传文件（需要认证）
GET  /api/v1/files         - 获取当前用户的文件列表（需要认证）

【文件存储策略】
1. 文件保存在服务器的 uploads/ 目录下
2. 文件名格式: {UUID}_{原始文件名}，避免文件名冲突
3. 文件元数据（大小、类型等）存储在数据库中

【安全机制】
所有接口都需要 JWT Token 认证，用户只能访问自己上传的文件。
"""

from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.db.session import get_db
from app.models.uploaded_file import UploadedFile as UploadedFileModel
from app.models.user import User
from app.schemas.files import UploadedFileOut

# 创建文件模块的路由器
router = APIRouter()


@router.post("/upload", response_model=UploadedFileOut)
def upload_file(
    file: UploadFile = File(...),  # File(...) 表示必填参数，"..." 是 FastAPI 的占位符
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UploadedFileModel:
    """
    文件上传接口
    
    【功能说明】
    接收用户上传的文件，保存到服务器并记录文件元数据到数据库。
    文件以流的方式读取，支持大文件上传。
    
    【请求参数】
    - file: UploadFile - 上传的文件（multipart/form-data 格式）
    - db: Session - 数据库会话（依赖注入）
    - current_user: User - 当前登录用户（依赖注入，需要 Token）
    
    【返回值】
    UploadedFileOut: 上传文件的信息
        - id: int - 文件记录ID
        - original_filename: str - 原始文件名
        - stored_filename: str - 存储文件名（带UUID前缀）
        - content_type: str - 文件MIME类型
        - size: int - 文件大小（字节）
        - path: str - 服务器存储路径
        - created_at: datetime - 创建时间
    
    【使用示例】
    POST /api/v1/files/upload
    Content-Type: multipart/form-data
    Authorization: Bearer <token>
    
    表单字段: file = <文件内容>
    
    【注意事项】（与Java的区别）
    Python 中使用 := 海象运算符进行赋值的同时判断，这在 Java 中没有对应语法。
    例如: while chunk := file.file.read(1024) 等同于先 chunk=read()，再判断 chunk 是否为真
    """
    # 确保上传目录存在
    # Path 是 Python 标准库 pathlib 提供的路径操作类，比字符串拼接更安全
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)  # 递归创建目录，已存在则忽略

    # 生成唯一的存储文件名，格式: UUID_原始文件名
    # uuid4() 生成随机 UUID，hex 属性返回无连字符的十六进制字符串
    stored_name = f"{uuid4().hex}_{file.filename}"
    stored_path = upload_dir / stored_name  # Path 支持 / 运算符拼接路径

    # 以二进制写模式打开文件，分块读取上传内容
    size = 0
    with stored_path.open("wb") as f:
        # := 是 Python 3.8+ 的海象运算符（Walrus Operator）
        # 它在赋值的同时返回赋的值，用于循环条件判断
        # Java 中没有这个语法，需要分两步: chunk = read(); while(chunk != null)
        while chunk := file.file.read(1024 * 1024):  # 每次读取 1MB
            f.write(chunk)
            size += len(chunk)

    # 创建数据库记录
    record = UploadedFileModel(
        user_id=current_user.id,
        original_filename=file.filename or "unknown",  # or 运算符用于默认值，类似 Java 的三元运算符
        stored_filename=stored_name,
        content_type=file.content_type,
        size=size,
        path=str(stored_path),  # 将 Path 对象转为字符串
    )
    
    # 保存到数据库
    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@router.get("", response_model=list[UploadedFileOut])
def list_my_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[UploadedFileModel]:
    """
    获取当前用户的文件列表
    
    【功能说明】
    查询并返回当前登录用户上传的所有文件，按上传时间倒序排列（最新的在前）。
    用户只能看到自己上传的文件，无法访问其他用户的文件。
    
    【请求参数】
    - db: Session - 数据库会话（依赖注入）
    - current_user: User - 当前登录用户（依赖注入，需要 Token）
    
    【返回值】
    list[UploadedFileOut]: 文件信息列表
    
    【使用示例】
    GET /api/v1/files
    Authorization: Bearer <token>
    
    【注意事项】（与Java的区别）
    list[UploadedFileOut] 是 Python 3.9+ 的泛型语法
    在 Java 中对应 List<UploadedFileOut>
    """
    # 使用 SQLAlchemy 的链式查询
    # filter() 相当于 SQL 的 WHERE 子句
    # order_by() 相当于 SQL 的 ORDER BY 子句，desc() 表示降序
    # all() 执行查询并返回所有结果
    return (
        db.query(UploadedFileModel)
        .filter(UploadedFileModel.user_id == current_user.id)  # 只查询当前用户的文件
        .order_by(UploadedFileModel.id.desc())  # 按 ID 降序（最新的在前）
        .all()
    )
