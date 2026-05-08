# Cloudflare 自动部署

这个仓库已经配置 GitHub Actions。以后只要推送到 `main` 分支，就会自动：

1. 运行 `node tests/validate-index.mjs`。
2. 把 `index.html` 复制到 `dist/index.html`。
3. 部署到 Cloudflare Pages 项目 `aicodex`。

## 需要在 GitHub 设置两个 Secret

进入 GitHub 仓库 `Settings -> Secrets and variables -> Actions -> New repository secret`，添加：

- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare Account ID。
- `CLOUDFLARE_API_TOKEN`：Cloudflare API Token。

Cloudflare API Token 权限选择：

- `Account`
- `Cloudflare Pages`
- `Edit`

设置完成后，执行：

```powershell
git push origin main
```

GitHub Actions 会自动部署 Cloudflare Pages。
