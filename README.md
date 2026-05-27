# 德州扑克资料站

一站式德州扑克学习平台，覆盖从零基础到进阶玩家的全部知识需求。7 大模块、交互式演示、SVG 图标、深色赌桌主题。

## 在线访问

https://macbooooo-xin.github.io/texas-holdem-guide/

## 功能模块

| 模块 | 路由 | 说明 |
|------|------|------|
| 入门指南 | `#/beginner` | 5 节渐进式课程，从游戏规则到完整牌局演示 |
| 牌型大全 | `#/hands` | 10 种牌型详解、对比示例、概率数据和常见误区 |
| 起手牌表 | `#/starthand` | 13×13 矩阵，8 个标准 9 人桌位置范围分析 |
| 位置策略 | `#/position` | 交互式座位图，点击查看各位置策略详情 |
| 概率赔率 | `#/odds` | Outs 计算器、底池赔率分析、概率速查表、四二法则 |
| 术语词典 | `#/glossary` | 88 个扑克术语中英对照，支持搜索和分类筛选 |
| 知识测验 | `#/quiz` | 35 道选择题，即时判分、答案解析、历史最佳 |

## 技术实现

- **框架**：React 18（CDN 加载） + Babel standalone（JSX 客户端转译）
- **样式**：纯 CSS（~2900 行），CSS 自定义属性设计令牌体系
- **路由**：自实现 Hash 路由（~30 行）
- **图标**：手绘 SVG 图标组件（17 个），替代 emoji
- **部署**：纯静态文件，GitHub Pages 直接部署，零构建步骤

## 项目结构

```
texas-holdem-guide/
├── index.html                  # 入口页面（SEO meta + noscript 降级）
├── app.js                      # App Shell（Hash 路由 + 模块加载）
├── styles.css                  # 全局样式（CSS 变量 + 表面层级体系）
├── components/                 # 共享组件
│   ├── PlayingCard.js          # CSS 扑克牌渲染（♠♥♦♣）
│   ├── PokerTable.js           # 交互式仿真扑克桌
│   ├── NavBar.js               # 顶部导航栏（7 模块入口）
│   └── Icons.js                # SVG 图标组件库（17 个）
├── modules/                    # 功能模块（每个独立加载）
│   ├── beginner.js             # 入门指南
│   ├── hands.js                # 牌型大全
│   ├── starting-hands.js       # 起手牌表
│   ├── position.js             # 位置策略
│   ├── odds.js                 # 概率赔率
│   ├── glossary.js             # 术语词典
│   └── quiz.js                 # 知识测验
├── data/                       # 数据文件
│   ├── glossary.js             # 88 条术语数据
│   └── quiz-questions.js       # 35 道测验题库
├── sitemap.xml                 # SEO 站点地图
├── robots.txt                  # 搜索引擎爬虫规则
└── README.md
```

## 设计系统

### 色彩

| 令牌 | 色值 | 用途 |
|------|------|------|
| `--felt-dark` | `#1a3a2a` | 全局背景（赌桌绒布色） |
| `--gold` | `#c9a84c` | 主强调色 |
| `--text-primary` | `#f0e6d3` | 正文（暖白） |
| `--text-secondary` | `#b8a890` | 次要文字 |
| `--text-muted` | `#a09078` | 辅助文字（WCAG AA 通过） |

### 字体

- **Display**：Noto Serif SC（标题、导航）
- **Body**：Noto Sans SC（正文、组件）

### 表面层级

| 层级 | 变量 | 适用场景 |
|------|------|---------|
| Elevated | `--surface-elevated` | 重要卡片、测验卡片 |
| Base | `--surface-base` | 常规卡片、列表项 |
| Inset | `--surface-inset` | 页脚、内凹区域 |

## SEO

- 每个模块独立 `<title>` + `<meta description>` 动态切换
- Open Graph / Twitter Card 完整标签
- JSON-LD 结构化数据（WebSite + EducationalResource）
- `<noscript>` 降级内容（含完整模块链接）
- sitemap.xml + robots.txt
- 导航 `aria-label` + `aria-current`

## 本地运行

```bash
# 方式一：Python
python -m http.server 3000 --directory texas-holdem-guide

# 方式二：npx serve
npx serve -p 3000 texas-holdem-guide

# 浏览器打开
open http://localhost:3000
```

## License

MIT · 仅供学习参考
