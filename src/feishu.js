const API_ROOT = "https://open.feishu.cn/open-apis";

async function parseResponse(response, action) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.code) {
    throw new Error(`${action}失败：${body.msg || response.statusText} (${body.code || response.status})`);
  }
  return body.data ?? body;
}

export async function getTenantToken(appId, appSecret) {
  const response = await fetch(`${API_ROOT}/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret })
  });
  const data = await parseResponse(response, "获取 tenant_access_token");
  return data.tenant_access_token;
}

export async function findFirstRecordId(token, appToken, tableId) {
  const url = new URL(`${API_ROOT}/bitable/v1/apps/${appToken}/tables/${tableId}/records`);
  url.searchParams.set("page_size", "1");
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await parseResponse(response, "查询测试记录");
  const recordId = data.items?.[0]?.record_id;
  if (!recordId) throw new Error("课程表中没有可用于 Demo 的记录");
  return recordId;
}

export async function getRecord(token, appToken, tableId, recordId) {
  const response = await fetch(`${API_ROOT}/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return parseResponse(response, "读取课程记录");
}

export async function updateRecord(token, appToken, tableId, recordId, fields) {
  const response = await fetch(`${API_ROOT}/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields })
  });
  return parseResponse(response, "更新课程记录");
}

export async function uploadMessageImage(token, imageBuffer) {
  const form = new FormData();
  form.append("image_type", "message");
  form.append("image", new Blob([imageBuffer], { type: "image/png" }), "training-summary.png");
  const response = await fetch(`${API_ROOT}/im/v1/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });
  const data = await parseResponse(response, "上传总结图片");
  return data.image_key;
}

export async function sendImage(token, openId, imageKey) {
  const url = new URL(`${API_ROOT}/im/v1/messages`);
  url.searchParams.set("receive_id_type", "open_id");
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      receive_id: openId,
      msg_type: "image",
      content: JSON.stringify({ image_key: imageKey })
    })
  });
  return parseResponse(response, "发送总结图片");
}
