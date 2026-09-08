# FOCUS 私教训练助手交接指南

> **所有者本人授权提示**：涉及 GitHub 私有仓库邀请、腾讯云 CAM 授权、阿里云 RAM/DNS 授权、飞书应用协作者管理，以及首次将 EdgeOne 连接到 GitHub 的操作，必须联系当前所有者，由所有者本人登录对应管理账号完成。接手人不得索要或代持所有者密码、短信验证码、App Secret、访问密钥或 Token。

## 1. 获取源码

仓库为私有仓库。接手人先把自己的 GitHub 用户名发给仓库所有者。

**【必须联系所有者本人登录授权】** 所有者亲自进入 GitHub 仓库的 **Settings → Collaborators → Add people** 发出邀请。接手人接受邀请后执行：

```powershell
git clone https://github.com/ChuaiYixin/focus-feishu-fitness-assistant.git
cd focus-feishu-fitness-assistant/webapp/edgeone-static
npm ci
npm run build
```

主要线上前端位于 `webapp/edgeone-static/`，源页面位于 `webapp/app/`。`src/` 与根目录工作流属于早期的飞书多维表格图片生成方案，请保留作为历史功能。

## 2. 本地运行

```powershell
cd webapp/edgeone-static
npm ci
npx vite --host 127.0.0.1
```

浏览器打开命令输出的本地地址。提交前至少运行 `npm run build`。

## 3. 腾讯云 EdgeOne 权限

线上项目：`focus-coach-assistant-cn`。

1. 接手人注册或登录腾讯云，把账号 UIN 发给主账号管理员。
2. **【必须联系所有者本人登录授权】** 所有者亲自进入腾讯云 **访问管理 CAM → 用户 → 用户列表**，新建或选择协作者。
3. 授予 EdgeOne Pages 项目的查看、构建、部署和域名管理权限。若无法按项目细分，可暂时授予 EdgeOne 相关管理策略，交接完成后再收窄权限。
4. 接手人进入 EdgeOne Pages，确认能看到项目、部署记录和 `focus.umaoni.cn`。

域名当前指向：`focus.umaoni.cn.pages.dnsoe4.com`。不要修改 `umaoni.cn` 根域名和 `www` 记录。

## 4. 阿里云 DNS 权限

域名 `umaoni.cn` 的 DNS 在阿里云管理。接手人需要修改域名解析时：

1. 提供阿里云账号或 RAM 用户名给管理员。
2. **【必须联系所有者本人登录授权】** 所有者亲自进入阿里云 **RAM 访问控制 → 用户** 创建/选择用户并授权云解析 DNS。
3. 只授予云解析 DNS 的管理权限；不需要域名转移权限。
4. 重点保护以下记录：
   - `focus` CNAME → `focus.umaoni.cn.pages.dnsoe4.com`
   - `edgeonereclaim.focus` TXT（EdgeOne 域名归属验证）
   - `@` 和 `www` 属于 umaoni 主站，未经确认不要修改。

## 5. 飞书应用权限

企业自建应用：`FOCUS教练助手`，App ID：`cli_aa02f7570d789bd4`。

1. 接手人先加入“方可健身”飞书企业。
2. **【必须联系所有者本人登录授权】** 所有者亲自登录飞书管理后台，将接手人加入“方可健身”企业；如接手人已经是企业成员，可跳过此动作。
3. **【必须联系所有者本人登录授权】** 所有者亲自进入飞书开放平台的该应用，打开 **基础信息 → 协作者管理 → 添加协作者**，选择接手人并授予开发/管理权限。
4. 接手人确认能够进入网页应用、权限管理和版本管理页面。
5. 当前桌面端与移动端主页均为 `https://focus.umaoni.cn/`。只更新网站代码时通常无需发布新的飞书版本；修改主页地址、应用权限或应用配置后才需要创建并发布版本。

## 6. 发布流程

当前 EdgeOne 项目最初通过本地构建产物部署。推荐交接后在 EdgeOne 中关联本 GitHub 仓库：

- 根目录：`webapp/edgeone-static`
- 安装命令：`npm ci`
- 构建命令：`npm run build`
- 输出目录：`dist`
- 生产分支：`main`

关联完成后，推送 `main` 会自动触发生产部署。

**【必须联系所有者本人登录授权】** 首次把 EdgeOne 项目连接到 GitHub 私有仓库时，需要所有者亲自登录腾讯云和 GitHub，确认仓库访问授权。授权完成后，已获项目权限的接手人可维护日常部署。

**【必须联系所有者本人确认】** 任何生产环境部署、域名变更或飞书正式版本发布，在接手初期都应先取得所有者确认；稳定运行并明确职责后再按公司流程放权。

## 7. 密钥与数据安全

- 不要把 `.env`、飞书 App Secret、GitHub Token、腾讯云密钥提交到仓库。
- 如继续使用根目录的 GitHub Actions 图片生成工作流，应在仓库 **Settings → Secrets and variables → Actions** 中配置所需 Secrets；不要通过聊天传递明文密钥。
- 不要提交真实学员数据或生成的私教训练图片。

## 8. 完成交接的验收清单

- 能克隆私有仓库并推送测试分支。
- `webapp/edgeone-static` 能安装依赖并构建。
- 能查看并部署 EdgeOne 项目。
- 能查看 `focus.umaoni.cn` 的域名和证书状态。
- 能进入飞书应用后台并创建测试版本。
- 必要时能管理 `focus` 子域名解析，但无法误改或承诺不改 umaoni 主站记录。
