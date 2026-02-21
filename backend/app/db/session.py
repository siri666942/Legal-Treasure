"""
=============================================================================
文件: app/db/session.py
模块: 数据库会话管理
描述: 配置数据库引擎和会话工厂
      提供数据库初始化和会话获取功能
=============================================================================

【核心概念】
1. Engine（引擎）: 数据库连接池，管理与数据库的底层连接
2. Session（会话）: 工作单元，管理对象的增删改查和事务
3. SessionLocal: 会话工厂，用于创建新的会话实例

【与 Java 的对比】
- Engine 类似于 DataSource（数据源/连接池）
- Session 类似于 JPA 的 EntityManager
- SessionLocal 类似于 EntityManagerFactory
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.db.base import Base

# ======================== 创建数据库引擎 ========================
# create_engine 创建数据库引擎（连接池）
# 参数说明：
# - settings.DATABASE_URL: 数据库连接字符串
# - connect_args: 额外的连接参数
#   - check_same_thread=False: SQLite 专用参数，允许多线程访问
#     （SQLite 默认不允许跨线程使用连接，但 FastAPI 是多线程的）
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}  # 仅 SQLite 需要此参数
    if settings.DATABASE_URL.startswith("sqlite")
    else {},  # 其他数据库不需要此参数
)

# ======================== 创建会话工厂 ========================
# sessionmaker 创建一个会话工厂类
# 参数说明：
# - bind: 绑定的数据库引擎
# - autoflush=False: 不自动刷新（手动控制何时将更改发送到数据库）
# - autocommit=False: 不自动提交（手动控制事务）
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def init_db() -> None:
    """
    初始化数据库
    
    【功能说明】
    创建所有在 Base 上注册的模型对应的数据库表。
    如果表已存在则跳过，不会删除现有数据。
    
    【调用时机】
    通常在应用启动时调用（见 main.py 的 startup 事件）
    
    【实现原理】
    1. 导入 models 模块，触发所有模型类的定义
    2. 模型类继承 Base 时会自动注册到 Base.metadata
    3. create_all() 根据 metadata 中的表定义创建表
    
    【返回值】
    None
    
    【注意事项】（与Java的区别）
    # noqa: F401 是告诉代码检查工具忽略"导入但未使用"的警告
    因为这里导入 models 的目的是触发副作用（注册模型），而非使用它
    """
    # 导入 models 模块，确保所有模型类都被加载和注册
    # 这一步是必须的，否则 Base.metadata 中不会有任何表定义
    from app import models  # noqa: F401 (忽略"导入但未使用"的警告)

    # 根据所有已注册的模型创建数据库表
    # checkfirst=True（默认）: 如果表已存在则跳过
    Base.metadata.create_all(bind=engine)

    # SQLite 已有表不会自动加新列，为 users 表补充 role/avatar/phone 列（幂等）
    if settings.DATABASE_URL.startswith("sqlite"):
        from sqlalchemy import text
        with engine.connect() as conn:
            try:
                r = conn.execute(text("PRAGMA table_info(users)"))
                cols = [row[1] for row in r.fetchall()]
            except Exception:
                cols = []
            for col, spec in [
                ("role", "VARCHAR(20)"),
                ("avatar", "VARCHAR(500)"),
                ("phone", "VARCHAR(20)"),
            ]:
                if col not in cols:
                    try:
                        conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} {spec}"))
                        conn.commit()
                    except Exception:
                        pass


def get_db() -> Generator[Session, None, None]:
    """
    获取数据库会话（依赖注入函数）
    
    【功能说明】
    创建一个数据库会话，在请求处理完成后自动关闭。
    这是一个生成器函数，配合 FastAPI 的依赖注入系统使用。
    
    【返回值】
    Generator[Session, None, None]: 生成器，产生一个 Session 对象
    
    【使用示例】
    @router.get("/users")
    def get_users(db: Session = Depends(get_db)):
        return db.query(User).all()
    
    【生命周期】
    1. 请求到来时，FastAPI 调用 get_db()
    2. 执行到 yield db，返回 db 会话给路由处理函数
    3. 路由处理函数执行完毕后，继续执行 finally 块
    4. finally 块关闭数据库会话，释放连接回连接池
    
    【注意事项】（与Java的区别）
    Python 的 yield 关键字创建生成器函数，类似于 Java 的 Iterator。
    但这里 yield 的用法更像是 try-with-resources：
    - yield 之前的代码在"进入"时执行
    - yield 之后的代码在"退出"时执行
    这种模式叫做"上下文管理器"或"依赖注入生成器"。
    
    Generator[Session, None, None] 类型注解说明：
    - 第一个 Session: yield 产生的值的类型
    - 第二个 None: send() 接收的值的类型（这里不使用）
    - 第三个 None: return 的值的类型（这里不使用）
    """
    # 创建新的数据库会话
    db = SessionLocal()
    try:
        # yield 将会话交给调用者（路由处理函数）使用
        yield db
    finally:
        # 无论如何都会执行：关闭会话，释放数据库连接
        db.close()
