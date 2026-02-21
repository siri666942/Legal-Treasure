# -*- coding: utf-8 -*-
"""
API 功能验证脚本：发送约 20 个请求覆盖各模块，全部通过则退出码 0。
用法: 在 backend 目录下执行  python scripts/verify_api.py
"""
from __future__ import annotations

import sys
import uuid

import httpx

# 将 print 同时写入文件，便于在后台运行时查看
_log: list[str] = []

def _out(msg: str) -> None:
    _log.append(msg)
    print(msg)

BASE = "http://127.0.0.1:8000"
API = f"{BASE}/api/v1"

# 用于注册的随机用户名，避免重复
SUFFIX = uuid.uuid4().hex[:8]
CLIENT_USER = f"verify_client_{SUFFIX}"
LAWYER_USER = f"verify_lawyer_{SUFFIX}"
PASSWORD = "123456"


def main() -> None:
    _out("开始验证 API（共 20 个请求）...")
    failed: list[str] = []
    client_token: str | None = None
    lawyer_token: str | None = None
    created_case_id: int | None = None

    def req(
        method: str,
        path: str,
        *,
        json: dict | None = None,
        params: dict | None = None,
        token: str | None = None,
        expect_status: int | tuple[int, ...] = 200,
        desc: str = "",
    ) -> httpx.Response:
        url = path if path.startswith("http") else (API.rstrip("/") + "/" + path.lstrip("/"))
        headers = {}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        if json is not None and "Content-Type" not in headers:
            headers["Content-Type"] = "application/json"
        r = httpx.request(method, url, json=json, params=params, headers=headers, timeout=10.0)
        ok = r.status_code == expect_status if isinstance(expect_status, int) else r.status_code in expect_status
        if not ok:
            failed.append(f"{desc or path}: 期望 {expect_status} 实际 {r.status_code} body={r.text[:200]}")
        return r

    try:
        # 1. 健康检查
        req("GET", f"{BASE}/health", desc="1.GET /health")
        # 2. 注册客户
        req("POST", "auth/register", json={"username": CLIENT_USER, "password": PASSWORD, "email": f"{CLIENT_USER}@test.com"}, desc="2.POST /auth/register(client)")
        # 3. 登录客户
        r3 = req("POST", "auth/login", json={"username": CLIENT_USER, "password": PASSWORD}, desc="3.POST /auth/login(client)")
        if r3.status_code == 200:
            data = r3.json()
            client_token = data.get("access_token")
            if not client_token:
                failed.append("3.login 响应缺少 access_token")
        # 4. 获取当前用户（客户）
        req("GET", "auth/me", token=client_token, desc="4.GET /auth/me(client)")
        # 5. 案件列表（客户）
        req("GET", "cases", token=client_token, params={}, desc="5.GET /cases")
        # 6. 案件列表含已结案
        req("GET", "cases", token=client_token, params={"history": "true"}, desc="6.GET /cases?history=true")
        # 7. 注册律师
        req("POST", "auth/register", json={"username": LAWYER_USER, "password": PASSWORD, "role": "lawyer"}, desc="7.POST /auth/register(lawyer)")
        # 8. 登录律师
        r8 = req("POST", "auth/login", json={"username": LAWYER_USER, "password": PASSWORD}, desc="8.POST /auth/login(lawyer)")
        if r8.status_code == 200:
            lawyer_token = r8.json().get("access_token")
        # 9. 律师创建案件
        r9 = req(
            "POST",
            "cases",
            token=lawyer_token,
            json={
                "caseNo": "VER-2025-001",
                "caseTitle": "验证脚本创建案件",
                "caseType": "合同纠纷",
                "court": "测试法院",
                "judge": "测试法官",
                "filingDate": "2025-02-21",
                "amount": "10万",
                "applicableLaw": "民法典",
            },
            expect_status=201,
            desc="9.POST /cases(律师创建)",
        )
        if r9.status_code == 201:
            created_case_id = r9.json().get("id")
        # 10. 案件详情
        if created_case_id:
            req("GET", f"cases/{created_case_id}", token=lawyer_token, desc="10.GET /cases/:id")
        else:
            req("GET", "cases/1", token=lawyer_token, expect_status=(200, 404, 403), desc="10.GET /cases/1")
        # 11. 律师列表
        req("GET", "lawyers", desc="11.GET /lawyers")
        # 12. 律师列表关键词
        req("GET", "lawyers", params={"keyword": "律"}, desc="12.GET /lawyers?keyword=律")
        # 13. 律师详情（可能 404）
        req("GET", "lawyers/1", expect_status=(200, 404), desc="13.GET /lawyers/1")
        # 14. 提交反馈（不登录）
        req(
            "POST",
            "feedback",
            json={"type": 1, "content": "验证脚本提交的反馈内容不少于十个字", "contact": "test@test.com"},
            expect_status=201,
            desc="14.POST /feedback(未登录)",
        )
        # 15. 提交反馈（登录）
        req(
            "POST",
            "feedback",
            token=client_token,
            json={"type": 2, "content": "验证脚本登录用户提交的反馈内容不少于十个字"},
            expect_status=201,
            desc="15.POST /feedback(已登录)",
        )
        # 16. 法条搜索
        req("GET", "query/laws", params={}, desc="16.GET /query/laws")
        # 17. 合同列表（需登录）
        req("GET", "query/contracts", token=client_token, desc="17.GET /query/contracts")
        # 18. 重复注册应 400
        req("POST", "auth/register", json={"username": CLIENT_USER, "password": PASSWORD}, expect_status=400, desc="18.POST /auth/register(重复用户名)")
        # 19. 错误密码登录应 400
        req("POST", "auth/login", json={"username": CLIENT_USER, "password": "wrong"}, expect_status=400, desc="19.POST /auth/login(错误密码)")
        # 20. 无 Token 访问 /me 应 401
        req("GET", "auth/me", expect_status=401, desc="20.GET /auth/me(无Token)")
    except Exception as e:
        failed.append(f"执行异常: {e}")
        import traceback
        _out(traceback.format_exc())

    if failed:
        _out("以下请求未达预期:")
        for f in failed:
            _out("  - " + f)
        with open("scripts/verify_result.txt", "w", encoding="utf-8") as f:
            f.write("\n".join(_log))
        sys.exit(1)
    _out("20 个请求均通过验证。")
    with open("scripts/verify_result.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(_log))


if __name__ == "__main__":
    main()
