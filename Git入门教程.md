# Git 入门教程（小白版）

## 📌 你遇到的错误是什么意思？

**错误信息：** `fatal: no email was given and auto-detection is disabled`

**含义：** Git 需要知道你是谁才能记录你的操作。这个错误表示 Git 还没有配置你的用户名和邮箱。

**解决方法：** 需要设置 `user.name` 和 `user.email`

---

## 🚀 第一步：配置 Git（必须先做！）

### 方法一：在 Cursor 中配置（推荐）

1. **打开终端**
   - 按 `Ctrl + `` (反引号键，在数字1左边)
   - 或者菜单：`终端` → `新建终端`

2. **设置你的用户名**（替换成你的名字）
   ```bash
   git config --global user.name "你的名字"
   ```
   例如：`git config --global user.name "张三"`

3. **设置你的邮箱**（替换成你的邮箱）
   ```bash
   git config --global user.email "你的邮箱@example.com"
   ```
   例如：`git config --global user.email "zhangsan@example.com"`

4. **验证配置是否成功**
   ```bash
   git config --global --list
   ```
   应该能看到你刚才设置的用户名和邮箱

### 方法二：在 Cursor 对话框中配置

如果看到 Cursor 弹出的对话框：
1. 点击 **"Open Git Log"** 按钮
2. 或者点击 **"Learn More"** 查看帮助
3. 按照提示在终端中输入上述命令

---

## 📚 Git 是什么？

**Git** 是一个**版本控制系统**，简单理解就是：
- 📝 记录你代码的每次修改
- 🔄 可以回到之前的版本
- 👥 多人协作不会冲突
- 💾 备份你的代码

---

## 🎯 Git 核心概念

### 1. **仓库（Repository）**
- 就是一个文件夹，Git 会跟踪这个文件夹里所有文件的变化
- 初始化仓库：`git init`

### 2. **提交（Commit）**
- 就像给代码拍一张"快照"，记录当前的状态
- 每次提交都要写一条说明，比如"修复了登录bug"

### 3. **工作区、暂存区、仓库**
```
工作区（你正在编辑的文件）
    ↓ git add
暂存区（准备提交的文件）
    ↓ git commit
仓库（已保存的版本）
```

---

## 🔧 常用 Git 命令（从零开始）

### 基础操作

#### 1. **查看当前状态**
```bash
git status
```
- 显示哪些文件被修改了
- 显示哪些文件还没被 Git 跟踪

#### 2. **初始化仓库**（如果项目还没有 Git）
```bash
git init
```
- 在当前文件夹创建 Git 仓库

#### 3. **添加文件到暂存区**
```bash
# 添加单个文件
git add 文件名

# 添加所有修改的文件
git add .

# 添加所有 .py 文件
git add *.py
```

#### 4. **提交更改**
```bash
git commit -m "你的提交说明"
```
- `-m` 后面写这次修改的说明
- 例如：`git commit -m "添加了用户登录功能"`

#### 5. **查看提交历史**
```bash
git log
```
- 显示所有提交记录
- 按 `q` 退出

#### 6. **查看文件差异**
```bash
# 查看工作区的修改
git diff

# 查看某个文件的修改
git diff 文件名
```

---

### 分支操作（进阶）

#### 1. **查看分支**
```bash
git branch
```
- 显示所有分支
- `*` 标记的是当前分支

#### 2. **创建新分支**
```bash
git branch 分支名
```
例如：`git branch feature-login`

#### 3. **切换分支**
```bash
git checkout 分支名
```
例如：`git checkout feature-login`

#### 4. **创建并切换分支**（一步到位）
```bash
git checkout -b 分支名
```

---

### 远程仓库操作（与 GitHub/Gitee 配合）

#### 1. **查看远程仓库**
```bash
git remote -v
```

#### 2. **添加远程仓库**
```bash
git remote add origin 仓库地址
```
例如：`git remote add origin https://github.com/用户名/项目名.git`

