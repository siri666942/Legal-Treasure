"""
=============================================================================
文件: app/core/config.py
模块: 应用配置
描述: 定义应用的全局配置项
      使用 Pydantic Settings 管理配置，支持从环境变量和 .env 文件加载
=============================================================================

【配置管理说明】
Pydantic Settings 是 Python 中流行的配置管理方案，类似于 Java 中的：
- Spring Boot 的 @ConfigurationProperties
- Spring 的 Environment 抽象

【配置加载顺序】（优先级从高到低）
1. 系统环境变量
2. .env 文件中的变量
3. Settings 类中定义的默认值

【使用方法】
from app.core.config import settings
print(settings.PROJECT_NAME)  # 访问配置项
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    应用配置类
    
    【类说明】
    继承自 Pydantic 的 BaseSettings，自动从环境变量加载配置值。
    每个类属性对应一个配置项，类型注解用于自动类型转换和验证。
    
    【与 Java 的对比】
    类似于 Spring Boot 的 @ConfigurationProperties 注解类，
    但 Pydantic 通过类型注解自动完成类型转换，更加简洁。
    
    【属性说明】
    - model_config: 配置模型的元数据（Pydantic v2 语法）
    - PROJECT_NAME: 项目名称，用于 API 文档标题
    - VERSION: 应用版本号
    - API_V1_STR: API v1 路由前缀
    - SECRET_KEY: JWT 签名密钥（生产环境必须修改！）
    - ACCESS_TOKEN_EXPIRE_MINUTES: Token 有效期（分钟）
    - ALGORITHM: JWT 签名算法
    - DATABASE_URL: 数据库连接字符串
    - UPLOAD_DIR: 文件上传目录
    - BACKEND_CORS_ORIGINS: 允许的 CORS 源列表
    """
    
    # Pydantic v2 的配置方式，替代了 v1 的 Config 内部类
    # env_file: 指定 .env 文件路径
    # env_file_encoding: .env 文件编码
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # ======================== 项目基本信息 ========================
    PROJECT_NAME: str = "律宝小队-后端"  # 项目名称，显示在 Swagger 文档标题
    VERSION: str = "0.1.0"               # 版本号
    API_V1_STR: str = "/api/v1"          # API v1 路由前缀

    # ======================== 安全配置 ========================
    # JWT 签名密钥 - 生产环境中必须通过环境变量设置为复杂的随机字符串！
    SECRET_KEY: str = "dev-secret-change-me"
    # Token 有效期：60分钟 * 24 = 1天
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    # JWT 签名算法，HS256 是对称加密算法
    ALGORITHM: str = "HS256"

    # ======================== 数据库配置 ========================
    # 数据库连接字符串，默认使用 SQLite
    # SQLite 格式: sqlite:///./文件名.db
    # PostgreSQL 格式: postgresql://user:password@host:port/database
    # MySQL 格式: mysql+pymysql://user:password@host:port/database
    DATABASE_URL: str = "sqlite:///./app.db"
    
    # ======================== 文件存储配置 ========================
    # 文件上传目录
    UPLOAD_DIR: str = "./uploads"

    # ======================== CORS 配置 ========================
    # 允许的跨域源列表
    # 空列表表示不启用 CORS 中间件
    # 示例: ["http://localhost:3000", "https://example.com"]
    BACKEND_CORS_ORIGINS: list[str] = []  # list[str] 是 Python 3.9+ 泛型语法，Java 中对应 List<String>


# 创建全局配置实例
# 在应用启动时自动加载配置，整个应用共享这一个实例
# 类似于 Java Spring 中的 @Bean 单例
settings = Settings()
