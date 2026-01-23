# Git 安装和配置指南（Windows）

## 🔍 问题诊断

你遇到的错误：`无法将"git"项识别为 cmdlet、函数、脚本文件或可运行程序的名称`

**原因：** Git 没有安装，或者 Git 没有添加到系统的 PATH 环境变量中。

---

## ✅ 解决方案

### 方法一：安装 Git for Windows（推荐）

#### 步骤 1：下载 Git

1. **访问 Git 官网：** https://git-scm.com/download/win
2. **或者直接下载：** 下载会自动开始，文件名为 `Git-2.x.x-64-bit.exe`

#### 步骤 2：安装 Git

1. **运行安装程序**（双击下载的 `.exe` 文件）

2. **安装选项设置**（按以下推荐设置）：
   - ✅ **选择组件：**
     - ✅ Git Bash Here
     - ✅ Git GUI Here
     - ✅ Associate .git* configuration files with the default text editor
     - ✅ Associate .sh files to be run with Bash
   
   - ✅ **选择默认编辑器：** 选择 "Use Visual Studio Code as Git's default editor"（如果你用 Cursor，也可以选这个）
   
   - ✅ **调整 PATH 环境变量：** 选择 **"Git from the command line and also from 3rd-party software"**（重要！）
   
   - ✅ **选择 HTTPS 传输后端：** 选择 "Use the OpenSSL library"
   
   - ✅ **配置行尾转换：** 选择 "Checkout Windows-style, commit Unix-style line endings"
   
   - ✅ **配置终端模拟器：** 选择 "Use Windows' default console window"
   
   - ✅ **其他选项：** 保持默认即可

3. **完成安装**，点击 "Install"

#### 步骤 3：验证安装

1. **关闭并重新打开 Cursor**（重要！让环境变量生效）

2. **打开新的终端**（`Ctrl + ``）

3. **测试 Git 是否安装成功：**
   ```bash
   git --version
   ```
   如果显示版本号（如 `git version 2.42.0`），说明安装成功！

4. **配置用户名和邮箱：**
   ```bash
   git config --global user.name "siri666942"
   git config --global user.email "你的邮箱@example.com"
   ```
   ⚠️ **注意：** 把 `你的邮箱@example.com` 替换成你的真实邮箱

5. **验证配置：**
   ```bash
   git config --global --list
   ```
   应该能看到你设置的用户名和邮箱

---

### 方法二：使用 Cursor 内置的 Git（临时方案）

如果 Cursor 已经内置了 Git，你可以通过 Cursor 的图形界面使用 Git，而不需要命令行：

#### 使用图形界面配置 Git

1. **打开设置：**
   - 按 `Ctrl + ,` 打开设置
   - 搜索 `git.path`

2. **或者直接在源代码管理面板配置：**
   - 点击左侧源代码管理图标（分支图标）
   - 如果提示配置 Git，按照提示操作

#### 使用图形界面提交代码

1. **查看更改：**
   - 点击左侧源代码管理图标
   - 会显示所有修改的文件

2. **提交更改：**
   - 在"消息"框中输入提交说明
   - 点击"提交"按钮（✓）

3. **配置用户信息（如果提示）：**
   - 在设置中搜索 `git`
   - 找到 `Git: User Name` 和 `Git: User Email`
   - 填入你的信息

---

### 方法三：手动添加 Git 到 PATH（如果已安装但找不到）

如果 Git 已经安装但命令行找不到，需要手动添加到 PATH：

#### 步骤 1：找到 Git 安装路径

通常 Git 安装在以下位置之一：
- `C:\Program Files\Git\cmd`
- `C:\Program Files (x86)\Git\cmd`
- `C:\Users\你的用户名\AppData\Local\Programs\Git\cmd`

#### 步骤 2：添加到 PATH 环境变量

1. **打开系统属性：**
   - 按 `Win + R`
   - 输入 `sysdm.cpl` 并回车
   - 或者：右键"此电脑" → "属性" → "高级系统设置"

2. **编辑环境变量：**
   - 点击"环境变量"按钮
   - 在"用户变量"或"系统变量"中找到 `Path`
   - 点击"编辑"

3. **添加 Git 路径：**
   - 点击"新建"
   - 输入 Git 的 `cmd` 文件夹路径（例如：`C:\Program Files\Git\cmd`）
   - 点击"确定"保存所有对话框

4. **重启 Cursor：**
   - 完全关闭 Cursor
   - 重新打开 Cursor
   - 打开新终端测试 `git --version`

---

## 🚀 快速安装脚本（高级用户）

如果你熟悉 PowerShell，可以使用以下命令快速检查：

```powershell
# 检查 Git 是否已安装
$gitPath = (Get-Command git -ErrorAction SilentlyContinue).Source
if ($gitPath) {
    Write-Host "Git 已安装: $gitPath"
} else {
    Write-Host "Git 未安装，请访问 https://git-scm.com/download/win 下载安装"
}
```

---

## 📝 安装后的配置步骤

安装完 Git 后，必须完成以下配置：

### 1. 配置用户信息（必须！）

```bash
git config --global user.name "siri666942"
git config --global user.email "你的邮箱@example.com"
```

### 2. 验证配置

```bash
git config --global --list
```

### 3. 测试 Git 功能

```bash
# 查看 Git 版本
git --version

# 查看当前目录状态
git status
```

---

## ⚠️ 常见问题

### Q1: 安装后还是找不到 git 命令？

**解决方法：**
1. 完全关闭并重新打开 Cursor
2. 打开新的终端窗口（不要用旧的）
3. 如果还不行，重启电脑

### Q2: 安装时没有选择添加到 PATH？

**解决方法：**
- 重新运行安装程序，选择"修复"或"修改"
- 或者使用方法三手动添加

### Q3: 如何卸载 Git？

**解决方法：**
1. 打开"控制面板" → "程序和功能"
2. 找到 "Git for Windows"
3. 点击"卸载"

### Q4: Cursor 能检测到 Git 但终端不能？

**解决方法：**
- Cursor 可能使用内置的 Git
- 建议使用方法一完整安装 Git for Windows
- 这样命令行和图形界面都能使用

---

## 🎯 推荐操作流程

1. ✅ **下载并安装 Git for Windows**（使用方法一）
2. ✅ **重启 Cursor**
3. ✅ **在终端中配置用户信息**
4. ✅ **验证配置是否成功**
5. ✅ **开始使用 Git！**

---

## 📚 下一步

安装配置完成后，查看 `Git入门教程.md` 学习如何使用 Git。

---

**现在，请按照"方法一"安装 Git for Windows，这是最可靠的解决方案！** 🚀
