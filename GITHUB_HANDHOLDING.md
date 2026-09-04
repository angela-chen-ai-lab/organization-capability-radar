# GitHub 上线陪跑清单｜给第一次发布开源项目的人

目标不是一次把项目做得“很像成熟开源软件”，而是让别人能看到 Demo、理解你要研究什么、知道怎样给出有用反馈。

## 先准备好这 6 项（我可以逐项帮你完成）

1. GitHub 账号：若还没有，到 [github.com](https://github.com) 注册并验证邮箱；不要把密码或验证码发给任何人。
2. 项目名：建议 `organization-capability-radar`，简洁、可理解、与 Demo 一致。
3. 公开范围：第一版建议设为 Public，因为目标就是邀请共创；其中只含虚构数据。
4. 许可证：建议 MIT License，允许其他人使用和修改，同时保留原作者与许可证声明。若你希望限制商业使用或另有顾虑，先暂停并选择许可证。
5. 仓库简介：`A research demonstrator for sensing organizational capability gaps from collaboration signals.`
6. 本地文件：当前 `organization-capability-radar-starter` 文件夹就是待发布内容。

## 第一次创建仓库（网页操作）

1. 登录 GitHub，右上角点击 **+** → **New repository**。
2. Repository name 填 `organization-capability-radar`。
3. Description 使用上面的英文简介，或留空以后再改。
4. 选择 **Public**。
5. 因为本地已经有 README，先不要勾选 GitHub 自动创建 README、`.gitignore` 或 License，避免第一次同步冲突。
6. 点击 **Create repository**。创建后停在 GitHub 显示的 “push an existing repository” 页面即可。

## 再把本地项目上传

推荐使用 GitHub Desktop，第一次比命令行更直观：

1. 安装并登录 [GitHub Desktop](https://desktop.github.com/)。
2. 点击 **File** → **Add local repository**，选择 `organization-capability-radar-starter` 文件夹。
3. 若它提示“不是 Git repository”，选择 **create a repository here**；名称填 `organization-capability-radar`。
4. 检查改动列表：应只包含本项目的 HTML、CSS、JS、Markdown 文档。若看到 `.env`、密码、真实聊天记录或任何私密资料，先取消，不要提交。
5. 在左下角 Summary 填：`Initial interactive demo and research specs`，点击 **Commit to main**。
6. 点击 **Publish repository**，确认公开范围是 Public，再发布。

## 部署可访问 Demo（GitHub Pages）

仓库发布后：

1. 打开仓库页 → **Settings** → 左侧 **Pages**。
2. 在 Build and deployment 的 Source 选择 **Deploy from a branch**。
3. Branch 选择 `main`，文件夹选择 `/(root)`，点击 **Save**。
4. 等待几分钟；页面会显示访问地址，通常形如 `https://你的用户名.github.io/organization-capability-radar/`。
5. 打开该网址，点击 **Play scenario**，确认页面能正常工作。
6. 将该网址补进仓库 README 的最上方。

## GitHub 上的共创入口

发布后先建 4 个 Issue（不是代码问题也可以）：

- `Scenario：请挑战这个案例的诊断`
- `Rule：能力单元应该怎样切分？`
- `Talent model：螺旋上升还是双通道？`
- `Feedback：Demo 中最不可信的一条 Agent 建议`

每个 Issue 写清：背景、你的具体问题、希望对方提供的材料、不要提交真实员工/客户/群聊信息的提示。

## 什么时候停下来问我

- 看到 GitHub 要求输入密码、验证码、Token、SSH key，或要授予第三方权限。
- 不确定某份文件能否公开。
- 想改变 License、删除仓库或把仓库从 Public 改为 Private。
- Pages 显示 404 或 Demo 的样式/互动失效。

这些步骤可以逐屏进行：你做到哪一页，就截屏或描述页面文字，我会告诉你下一次点击哪里。
