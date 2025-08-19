# 无服务器日记系统

一个完全无服务器的日记系统，通过Telegram机器人更新，使用GitHub存储markdown文件，按月份组织。

## ✨ 特性

- 🚀 **完全无服务器** - 使用GitHub Actions和Vercel Functions
- 📁 **按月份组织** - 自动按`YYYY-MM`格式创建文件夹
- 📝 **Markdown存储** - 支持丰富的markdown格式
- 🔄 **自动覆盖** - 相同日期和标题的日记会被覆盖
- 📱 **响应式界面** - 支持手机和电脑访问
- 🎨 **美观设计** - 现代化的用户界面

## 📂 文件结构

```
your-diary-repo/
├── index.html                          # 前端页面
├── diaries/                           # 日记存储目录
│   ├── 2025-08/                      # 按月份分类
│   │   ├── 2025-08-25_总结.md        # 日记文件
│   │   └── 2025-08-26_学习笔记.md    
│   └── 2025-09/
│       └── 2025-09-01_开始.md
├── .github/workflows/
│   └── telegram-bot.yml              # GitHub Actions工作流
└── api/
    └── telegram-webhook.js            # Webhook处理器
```

## 🚀 部署步骤

### 1. 创建GitHub仓库

1. 在GitHub创建一个新的**公开**仓库（如：`my-diary`）
2. 创建以下文件结构：
   - `index.html` （前端页面）
   - `.github/workflows/telegram-bot.yml` （GitHub Actions）
   - `api/telegram-webhook.js` （Webhook处理器）

### 2. 配置GitHub

1. **设置Secrets**：
   - 进入仓库 Settings → Secrets and variables → Actions
   - 添加 `TELEGRAM_TOKEN`（从BotFather获取的Token）

2. **启用GitHub Actions**：
   - 确保仓库的Actions功能已启用

### 3. 创建Telegram机器人

1. 在Telegram中找到 @BotFather
2. 发送 `/newbot` 创建新机器人
3. 获取API Token并保存到GitHub Secrets

### 4. 部署Webhook到Vercel

1. 将仓库连接到Vercel
2. 在Vercel项目设置中添加环境变量：
   - `GITHUB_TOKEN`: GitHub Personal Access Token（需要repo权限）
   - `GITHUB_OWNER`: 你的GitHub用户名
   - `GITHUB_REPO`: 日记仓库名
3. 部署完成后获得域名（如：`https://your-project.vercel.app`）

### 5. 设置Telegram Webhook

```bash
curl -X POST "https://api.telegram.org/bot你的TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-project.vercel.app/api/telegram-webhook"}'
```

### 6. 配置前端

修改 `index.html` 中的GitHub配置：

```javascript
const GITHUB_CONFIG = {
    owner: 'your-username',        // 替换为你的GitHub用户名
    repo: 'my-diary',             // 替换为你的日记仓库名
    branch: 'main'                // 分支名
};
```

## 📝 使用方法

### 发送日记

向Telegram机器人发送以下格式的消息：

```
2025-08-25 今天的总结
今天学习了很多新技术，包括：

## 学到的内容
- GitHub Actions的使用
- Vercel Functions部署
- Markdown语法

> 明天要继续努力学习！

感觉很有收获 🎉
```

### 日记格式说明

- **第一行**：`YYYY-MM-DD 标题` （必须严格按此格式）
- **其余内容**：支持完整的Markdown语法
  - 标题：`# ## ###`
  - 列表：`- * 1.`
  - 引用：`>`
  - 代码：`` `code` ``
  - 加粗：`**text**`
  - 斜体：`*text*`

### 文件命名规则

- 自动按月份创建目录：`diaries/YYYY-MM/`
- 文件名格式：`YYYY-MM-DD_标题.md`
- 特殊字符会被替换为下划线
- 相同日期和标题会覆盖原文件

## 🛠️ 技术架构

```
Telegram Bot → Vercel Function → GitHub Actions → GitHub Repo → Static Website
```

1. **Telegram机器人** 接收消息
2. **Vercel Function** 处理webhook并触发GitHub Actions
3. **GitHub Actions** 处理日记并提交到仓库
4. **静态网站** 通过GitHub API读取和显示日记

## 🔧 自定义配置

### 修改样式

编辑 `index.html` 中的CSS部分来自定义外观。

### 添加功能

可以扩展的功能：
- 图片上传支持
- 标签系统
- 搜索功能
- 导出功能
- 评论系统

### 环境变量

**Vercel环境变量**：
- `GITHUB_TOKEN`: GitHub Personal Access Token
- `GITHUB_OWNER`: GitHub用户名
- `GITHUB_REPO`: 仓库名

**GitHub Secrets**：
- `TELEGRAM_TOKEN`: Telegram机器人Token

## 📱 访问网站

部署完成后，可以通过以下方式访问：
- Vercel域名：`https://your-project.vercel.app`
- GitHub Pages：`https://username.github.io/repo-name`

## 🐛 故障排除

### 常见问题

1. **机器人没有响应**
   - 检查Webhook设置是否正确
   - 查看Vercel函数日志
   - 确认TELEGRAM_TOKEN正确

2. **日记没有保存**
   - 检查GitHub Actions日志
   - 确认仓库权限设置
   - 验证GITHUB_TOKEN权限

3. **网站无法加载日记**
   - 确认仓库为公开状态
   - 检查GitHub配置是否正确
   - 查看浏览器控制台错误

4. **格式错误**
   ```
   正确格式：2025-08-25 标题
   错误格式：25/08/2025 标题
   ```

### 调试方法

1. **查看GitHub Actions日志**：
   - 仓库 → Actions → 选择运行记录

2. **查看Vercel函数日志**：
   - Vercel Dashboard → Functions → View Details

3. **测试Webhook**：
   ```bash
   curl -X POST "https://api.telegram.org/bot你的TOKEN/getWebhookInfo"
   ```

## 🚀 进阶使用

### 批量导入

如果有现有日记要导入，可以：

1. 按月份创建文件夹：`diaries/YYYY-MM/`
2. 创建markdown文件：`YYYY-MM-DD_标题.md`
3. 文件内容格式：
   ```markdown
   # 标题
   
   *YYYY-MM-DD*
   
   日记内容...
   ```

### 备份日记

定期备份GitHub仓库：
```bash
git clone https://github.com/username/repo-name.git
```

### API访问

可以通过GitHub API直接访问日记数据：
```
https://api.github.com/repos/owner/repo/contents/diaries/2025-08
```

## 📄 许可证

MIT License - 自由使用和修改

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

---

**享受写日记的乐趣吧！📖✨**
