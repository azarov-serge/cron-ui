# cron-ui

用于创建和校验五段 cron 表达式（分、时、日、月、周 — 无秒）的演示应用与 UI 库。

**演示：** https://azarov-serge.github.io/cron-ui/  
**版本：** `1.0.7`（显示在应用标题栏徽标旁）

**语言：** [English](README.md) · [Русский](README.ru.md) · 中文（本文件）· [हिन्दी](README.hi.md)

## 组件

| 组件 | 路径 |
| ---- | ---- |
| `Header` | `src/shared/components/Header/` — 徽标、版本、语言菜单（RU / EN / ZH / HI）、主题切换 |
| `CronExpressionField` | `src/features/cron/components/CronFields/` — cron 表达式与复制 |
| `CronDescriptionField` | `src/features/cron/components/CronFields/` — 可读描述 |
| `CronEditor` | `src/features/cron/components/CronEditor/` |
| `CronChecker` | `src/features/cron/components/CronChecker/` |
| `CronPage` | `src/features/cron/pages/CronPage.tsx` |
| `TimePicker` | `src/shared/components/TimePicker/` |
| 规格 | [`src/features/cron/components/CronEditor/SRS.md`](src/features/cron/components/CronEditor/SRS.md) |

## 项目结构

```text
src/
├── App.tsx
├── features/cron/
│   ├── components/
│   │   ├── CronEditor/
│   │   ├── CronChecker/
│   │   └── CronFields/       # CronExpressionField, CronDescriptionField
│   ├── hooks/
│   ├── pages/CronPage.tsx
│   └── utils/
└── shared/
    ├── components/Header/, TimePicker/
    ├── constants/layout.ts   # LAYOUT_MAX_WIDTH_PX = 1920
    ├── i18n/                 # ru, en, zh, hi
    └── providers/            # AppThemeProvider, LocaleProvider
```

路径别名：`@features/*`、`@shared/*`。

## 快速开始

```bash
npm install
npm run dev      # https://localhost:5173/（自签名 HTTPS）
npm run build
npm run preview  # 本地测试生产构建
```

## 部署

GitHub Actions（`.github/workflows/deploy.yml`）在 push 到 `main` 时部署。  
`vite.config.ts`：生产环境 `base: '/cron-ui/'`，开发环境 `'/'`。

**GitHub Pages（一次性设置）：** Settings → Pages → Source → **GitHub Actions**。

## 版本管理

| 来源 | 用途 |
| ---- | ---- |
| `package.json` → `version` | 应用唯一版本号 |
| `CHANGELOG.md` | 可选发布说明 |

## 依赖

- `@admiral-ds/react-ui`、`@admiral-ds/icons` — UI
- `@ant-design/icons` — `CronPage` 编辑图标
- `cronstrue` — 计划描述（含 Hindi 自定义构建器）
- `styled-components`

## CronPage（演示）

两个标签页，状态与 URL 同步（`?cron=0+9+*+*+1`、`?tab=checker`）：

| 标签 | URL | 内容 |
| ---- | --- | ---- |
| Cron 构造器 | _(默认)_ | cron 与描述字段、编辑器参数、`CronEditor` |
| Cron 校验 | `checker` | `CronChecker` |

- **cron** 与**描述**字段显示当前计划，不会自动更改。
- **修改 cron** 打开编辑器（桌面端为模态框，移动端全屏）。
- **复制** — 移动端带本地化标签的 `TextButton`。
- 语言（`cron-ui-locale`）与主题（`cron-ui-theme`）保存在 `localStorage`；首次访问时尝试使用浏览器语言。

## CronEditor

属性：`cron`、`onSubmit`、`options`（`CronOptions`）。  
表单 id：`cron-schedule-form` — 外部提交使用 `form="cron-schedule-form"`。

`CronOptions` 控制可见区块、`minuteStep`、`weeklyWeekNumbers` 及 `requires` 校验。选项仅用于 UI，不发送到后端。

输出：`cron.toExpression()` — 供 API 使用的五段字符串。

### 后端约定

| 字段 | 类型 | 说明 |
| ---- | ---- | ---- |
| `minute` | `string` | 0–59、`*`、`*/N` |
| `hour` | `string` | 0–23、`*`、`*/N` |
| `day_of_month` | `string \| null` | 1–31 或 `null` → `*` |
| `month_of_year` | `string \| null` | 1–12 或 `null` → `*` |
| `day_of_week` | `string \| null` | 0–6、列表、`日#周` 或 `null` → `*` |

解析：`Cron.fromString(expression)`。编辑器中无效输入回退为 `0 9 * * *`；`CronChecker` 中显示解析错误。

推荐 API 结构：

```ts
type ScheduleEntity = {
  id: string;
  name: string;
  enabled: boolean;
  cron_expression: string; // cron.toExpression()
};
```

`CronPage` 仅在 URL 中保存 `cron` — 不保存 `name`、`enabled` 或 `CronOptions`。

### CronOptions（默认值）

| 选项 | 默认 | 效果 |
| ---- | ---- | ---- |
| `scheduleTypes` | `recurring`、`one-time` | 仅一项时隐藏计划类型区块 |
| `occursFrequencies` | `daily`、`weekly`、`monthly` | 仅一项时隐藏频率选择 |
| `dailyFrequencies` | `once`、`every` | 仅一项时隐藏每日频率单选 |
| `minuteStep` | `1` | 时间字段与「每 N 分钟」的步长 |
| `weeklyWeekNumbers` | `false` | 周模式下月份周次复选框（1–5） |
| `requires` | `[]` | 必填：`weeklyWeekDays`、`weeklyWeekNumbers` |

允许的 `minuteStep`：`1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30`。

### UI → cron 示例

| 设置 | 表达式 |
| ---- | ------ |
| 每天 09:00 | `0 9 * * *` |
| 每周一 09:00 | `0 9 * * 1` |
| 每周一，第 1 周 | `0 9 * * 1#1` |
| 每月 15 日 | `0 9 15 * *` |
| 每 10 分钟 | `*/10 * * * *` |
| 每 2 小时 | `0 */2 * * *` |
| 一次性 3 月 25 日 14:30 | `30 14 25 3 *` |

星期：0 = 日，1 = 一，…，6 = 六。

## CronChecker

粘贴 cron 表达式 → 字段分解、可读描述、编辑器解释、校验错误。

## 集成示例

```tsx
import {
  CronEditor,
  type CronOptions,
} from '@features/cron/components/CronEditor';
import { Cron } from '@features/cron/components/CronEditor/models/cron';

<CronEditor
  cron={task.cron}
  options={{
    scheduleTypes: ['recurring'],
    occursFrequencies: ['daily', 'weekly'],
    dailyFrequencies: ['once'],
    minuteStep: 5,
  }}
  onSubmit={saveCron}
/>;
```
