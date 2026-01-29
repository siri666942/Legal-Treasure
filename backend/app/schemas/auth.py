"""
=============================================================================
文件: app/schemas/auth.py
模块: 认证数据模式
描述: 定义用户认证相关的请求和响应数据结构
      包括注册、登录、Token 和用户信息的数据验证
=============================================================================

【数据模式列表】
- RegisterIn: 用户注册请求体
- LoginIn: 用户登录请求体
- TokenOut: Token 响应体
- UserOut: 用户信息响应体

【Pydantic 功能】
1. 数据验证：自动验证请求数据的类型和约束
2. 数据转换：自动进行类型转换（如字符串转整数）
3. 序列化：自动将 Python 对象转换为 JSON
4. 文档生成：自动生成 OpenAPI 文档中的 Schema
"""

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterIn(BaseModel):
    """
    用户注册请求模式
    
    【类说明】
    定义用户注册接口的请求体结构。
    Pydantic 会自动验证输入数据，不符合约束会返回 422 错误。
    
    【字段说明】
    - username: 用户名，3-50 字符
    - password: 密码，6-128 字符
    - email: 邮箱（可选），会验证邮箱格式
    
    【验证规则】
    Field() 函数用于定义字段约束：
    - min_length: 最小长度
    - max_length: 最大长度
    
    【与 Java 的对比】
    类似于 Java 中使用 @Valid + @Size + @Email 等注解的 DTO 类
    """
    
    # 用户名：必填，长度 3-50 字符
    # Field() 类似于 Java 的 @Size(min=3, max=50)
    username: str = Field(min_length=3, max_length=50)
    
    # 密码：必填，长度 6-128 字符
    password: str = Field(min_length=6, max_length=128)
    
    # 邮箱：可选字段
    # EmailStr 是 Pydantic 内置的邮箱类型，会自动验证邮箱格式
    # str | None = None 表示可选字段，默认值为 None
    # 这种语法在 Java 中没有直接对应，Java 需要用 @Nullable 注解
    email: EmailStr | None = None


class LoginIn(BaseModel):
    """
    用户登录请求模式
    
    【类说明】
    定义用户登录接口的请求体结构。
    仅包含用户名和密码，无额外验证约束。
    
    【字段说明】
    - username: 用户名
    - password: 密码
    """
    
    username: str
    password: str


class TokenOut(BaseModel):
    """
    Token 响应模式
    
    【类说明】
    定义登录成功后返回的 Token 数据结构。
    符合 OAuth2 规范的 Token 响应格式。
    
    【字段说明】
    - access_token: JWT 访问令牌
    - token_type: 令牌类型，固定为 "bearer"
    
    【使用方式】
    客户端收到 Token 后，在后续请求中添加请求头：
    Authorization: Bearer <access_token>
    """
    
    # JWT 访问令牌
    access_token: str
    
    # 令牌类型，默认值为 "bearer"
    # OAuth2 规范要求返回此字段
    token_type: str = "bearer"


class UserOut(BaseModel):
    """
    用户信息响应模式
    
    【类说明】
    定义用户信息的响应数据结构。
    用于注册成功后返回用户信息，或获取当前用户信息。
    
    【配置说明】
    model_config = ConfigDict(from_attributes=True)
    这个配置允许从 ORM 模型对象直接创建 Schema 对象。
    类似于 Java 中的 BeanUtils.copyProperties()
    
    Pydantic v2 语法变化：
    - v1: class Config: orm_mode = True
    - v2: model_config = ConfigDict(from_attributes=True)
    
    【字段说明】
    - id: 用户 ID
    - username: 用户名
    - email: 邮箱（可选）
    
    【注意】
    不包含 password 或 hashed_password 字段，确保密码不会泄露
    """
    
    # Pydantic v2 的配置方式
    # from_attributes=True: 允许从 ORM 对象的属性读取数据
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str | None  # 可选字段，用户可能未设置邮箱
