# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

gm-excel：基于 exceljs + file-saver + lodash 的浏览器端 Excel 导入/导出库（观麦配送单导出等场景）。无构建步骤——`package.json` 的 `main`/`module` 直接指向 `src/index.js`，`files: ["src"]` 把源码原样发布到 npm。**源码必须保持 ES module 且可直接被业务方 bundler 消费，不做转译打包。**

## 常用命令

```bash
yarn            # 安装依赖
yarn start      # 启动 Storybook 开发服务（唯一的开发/调试界面）
npx eslint src/ # 手动 lint（pre-commit 由 husky + lint-staged 自动执行）
```

- 没有构建、测试脚本；验证改动的方式是跑 Storybook，在 stories 里触发导出、打开生成的 xlsx 检查。
- 演示与配置样例：`src/excel.stories.js` 覆盖全部 API；`src/config/config.js`（V1 模板）、`src/config/config_v2.js`（V2 模板）是模板结构的权威参考，README 也指向它们。

### 发布（GitHub Actions 自动发版，见 `.github/workflows/release.yml`）

```bash
yarn release:patch   # bug 修复
yarn release:minor   # 新功能
yarn release:major   # 破坏性变更
```

- 正式版：命令 bump 版本 + 打 tag（如 `v1.0.5`）+ 推送，CI 校验 tag 与 package.json 一致且未发布过才 publish 到 npm。`npm version` 要求工作区干净。
- beta 版：Actions 页面手动 Run workflow（dist-tag 选 beta），CI 生成 `x.y.z-beta.<run_number>` 发 `beta` tag，不回写仓库。业务方 `yarn add gm-excel@beta` 验证。beta 失败不要 Re-run（版本号冲突），重新 Run workflow。

## 架构

### 公共 API（`src/index.js`）

| API | 用途 |
|---|---|
| `doImport(file)` | FileReader + ExcelJS 解析 xlsx 为 JSON 数组（公式取 result） |
| `doExport(sheets, options)` | 简单模板：JSON 数组直接生成表格 |
| `diyExport(sheets, options)` | V1 自定义模板：config 为 `{header, content, footer}` 对象 |
| `doExportV2(sheets, options)` | V2 自定义模板：config 为 `[{type, id, ...}]` 有序数组，更自由 |

每个 API 入口都有 `if (!ExcelJS) ExcelJS = window.ExcelJS` 兜底。所有导出最终经 `src/util.js` 的 `exportXlsx`（writeBuffer → FileSaver 下载，文件名过滤非法字符）。

### 两代模板引擎并存

- **V1**（`diyExport` → `src/core/diy.js`）：config 是单对象 `{header: {title, block}, content: [...], footer}`，一个 sheet 内所有单据共用。sheet 总列数由 `content` 中带 `decisiveColumn: true` 的 table 决定（`getSheetColumns`）。
- **V2**（`doExportV2` → `src/core/export.js`）：config 是有序数组，元素 `type` 为 `style`（全局 colWidth/rowHeight）、`block` 或 `table`，通过 `id` 与数据项匹配；总列数取所有 block 行/table 列的最大值（`getColumnLength`）。新需求优先改 V2。

### fileMergeRules（合单）分支

`options.fileMergeRules` 为真时走 `*MergerOrder` 变体（`exportCoreV2MergerOrder` / `diyToSheetCoreMergerOrder`）：语义从"一个模板 × N 份数据"变为 `configs[i]` 配 `sheetDatas[i]`——一张 sheet 上交错渲染多套模板的单据。两条路径逻辑高度相似但独立维护，改动需同步评估两边。

### 渲染层（`src/core/paint/`，自底向上）

- `cell.js` — 样式/边框/合并原语；`diyCustomToSheetMergeCells` 按 `size: [行, 列]` 自定义合并。
- `row.js` — block 行的三种 layout：`average`（字段均分）、`inOrder`（字段名:字段值，只合并值格，默认）、`all`（独占整行）。
- `block.js` — 组合行；`customer: true` 时走自定义合并路径。
- `table.js` — 表头 + 数据行；`disabledHeaderRow` 隐藏表头；性能开关 `options.fastTableStyle` 只遍历本 table 的行范围设置样式（默认路径按列扫全表，大 sheet 下是 O(表数×列数×全表行数)）。

### sheet 级后处理（`src/core/util.js`，渲染完成后统一执行）

- `colWidth`/`rowHeight` 统一设置列宽行高；`options.autoColWidth` 按内容自适应列宽（CJK 按 2 宽度、合并单元格按跨列均摊、单遍扫描）——MergerOrder 路径下 autoColWidth 必须放循环外只执行一次。
- 同 sheet 多单据之间：config 带 `fill` 时用填充行分隔（`setSheetRowFill`），否则空行。

## 约定

- 代码注释、commit 描述用中文；commit 遵循 `feat: 【<TAPD单号> 需求名】描述`，分支名 `feature/<TAPD单号>_<英文描述>`。
- Prettier：无分号、单引号。ESLint 用 `plugin:gmfe/recommended`。
- 运行时依赖仅 exceljs / file-saver / lodash（同时是 peerDependencies），新功能不要引入其它运行时依赖。
