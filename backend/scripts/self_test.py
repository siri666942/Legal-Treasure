import time

import httpx


def main() -> None:
    base = "http://127.0.0.1:8000"

    # 等服务起来（最多等 10 秒）
    ok = False
    for _ in range(20):
        try:
            r = httpx.get(f"{base}/health", timeout=2)
            if r.status_code == 200:
                ok = True
                break
        except Exception:
            pass
        time.sleep(0.5)
    if not ok:
        raise RuntimeError("服务未启动：请先运行 uvicorn app.main:app --reload")

    username = f"test_user_{int(time.time())}"
    password = "12345678"

    # 注册
    r = httpx.post(
        f"{base}/api/v1/auth/register",
        json={"username": username, "password": password, "email": None},
        timeout=10,
    )
    if r.status_code != 200:
        raise RuntimeError(f"注册失败：{r.status_code} {r.text}")

    # 登录
    r = httpx.post(
        f"{base}/api/v1/auth/login",
        json={"username": username, "password": password},
        timeout=10,
    )
    if r.status_code != 200:
        raise RuntimeError(f"登录失败：{r.status_code} {r.text}")
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 文件上传
    files = {"file": ("hello.txt", b"hello backend", "text/plain")}
    r = httpx.post(
        f"{base}/api/v1/files/upload", headers=headers, files=files, timeout=30
    )
    if r.status_code != 200:
        raise RuntimeError(f"上传失败：{r.status_code} {r.text}")

    # 查询：文件列表
    r = httpx.get(f"{base}/api/v1/files", headers=headers, timeout=10)
    if r.status_code != 200:
        raise RuntimeError(f"查询文件失败：{r.status_code} {r.text}")

    # 查询：合同列表（可能为空）
    r = httpx.get(f"{base}/api/v1/query/contracts", headers=headers, timeout=10)
    if r.status_code != 200:
        raise RuntimeError(f"查询合同失败：{r.status_code} {r.text}")

    # 查询：法条（空库也应 200）
    r = httpx.get(f"{base}/api/v1/query/laws", timeout=10)
    if r.status_code != 200:
        raise RuntimeError(f"查询法条失败：{r.status_code} {r.text}")

    print("SELF TEST OK")


if __name__ == "__main__":
    main()

