# 🌌 Binance 2026 Luminous Almanac (光之年鉴)

> "在加密宇宙中，时间凝结为光。"

**Repository**: [https://github.com/xueqiu2026/binance-2026-almanac](https://github.com/xueqiu2026/binance-2026-almanac)
**在线演示**: [https://xueqiu2026.github.io/binance-2026-almanac--v1.2.0/](https://xueqiu2026.github.io/binance-2026-almanac--v1.2.0/)

一本基于 **新中式未来主义 (Neo-Chinese Futurism)** 美学与 **瑞士国际主义 (Swiss International Style)** 排版的高保真数字年鉴，将每日的加密历史凝练为璀璨的水晶卡片。

## 🌟 设计理念 (Project Philosophy)

本项目将 2026 年的每一天构想为悬浮在加密宇宙虚空中的“光之水晶”。

- **视觉风格**: 玻璃拟态 (Glassmorphism)、光线追踪特效、官方币安黄 (#F0B90B)。
- **核心概念**: 确定性历史 (Deterministic History)。每一个日期都承载着区块链世界独一无二的记忆或知识。

## 📸 影像冻结协议 (Project Frozen Light)

本项目搭载了代号为 **Frozen Light** 的高性能双引擎捕捉系统，用于生成 100% 还原度的视觉资产。

### 1. 光学克隆 (Optical Clone / 单次截图)
- **触发方式**: 点击右下角“控制胶囊”中的 **相机图标**。
- **引擎**: 服务端 Puppeteer 渲染 (100% 同步光效与混合模式)。
- **输出**: 自动下载一张 4K 分辨率的 PNG 设置到您的设备。

### 2. 批量制书引擎 (Batch Book Generator / Engine B)
- **触发方式**: 悬停在相机图标上 -> 点击出现的 **齿轮 (设置)** -> 点击 **"启动 (START)"**。
- **功能**: 全自动遍历 1月1日 到 12月31日，为每一天生成印刷级的 4K 截图。
- **输出**: 保存至服务器端的 `dist/frozen_light/raw/` 目录。适用于实体书印刷或建立数字档案。
- **注意**: 此过程运行在 Node.js 服务端，生成完整一年的年鉴可能需要约 15-20 分钟。

## 🛠 共建指南 (Contribution Guide)

我们邀请社区共同书写加密历史。内容引擎设计为 **开源友好 (Open Source Friendly)**。

数据源位于: `src/data/staticEvents.ts`。

分为两部分：

### 1. 历史节点 (Historical Events)
真实世界的里程碑（如比特币创世区块、币安成立、以太坊合并）。
- **位置**: `HISTORICAL_EVENTS` 对象。
- **Key 格式**: `"月索引-日期"` (例如 `"0-3"` 代表 1月3日, `"11-25"` 代表 12月25日)。

### 2. 知识库 (Knowledge Base)
高质量的加密概念，用于填充没有特定历史事件的日子。
- **位置**: `KNOWLEDGE_BASE` 数组。
- **格式**: 添加包含 `tag`, `title`, `description` 的新对象。

### 工作流 (Workflow)
1. Fork 本仓库。
2. 编辑 `src/data/staticEvents.ts`。
3. 把您的事件按照 `StaticEventContent` 接口格式添加进去。
4. 提交 Pull Request。

## 📦 安装与运行 (Installation & Run)

本项目使用 **Vite** + **React**。

```bash
# 1. 克隆仓库
git clone https://github.com/ls569333469/binance-2026-almanac.git

# 2. 安装依赖
npm install

# 3. 运行开发服务器
npm run dev
```

## 🎨 技术栈 (Tech Stack)

- **React 19**: UI 渲染
- **TailwindCSS**: 样式引擎
- **Vite**: 构建工具
- **SVG**: 矢量图形 (官方币安 Logo 路径)
- **TypeScript**: 类型安全
- **Puppeteer**: 无头浏览器渲染引擎 (用于服务端截图)

## 📄 许可证 (License)

MIT License.
