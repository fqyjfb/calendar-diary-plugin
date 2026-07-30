<div align="center">
  <h1>日历日记本插件 - ToolBox</h1>
  <p><em>ToolBox 的日历与事件管理工具，支持多视图、拖拽、多用户等功能。</em></p>

  [![ToolBox 生态](https://img.shields.io/badge/ToolBox-生态-059669?style=for-the-badge&logo=electron&logoColor=white)](https://github.com/fqyjfb/toolbox)
  [![许可证](https://img.shields.io/badge/许可证-MIT-green?style=for-the-badge)](LICENSE)
</div>

---

ToolBox 是一个多功能平台，旨在托管丰富的插件生态系统，将强大的工具无缝集成到您的日常工作中。作为该生态系统的扩展，**日历日记本插件**为您提供了一个功能强大的日历与事件管理工具，支持多种视图、拖拽操作、多用户筛选等功能。

## 什么是日历日记本插件？

日历日记本插件是 ToolBox 的事件管理工具，基于 Vite + React + TypeScript 构建。插件提供直观的用户界面，支持月、周、日、年、议程等多种视图，支持事件的创建、编辑、拖拽调整，以及多用户筛选和主题切换。

## 主要功能

- **多视图模式：** 支持月视图、周视图、日视图、年视图和议程视图，满足不同场景需求。
- **事件管理：** 创建、编辑、删除事件，支持标题、描述、颜色、时间等属性。
- **拖拽操作：** 通过拖拽轻松调整事件的时间和日期，支持跨日移动。
- **多用户支持：** 按用户筛选事件，查看所有人的事件或单独用户的事件。
- **自定义显示：** 三种徽章样式（圆点、彩色、混合），可调节工作时间和可见时间范围。
- **实时指示：** 显示当前时间指示器和正在进行的事件高亮。
- **国际化：** 支持中文、英文、韩文、日文等多种语言。
- **暗色模式：** 完整支持亮色/暗色主题切换。

## 配置与使用

1. **安装：** 从 ToolBox 插件商店安装 `日历日记本` 插件。
2. **选择视图：** 点击顶部导航切换月、周、日、年或议程视图。
3. **添加事件：** 点击日期单元格或时间槽，打开事件创建对话框。
4. **编辑事件：** 点击已有事件卡片，查看详情或进行编辑。
5. **拖拽调整：** 在周视图和日视图中，拖拽事件可调整时间；在月视图中，拖拽事件可跨日移动。
6. **筛选用户：** 使用顶部的用户下拉框，按用户筛选事件。
7. **切换主题：** 点击主题切换按钮，在亮色和暗色模式间切换。


## 技术栈

- **构建工具：** Vite 5
- **框架：** React 19
- **语言：** TypeScript
- **路由：** TanStack Router
- **状态管理：** Zustand + TanStack Query
- **样式：** Tailwind CSS v3
- **日期处理：** date-fns
- **UI 组件：** Radix UI
- **拖拽：** react-dnd
- **表单处理：** React Hook Form + Zod
- **国际化：** react-i18next

---

## 插件开发

本插件遵循 ToolBox 插件开发规范。更多详情请参阅：
- [插件开发规范](https://github.com/fqyjfb/toolbox-plugins-registry/blob/main/docs/plugin-development-guide.md)

## 构建说明

```bash
# 安装依赖
npm install

# 构建插件（输出 dist/index.js）
node build.mjs

# 开发模式
npm run dev
```

---

## 许可证

MIT
