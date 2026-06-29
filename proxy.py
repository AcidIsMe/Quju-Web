#!/usr/bin/env python3
from flask import Flask, request, Response, jsonify
import requests

app = Flask(__name__)

TARGET_BASE = "https://api.openbitfun.com"   # 目标根地址
VERIFICATION_CODE = "from_bitfun"            # 自定义头固定值

@app.route('/v1/models', methods=['GET'])
def list_models():
    # 返回一个包含 deepseek-v4-pro[1M] 的列表，让 Claude Code 认可
    return jsonify({
        "data": [
            {
                "id": "deepseek-v4-pro[1M]",
                "object": "model",
                "created": 0,
                "owned_by": "openbitfun"
            },
            # 如果你的平台还支持 deepseek-v4-flash，也可一并添加
            {
                "id": "deepseek-v4-flash",
                "object": "model",
                "created": 0,
                "owned_by": "openbitfun"
            }
        ]
    })

@app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'])
def proxy(path):
    # 构造目标 URL（注意避免重复 /v1）
    if path.startswith('v1/'):
        target_url = f"{TARGET_BASE}/{path}"
    else:
        target_url = f"{TARGET_BASE}/{path}"

    # 复制原始请求头
    headers = {k: v for k, v in request.headers.items()
               if k.lower() not in ('host', 'content-length', 'connection')}
    # 添加自定义验证头
    headers['X-Verification-Code'] = VERIFICATION_CODE
    # 如果 cc switch 已经传了 x-api-key，则保留；若没有，可从环境读取（但一般 cc switch 会传）
    # 注意：Claude Code 会将 API Key 放在 x-api-key 头中

    # 转发
    resp = requests.request(
        method=request.method,
        url=target_url,
        headers=headers,
        data=request.get_data(),
        params=request.args,
        stream=True,
        timeout=30
    )

    # 返回响应（过滤掉某些头）
    return Response(
        resp.content,
        status=resp.status_code,
        headers={k: v for k, v in resp.headers.items()
                 if k.lower() not in ('content-encoding', 'transfer-encoding')}
    )

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=False)