#### 3. **推送代码到远程**
```bash
# 第一次推送
git push -u origin main

# 之后的推送
git push
```

#### 4. **从远程拉取代码**
```bash
git pull
```

#### 5. **克隆远程仓库**
```bash
git clone 仓库地址
```

---

## 📖 日常使用流程

### 场景一：开始一个新项目

```bash
# 1. 创建项目文件夹
mkdir 我的项目
cd 我的项目

# 2. 初始化 Git 仓库
git init

# 3. 创建文件并编辑...

# 4. 添加文件
git add .

# 5. 提交
git commit -m "初始提交"
```

### 场景二：日常开发流程

```bash
# 1. 修改代码文件...

# 2. 查看修改了什么
git status

# 3. 查看具体修改内容
git diff

# 4. 添加修改的文件
git add .

# 5. 提交
git commit -m "修复了bug：登录时密码验证错误"

# 6. 推送到远程（如果有）
git push
```

### 场景三：从远程仓库开始

```bash
# 1. 克隆项目
git clone https://github.com/用户名/项目名.git
cd 项目名

# 2. 修改代码...

# 3. 提交
git add .
git commit -m "我的修改"

# 4. 推送
git push
```

---

## ⚠️ 常见错误和解决方法

### 1. **"fatal: no email was given"**
**原因：** 没有配置邮箱
**解决：** 
```bash
git config --global user.email "你的邮箱"
```

### 2. **"fatal: not a git repository"**
**原因：** 当前文件夹不是 Git 仓库
**解决：** 
```bash
git init
```

### 3. **"nothing to commit"**
**原因：** 没有文件被修改，或者修改的文件还没添加到暂存区
**解决：** 
```bash
git add .
git commit -m "提交说明"
```

### 4. **"Your branch is ahead of 'origin/main'"**
**原因：** 本地有提交还没推送到远程
**解决：** 
```bash
git push
```

---

## 🎨 在 Cursor 中使用 Git（图形化界面）

Cursor 提供了图形化的 Git 界面，比命令行更直观：

### 1. **查看文件状态**
- 左侧文件资源管理器中：
  - 🟢 **绿色 U** = 新文件（未跟踪）
  - 🟡 **黄色 M** = 已修改
  - 🔴 **红色 D** = 已删除

### 2. **提交更改**
- 点击左侧源代码管理图标（分支图标）
- 在"消息"框中输入提交说明
- 点击"提交"按钮（✓）

### 3. **查看差异**
- 点击修改的文件，会显示修改前后的对比

### 4. **推送/拉取**
- 点击源代码管理面板顶部的"..."菜单
- 选择"推送"或"拉取"

---

## 📝 提交信息规范（建议）

好的提交信息应该清晰说明做了什么：

✅ **好的提交信息：**
- `添加用户登录功能`
- `修复了密码验证的bug`
- `更新了README文档`
- `重构了数据库连接代码`

❌ **不好的提交信息：**
- `更新`
- `修复bug`
- `123`
- `asdf`

---

## 🔗 推荐学习资源

1. **官方文档：** https://git-scm.com/doc
2. **GitHub 教程：** https://guides.github.com/
3. **可视化学习：** https://learngitbranching.js.org/ （强烈推荐！）

---

## 💡 小贴士

1. **经常提交：** 每完成一个小功能就提交一次，不要等到最后
2. **写清楚提交信息：** 方便以后查看历史
3. **使用分支：** 开发新功能时创建新分支，不会影响主分支
4. **先拉取再推送：** 多人协作时，先 `git pull` 再 `git push`

---

## 🎯 快速参考卡片

```
初始化仓库        git init
查看状态          git status
添加文件          git add .
提交更改          git commit -m "说明"
查看历史          git log
创建分支          git branch 分支名
切换分支          git checkout 分支名
推送代码          git push
拉取代码          git pull
克隆仓库          git clone 地址
```

---

**现在，先完成第一步：配置你的用户名和邮箱！** 🚀
