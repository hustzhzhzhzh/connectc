#### :o:开发环境

- 微信开发者工具 Stable 1.06.2412050

- Node.js 16.x

- MySQL 8.0+  MySQL 8.0+ 版本

- 使用navicat来连接数据库，进行可视化阅读，方便调试

#### :o:安装与运行说明

- 1.由于未发布该微信小程序，所以需要配置开发环境来运行调试
- 2.微信开发者工具
- 新建项目目录选中.\connectc\frontend,测试号，不使用云开发，进入后在右上角点击详情，本地设置，选中不校验合法域名、web-view(业务域名)......
- 3.数据库初始化
-  在桌面开始菜单搜索 MySQL 8.0 Command Line Client，输入密码进入数据库，
-  运行source ..\connectc\database\init.sql（补全绝对路径）
- 4.运行后端
- 在 backend 文件夹内按住 Shift+右键 → 选择“在此处打开Powershell窗口”
- 安装依赖包：npm install express mysql2
- 启动服务器：node app.js

#### :o:测试说明（按照实验报告指导书测试用例）

- 1.登录功能
- 2.首页时间进度功能
- 3.大使馆访问http网页功能
- 4.工具-留学计算器功能
- 5.社区发帖及显示功能
- 6.自由测试
