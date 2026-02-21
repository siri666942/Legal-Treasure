"""
=============================================================================
文件: app/api/endpoints/auth.py
模块: 用户认证端点
描述: 提供用户注册、登录和 Token 获取功能
      实现了基于 JWT 的无状态认证机制
=============================================================================

【接口列表】
POST /api/v1/auth/register  - 用户注册
POST /api/v1/auth/login     - 用户登录（JSON 格式）
POST /api/v1/auth/token     - 获取 Token（OAuth2 表单格式，用于 Swagger UI）

【认证流程】
1. 用户注册：提交用户名、密码、邮箱 -> 密码加密存储 -> 返回用户信息
2. 用户登录：提交用户名、密码 -> 验证密码 -> 生成 JWT Token -> 返回 Token
3. 访问受保护接口：携带 Token -> 验证 Token -> 获取当前用户 -> 处理请求
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginIn, LoginOut, RegisterIn, TokenOut, UserOut
from app.services.security import create_access_token, hash_password, verify_password

# 创建认证模块的路由器
router = APIRouter()


@router.post("/register", response_model=UserOut)
def register(payload: RegisterIn, db: Session = Depends(get_db)) -> User:
    """
    用户注册接口
    
    【功能说明】
    创建新用户账户，对密码进行加密后存储到数据库。
    注册前会检查用户名和邮箱是否已被使用。
    
    【请求参数】
    - payload: RegisterIn (请求体)
        - username: str - 用户名（3-50字符）
        - password: str - 密码（6-128字符）
        - email: str | None - 邮箱（可选）
    - db: Session - 数据库会话（依赖注入）
    
    【返回值】
    UserOut: 注册成功的用户信息（不包含密码）
        - id: int - 用户ID
        - username: str - 用户名
        - email: str | None - 邮箱
    
    【异常情况】
    - HTTP 400: 用户名或邮箱已存在
    
    【使用示例】
    POST /api/v1/auth/register
    {
        "username": "testuser",
        "password": "123456",
        "email": "test@example.com"
    }
    """
    # 检查用户名是否已存在
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="用户名或邮箱已存在")
    
    # 检查邮箱是否已存在（如果提供了邮箱）
    if payload.email:
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="用户名或邮箱已存在")

    # 创建用户对象，密码经过 bcrypt 加密；可选角色 lawyer/client
    user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=hash_password(payload.password),  # 密码加密存储
        role=payload.role if payload.role in ("lawyer", "client") else None,
    )
    
    # 保存到数据库
    db.add(user)      # 添加到会话
    db.commit()       # 提交事务
    db.refresh(user)  # 刷新对象，获取数据库生成的 ID
    return user


@router.post("/login", response_model=LoginOut)
def login(payload: LoginIn, db: Session = Depends(get_db)) -> LoginOut:
    """
    用户登录接口（JSON 格式），返回 token + 用户信息，供前端一次拿到 token 与 userInfo。
    """
    # 根据用户名查询用户
    user = db.query(User).filter(User.username == payload.username).first()
    
    # 验证用户存在且密码正确
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="用户名或密码错误")
    
    # 生成 JWT Token，subject 为用户名
    token = create_access_token(subject=user.username)
    return LoginOut(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> User:
    """
    获取当前登录用户信息（需携带 Token）。
    供前端刷新用户信息或登录后补拉 userInfo。
    """
    return current_user


@router.post("/token", response_model=TokenOut)
def token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> TokenOut:
    """
    获取 Token 接口（OAuth2 表单格式）
    
    【功能说明】
    符合 OAuth2 密码模式的标准接口，使用表单格式提交数据。
    这个接口主要用于 Swagger UI 的认证功能，让开发者可以在 API 文档中直接测试需要认证的接口。
    
    【请求参数】
    - form_data: OAuth2PasswordRequestForm (表单数据)
        - username: str - 用户名
        - password: str - 密码
        （注意：这是表单格式，不是 JSON）
    - db: Session - 数据库会话（依赖注入）
    
    【返回值】
    TokenOut: 访问令牌信息
        - access_token: str - JWT Token
        - token_type: str - Token 类型（固定为 "bearer"）
    
    【异常情况】
    - HTTP 400: 用户名或密码错误
    
    【与 /login 的区别】
    - /login 使用 JSON 格式请求体，适合前端应用调用
    - /token 使用表单格式，符合 OAuth2 标准，适合 Swagger UI 使用
    """
    # 根据用户名查询用户
    user = db.query(User).filter(User.username == form_data.username).first()
    
    # 验证用户存在且密码正确
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="用户名或密码错误")
    
    # 生成 JWT Token
    token_str = create_access_token(subject=user.username)
    return TokenOut(access_token=token_str)
