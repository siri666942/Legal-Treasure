"""
=============================================================================
文件: app/services/security.py
模块: 安全服务
描述: 提供密码加密和 JWT Token 相关的安全功能
      是整个认证系统的核心安全组件
=============================================================================

【功能列表】
- hash_password: 对明文密码进行 bcrypt 加密
- verify_password: 验证密码是否正确
- create_access_token: 生成 JWT 访问令牌

【安全说明】
1. 密码使用 bcrypt 算法加密，bcrypt 会自动加盐，防止彩虹表攻击
2. JWT Token 使用 HS256 算法签名，需要保护好 SECRET_KEY
3. Token 有过期时间，过期后需要重新登录

【依赖库】
- bcrypt: 密码哈希库
- python-jose: JWT 处理库
"""

from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt

from app.core.config import settings


def hash_password(password: str) -> str:
    """
    对密码进行 bcrypt 加密
    
    【功能说明】
    使用 bcrypt 算法对明文密码进行哈希处理。
    bcrypt 会自动生成随机盐值，确保相同密码每次加密结果不同。
    
    【参数说明】
    - password: str - 用户输入的明文密码
    
    【返回值】
    str: bcrypt 加密后的密码哈希字符串
    
    【安全特性】
    1. 自动加盐：每次加密都会生成随机盐值
    2. 慢哈希：bcrypt 故意设计得较慢，增加暴力破解难度
    3. 不可逆：无法从哈希值反推出原密码
    
    【使用示例】
    hashed = hash_password("my_secure_password")
    # 返回类似: "$2b$12$KIX..."
    
    【注意事项】（与Java的区别）
    Python 的 bcrypt 库需要将字符串编码为 bytes，
    因为 bcrypt 在底层操作的是字节数据。
    encode("utf-8") 将字符串转为 UTF-8 编码的字节串。
    """
    # gensalt() 生成随机盐值，默认 rounds=12
    # hashpw() 对密码进行加盐哈希
    # 需要将字符串编码为 bytes，处理后再解码为字符串存储
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")  # 将 bytes 转回字符串，方便存储到数据库


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    验证密码是否正确
    
    【功能说明】
    将用户输入的明文密码与数据库中存储的哈希值进行比对。
    bcrypt.checkpw() 会从哈希值中提取盐值，然后用相同的方式加密明文密码进行比对。
    
    【参数说明】
    - plain_password: str - 用户输入的明文密码
    - hashed_password: str - 数据库中存储的密码哈希值
    
    【返回值】
    bool: True 表示密码正确，False 表示密码错误
    
    【使用示例】
    is_valid = verify_password("user_input", stored_hash)
    if is_valid:
        print("密码正确")
    
    【安全说明】
    checkpw 使用恒定时间比较，防止时序攻击。
    不要自己实现密码比对逻辑！
    """
    # checkpw 安全地比较密码
    # 两个参数都需要是 bytes 类型
    return bcrypt.checkpw(
        plain_password.encode("utf-8"), hashed_password.encode("utf-8")
    )


def create_access_token(subject: str, expires_minutes: int | None = None) -> str:
    """
    创建 JWT 访问令牌
    
    【功能说明】
    生成一个 JWT（JSON Web Token）访问令牌。
    Token 中包含用户标识和过期时间，使用 SECRET_KEY 签名。
    
    【参数说明】
    - subject: str - Token 的主体，通常是用户名或用户ID
    - expires_minutes: int | None - Token 有效期（分钟），默认使用配置值
    
    【返回值】
    str: 编码后的 JWT Token 字符串
    
    【JWT 结构说明】
    JWT 由三部分组成，用点号分隔：Header.Payload.Signature
    
    Payload 内容：
    - sub (subject): 用户标识（用户名）
    - exp (expiration): 过期时间戳
    
    【使用示例】
    # 使用默认过期时间
    token = create_access_token(subject="john_doe")
    
    # 自定义过期时间（30分钟）
    token = create_access_token(subject="john_doe", expires_minutes=30)
    
    【注意事项】（与Java的区别）
    Python 的 datetime 操作与 Java 不同：
    - Python: datetime.now(timezone.utc) + timedelta(minutes=60)
    - Java: LocalDateTime.now().plusMinutes(60)
    
    timedelta 是 Python 中表示时间差的类，类似于 Java 的 Duration。
    """
    # 计算过期时间
    # 如果未指定过期时间，使用配置文件中的默认值
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    # 构建 Token 的 payload（负载）
    # sub: subject，JWT 标准声明，存放用户标识
    # exp: expiration，JWT 标准声明，存放过期时间
    to_encode = {"sub": subject, "exp": expire}
    
    # 使用 HS256 算法和 SECRET_KEY 对 payload 进行签名
    # 返回编码后的 JWT 字符串
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
