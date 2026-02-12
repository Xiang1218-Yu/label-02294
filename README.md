# 掏宝购物平台

## How to Run

### Docker 方式运行

```bash
# 构建并启动
docker-compose up -d --build

# 访问地址
http://localhost:8081
```

### 本地开发运行

```bash
# 进入项目目录
cd frontend-user

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问地址
http://localhost:8081
```

## Services

| 服务名称 | 端口 | 说明 |
|---------|------|------|
| frontend-user | 8081 | 掏宝用户端首页 |

## 测试账号

| 用户名 | 密码 |
|--------|------|
| admin | 123456 |
| user | 123456 |

## 题目内容

仿照淘宝的PC端首页，帮我设计一个名为“掏宝”的购物平台首页，要求有简单的功能与交互行为（如：用户登录与用户信息展示、搜索栏、轮播器、推荐商品的商品信息展示）。页面跳转用Vue Router，组件库用Element Plus

## 项目介绍

本项目是一个基于 Vue 3 + Vite + Element Plus 构建的电商平台首页，模拟淘宝PC端的首页、商品搜索、商品详情功能

### 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Vite - 下一代前端构建工具
- Element Plus - Vue 3 组件库
- Pinia - Vue 状态管理
- Vue Router - 路由管理
- SCSS - CSS 预处理器

### 功能特性

- 用户登录/登出功能
- 用户信息展示
- 商品搜索栏
- 首页轮播图展示
- 推荐商品展示
- 商品详情页

### 项目结构

```
├── README.md                          # 项目说明文档
├── docker-compose.yml                 # Docker Compose 配置
├── .gitignore                         # Git 忽略文件
└── frontend-user/                     # 用户端项目
    ├── Dockerfile                     # Docker 构建文件
    ├── nginx.conf                     # Nginx 配置
    ├── package.json                   # 项目依赖
    ├── vite.config.js                 # Vite 配置
    ├── index.html                     # HTML 入口
    ├── public/                        # 静态资源
    └── src/                           # 源代码
        ├── main.js                    # 应用入口
        ├── App.vue                    # 根组件
        ├── api/                       # API 接口
        ├── components/                # 公共组件
        ├── layouts/                   # 布局组件
        ├── router/                    # 路由配置
        ├── stores/                    # Pinia 状态管理
        ├── styles/                    # 全局样式
        └── views/                     # 页面视图
            ├── Home.vue               # 首页
            ├── Login.vue              # 登录页
            └── Product.vue            # 商品详情页
```
