# Cloudflare 自动部署

这个仓库已经配置 GitHub Actions。以后只要推送到 `main` 分支，就会自动：

1. 运行 `node tests/validate-index.mjs`。
2. 把 `index.html` 复制到 `dist/index.html`。
3. 部署到 Cloudflare Pages 项目 `aicodex`。

## 需要在 GitHub 设置两个 Secret

进入 GitHub 仓库 `Settings -> Secrets and variables -> Actions -> New repository secret`，添加：

- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare Account ID。
- `CLOUDFLARE_API_TOKEN`：Cloudflare API Token。

## Cloudflare Account ID 在哪里找

进入 Cloudflare Dashboard，选择右侧账号区域，复制 `Account ID`。

也可以在项目根目录运行：

```powershell
npx wrangler whoami
```

输出里会显示当前登录账号对应的 Account ID。

## Cloudflare API Token 怎么创建

进入 Cloudflare Dashboard：

`My Profile -> API Tokens -> Create Token -> Create Custom Token`

权限选择：

- `Account`
- `Cloudflare Pages`
- `Edit`

账号资源选择当前账号即可。

设置完成后，执行：

```powershell
git push origin main
```

GitHub Actions 会自动部署 Cloudflare Pages。

## 首次失败怎么判断

如果 GitHub Actions 里前两步通过，最后 `Deploy to Cloudflare Pages` 失败，优先检查：

- GitHub 仓库是否已经添加 `CLOUDFLARE_ACCOUNT_ID`。
- GitHub 仓库是否已经添加 `CLOUDFLARE_API_TOKEN`。
- API Token 是否有 `Cloudflare Pages:Edit` 权限。
- Pages 项目名是否仍然是 `aicodex`。
