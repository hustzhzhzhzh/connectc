#### :o:项目简介

- HUST2025辅修软件工程课程设计
- 基于微信小程序实现的ConnectC-面向海外留学生的学习-生活一体化交流平台

#### :o:人员分工
| 人员  | 主要负责任务 | 
|-----|------------|
| 张恒 | 小程序的开发 | 
| 祁钰凯  | 报告撰写  | 

#### :o:开发环境

- 微信开发者工具 Stable 1.06.2412050

- Node.js 16.x

- MySQL 8.0+  MySQL 8.0+ 版本

#### :o:文件逻辑  
> 
─connectc
    ├─  backend              # 小程序后端-node.js
    ├─  databade             # 数据库-mysql
    └─  frontend             # 前端-微信开发者工具
        ├─ app.js               # 小程序入口文件
        ├─ app.json             # 全局配置
        ├─ app.wxss             # 全局样式
        ├─ pages/
        │   ├── auth/            # 授权登录
        │   ├── role/            # 角色切换
        │   ├── index/           # 首页
        │   ├── embassy/         # 大使馆服务
        │   ├── community/       # 社区功能
        │   ├── tools/           # 实用工具
        │   └── profile/         # 个人中心
        └─ static/              # 静态资源
            ├─ 1.png           # 导航栏图标
            ├─ 2.png           # 页面图片
            ├─....
            └─ logo.png         # 应用logo
                
<a href="#top">返回顶部</a>
