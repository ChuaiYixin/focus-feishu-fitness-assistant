# FOCUS 私教训练助手

当前生产入口为 `https://focus.umaoni.cn/`，通过飞书企业自建应用“FOCUS教练助手”打开。完整接管步骤见 [HANDOVER.md](HANDOVER.md)。

## 当前网页应用

```powershell
cd webapp/edgeone-static
npm ci
npx vite --host 127.0.0.1
```

生产构建：

```powershell
npm run build
```

## 早期图片生成 Demo

根据飞书多维表格课程记录生成 `1080 × 1440` PNG，并由飞书机器人发送给记录中的“接收人”。GitHub Actions 可按 `record_id` 触发；手动测试时留空会读取表格第一条记录。

## 本地预览

```powershell
npm install
npm run demo
```

输出文件：`output/demo-summary.png`。

## 后续接入

1. 创建飞书企业自建应用并启用机器人。
2. 授予多维表格读取/更新、消息发送和图片上传权限。
3. 在私有 GitHub 仓库配置飞书凭证为 Actions Secrets。
4. 在测试记录的“接收人”字段选择自己。
5. 手动运行工作流完成首次端到端测试。
6. 飞书自动化仅向 GitHub 传递 `record_id`。

不要提交 `.env`、App Secret、学员数据或生成的真实训练图片。
