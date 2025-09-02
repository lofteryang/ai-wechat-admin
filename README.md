# 🤖 AI-WeChat-Mater-智能微信助手平台

# 📝 项目说明

> 开源智能微信助手平台，将 AI 能力无缝融入微信生态，实现自动化消息处理与智能交互

1、大模型接口 来自：[原能引擎，大模型中转站不掺水-真稳定](https://api.evopower.net) \- 稳定可靠，实测 gemini 模型表现优异 **[加入 TG 交流群](https://t.me/evopower_ai)**

2、核心依赖服务 [WechatPadPro](https://github.com/WeChatPadPro/WeChatPadPro) 请先安装此服务

# ✨ 主要功能

### 🤝 多账号统一管理

- 支持多微信账号同时在线与管理
- 统一的授权与权限控制系统
- 账号状态实时监控与告警

### 🧠 智能 AI 对话引擎

- 多家大模型 API，支持灵活切换
- **特别推荐：[原能引擎 - 大模型中转站](https://api.evopower.net/)** - 稳定可靠，实测 gemini 模型表现优异
- 自定义提示词与上下文记忆功能
- 多轮对话与场景化交互

### ⏰ 自动化任务处理

- 定时消息发送与事件提醒
- 智能消息过滤与优先级处理
- 自动化好友管理与群组操作

### 📊 全方位监控分析

- 消息记录与交互数据分析
- 用户行为模式识别
- 性能指标与使用统计

## 🚀 应用场景

### 🎓 智能学习伴侣

- **线上督促学习老师** - 定期提醒学习计划，检查进度
- **智能答疑助手** - 随时解答学习问题，提供参考资料

### 💪 AI 健身教练

**线上 AI 健身教练（配合多模态 AI 以及相关）**

- **个性化训练计划** - 根据用户情况制定健身方案
- **动作指导与纠正** - 通过多模态 AI 分析训练动作
- **进度跟踪与激励** - 记录训练数据，提供正向反馈

### 📈 智能营销平台

**线上营销智能体、自动加微信、自动发消息、自动群发、等功能。（需二次开发）**

- **自动客户开发** - 智能筛选目标客户，自动添加微信
- **个性化消息推送** - 根据用户画像发送定制内容
- **群发管理与优化** - 高效管理群发任务，提升转化率
- **营销效果分析** - 跟踪消息打开率与转化数据

### 👥 个人事务助理

- **日程管理与提醒** - 重要事件自动提醒
- **信息收集与整理** - 自动归类重要消息与文件
- **智能回复与代答** - 根据场景自动生成回复内容

#### 已实现功能

- 多微信账号管理与授权
- AI 智能聊天与自动回复（支持自定义 prompt、历史消息上下文）
- 定时自动发送微信消息以及处理微信事物
- WebSocket 实时消息推送与接收
- 消息记录、日志与统计分析
- 好友/群管理、备注、标签等

#### 待实现功能

- 数据库优化

- 图片处理
- 语音、视频处理
- 专属模型训练，自动加好友，多 ai 角色多模型
- event 定期总结
- 群聊接入
- wechatpadpro 更多功能接入

# 📚 运行与部署

本项目分为 API 端和 Admin 端

**[AI-Wechat-Api](https://github.com/lofteryang/ai-wechat-api)**

**[AI-Wechat-Admini](https://github.com/lofteryang/ai-wechat-admin)**

## 1.API 端

#### 1.环境要求

- Node.js >= 16
- MySQL >= 5.7
- [ThinkJS](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html)
- 依赖包见 package.json

安装：`npm install `

运行：`npm run start`

#### 2.必要配置

`/src/config.js` ：hostUrl：微信模拟器的地址

`/adapter/adapter.js` mysql：数据库信息

数据库配置 ai_system

### 核心配置项

数据库：ai_system

| 配置项          | 说明             | 示例值                                         |
| :-------------- | :--------------- | :--------------------------------------------- |
| `aiHost`        | AI 服务地址      | `https://api.evopower.net/v1/chat/completions` |
| `aiApiKey`      | API 密钥         | `sk-xxxxxxxxxxxxxxxx`                          |
| `aiChatModel`   | 对话模型         | `gemini-2.5-pro`                               |
| `hisMsgDay`     | 历史消息保留天数 | `7`                                            |
| `to_noti_wxid`  | 管理员通知 ID    | `wxid_admin`                                   |
| `from_noti_key` | 消息发送方 ID    | `wxid_sender`                                  |

### 微信配置

确保已安装并配置 [WechatPadPro](https://github.com/WeChatPadPro/WeChatPadPro) 服务，并在配置中正确设置连接地址。

#### 3.相关接口

- `GET /account/allList` 获取所有微信账号
- `POST /account/getAIReply` 获取 AI 回复
- `GET /friends/list` 获取好友列表
- `POST /wechat/sendTextMessage` 发送微信消息
- ...参考/controller 下文件

#### 4.部署与运维

- 推荐使用 [PM2](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html) 进行进程管理
- Nginx 反向代理配置见 [nginx.conf](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html)
- 日志文件位于 `logs/` 目录

## 2. Admin 管理端

AI WeChat Admin 是一个基于 Vue 2 和 Element UI 的微信管理后台，支持多微信账号管理、好友管理、AI 日志、系统参数配置等功能。适用于企业或个人对微信账号的集中管理和数据分析。

## 特性

- 多微信账号统一管理
- 好友信息管理与备注
- AI 聊天日志与推理过程可视化
- 角色与权限配置
- 系统参数自定义
- 数据看板与趋势图表
- 管理员账号管理
- 支持 Element UI 组件库
- 响应式布局，适配主流浏览器

## 快速开始

### 克隆项目

```sh
git clone https://github.com/lofteryang/ai-wechat-admin.git
cd ai-wechat-admin
```

### 安装依赖

```sh
yarn install
# 或者
npm install
```

### 本地开发

```sh
yarn serve
# 或者
npm run serve
```

### 构建生产环境

```sh
yarn build
# 或者
npm run build
```

### 代码检查

```sh
yarn lint
# 或者
npm run lint
```

## 目录结构

```
├── public/                 # 静态资源
├── src/
│   ├── assets/             # 图片等资源
│   ├── components/         # 业务组件
│   ├── config/             # 配置文件
│   ├── router/             # 路由配置
│   ├── store/              # Vuex 状态管理
│   ├── styles/             # 样式文件
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── package.json
└── README.md
```

## 接口配置

请在 `src/config/api.js` 中配置后端 API 地址：

```js
const rootUrl = 'http://your-api-server:port'
const api = { rootUrl }
export default api
```

## 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 新建分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -am 'Add new feature'`)
4. 推送分支 (`git push origin feature/xxx`)
5. 新建 Pull Request

# 重要说明

1、本项目仅用于研究学习

2、根据[《生成式人工智能服务管理暂行办法》](http://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm)的要求，请勿对中国地区公众提供一切未经备案的生成式人工智能服务。

# 👥 项目作者

<table> <tr> <td align="center"> <a href="https://github.com/lofteryang"> <img src="https://avatars.githubusercontent.com/u/11828110?s=100&v=4" width="100px;" alt="lofteryang" style="border-radius: 50%;"/> <br /> <sub><b>lofteryang</b></sub> </a> </td> <td align="center"> <a href="https://github.com/xiaofute"> <img src="https://avatars.githubusercontent.com/u/28945380?v=4" width="100px;" alt="xiaofute" style="border-radius: 50%;"/> <br /> <sub><b>xiaofute</b></sub> </a> </td> </tr> </table>
