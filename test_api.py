#!/usr/bin/env python3
"""验证 openbitfun Anthropic 接口是否能调用 deepseek-v4-pro"""

import requests, json

API_KEY = input("请输入 API Key: ").strip()
MODEL = input("模型名 (直接回车默认 deepseek-v4-pro): ").strip() or "deepseek-v4-pro"

payload = {
    "model": MODEL,
    "max_tokens": 256,
    "messages": [
        {"role": "user", "content": "请回复一句简短的话来确认你正常工作。"}
    ],
}

headers = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    "anthropic-version": "2023-06-01",
    "X-Verification-Code": "from_bitfun",
}

print(f"\nPOST https://api.openbitfun.com/v1/messages")
print(f"model: {payload['model']}")
print("-" * 50)

try:
    resp = requests.post(
        "https://api.openbitfun.com/v1/messages",
        json=payload, headers=headers, timeout=30,
    )
    print(f"Status: {resp.status_code}")
    print("-" * 50)

    if resp.status_code == 200:
        data = resp.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
        for block in (data.get("content") or []):
            if block.get("type") == "text":
                print("\n===== 回复 =====")
                print(block["text"])
    else:
        print(resp.text)

except Exception as e:
    print(f"错误: {e}")