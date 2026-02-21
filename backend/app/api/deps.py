"""
=============================================================================
文件: app/api/deps.py
模块: API 依赖注入
描述: 定义 FastAPI 的依赖注入函数
      这些函数可在路由处理函数中通过 Depends() 注入使用
=============================================================================

【什么是依赖注入】
依赖注入（Dependency Injection）是一种设计模式，允许我们将通用的逻辑
（如获取数据库连接、验证用户身份）抽取为可复用的函数。
在 FastAPI 中，使用 Depends() 装饰器来实现依赖注入。

【主要依赖函数】
- get_current_user: 从 JWT Token 中解析并返回当前登录用户
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

# OAuth2 密码模式的 Bearer Token 认证方案
# tokenUrl 指定获取 Token 的接口地址，用于 Swagger UI 的认证功能
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token")
# 可选认证：未携带 Token 时不报错，用于反馈等接口
oauth2_scheme_optional = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/token", auto_error=False
)


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    """
    获取当前登录用户
    
    【功能说明】
    从请求头中的 Authorization: Bearer <token> 提取 JWT Token，
    解析 Token 获取用户名，然后从数据库查询对应的用户对象。
    
    【参数说明】
    - db: Session
        数据库会话，通过 get_db 依赖注入获取
    - token: str
        JWT Token，通过 oauth2_scheme 从请求头自动提取
    
    【返回值】
    User: 当前登录的用户对象
    
    【异常情况】
    - HTTP 401 Unauthorized: Token 无效、过期或用户不存在
    - HTTP 400 Bad Request: 用户已被停用
    
    【使用示例】（在Java中类似于@Autowired注入的方式）
    @router.get("/me")
    def get_me(current_user: User = Depends(get_current_user)):
        return current_user
    """
    # 定义认证失败时的异常
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无效的认证信息",
        headers={"WWW-Authenticate": "Bearer"},  # 告知客户端使用 Bearer Token 认证
    )
    
    try:
        # 解码 JWT Token，验证签名和有效期
        # 注意：Python 使用 jwt.decode()，与 Java 的 JWT 库用法不同
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        # 从 Token 的 payload 中获取 subject（用户名）
        # payload.get() 方法返回 None 如果 key 不存在（Java 中需要判空）
        username: str | None = payload.get("sub")  # Python 3.10+ 的类型联合语法，Java 没有
        if not username:
            raise credentials_exception
    except JWTError:
        # JWT 解码失败（签名无效、Token 过期等）
        raise credentials_exception

    # 从数据库查询用户
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise credentials_exception
    
    # 检查用户是否被停用
    if not user.is_active:
        raise HTTPException(status_code=400, detail="用户已停用")
    
    return user


def get_current_user_optional(
    db: Session = Depends(get_db),
    token: str | None = Depends(oauth2_scheme_optional),
) -> User | None:
    """可选当前用户：有有效 Token 则返回 User，否则返回 None。"""
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username = payload.get("sub")
        if not username:
            return None
        user = db.query(User).filter(User.username == username).first()
        return user if user and user.is_active else None
    except JWTError:
        return None
