# 组件开发规范

X 系列组件位于 `src/components/x/`，参考 FrontCore 的组织方式并适配 shadcn-vue 生态。

## 目录规范：四件套

每个组件一个目录，固定四个文件：

```
src/components/x/XButton/
├── index.ts       # 入口：默认导出组件 + 具名导出常量/类型
├── index.vue      # 主实现
├── constant.ts    # 默认值常量 + 类型定义（大写下划线命名）
└── api.md         # 文档唯一来源（驱动文档站生成）
```

`index.ts` 模式：

```ts
import XButton from './index.vue'

export default XButton
export { X_BUTTON_DEFAULT_ICON_SIZE } from './constant'
```

## 编写约定

1. **透传**：不引入 FrontCore 的 `NProps` prop-bag 约定；shadcn-vue 组件天然支持 attrs 透传。需要拦截时 `defineOptions({ inheritAttrs: false })` 并显式处理（参考 XInput / XSelect）。
2. **默认值**：写在 `constant.ts` 导出常量，props 默认值引用常量而非硬编码字面量。
3. **v-model**：`update:modelValue` emit + `change` 事件成对出现（参考 XSelect / XRadioBox / XSegmented）。
4. **样式**：优先使用 shadcn 语义令牌（`bg-primary`、`text-muted-foreground`、`border-border`），保证明暗模式与主题色预设自动生效；确需原始色值时用 CSS 变量 `var(--primary)`。
5. **Tailwind 动态类**：禁止 `` `text-${size}` `` 动态拼接，用完整类名映射表（参考 XTitle 的 `sizeMap`）。
6. **图标**：业务代码统一使用 `XIcon`，禁止直接 `import { Xxx } from '@lucide/vue'`。
7. **中文注释**：props / 关键逻辑写中文注释，说明「为什么」而不是重复「是什么」。

## api.md 格式

结构固定（文档站 sync 脚本按此解析，`## Props` 下的表格是契约）：

```markdown
# 组件名

一段简介。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| size | `string` | `'base'` | 字号 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| change | `(value: string)` | 值变化时触发 |

## Slots

| 名称 | 说明 |
|------|------|
| default | 内容 |

## 使用示例

\`\`\`vue
<XButton>确认</XButton>
\`\`\`
```

## 同步到文档站

修改 `api.md` 后运行：

```sh
pnpm run docs:sync
```

脚本会重新生成 `docs/reference/x/*.md`、侧边栏 `catalog.json` 与索引页。生成物不提交 Git。

## 组件演示

文档站的交互演示运行在独立 iframe SPA（`docs/demo-app/`）中，避免 Tailwind preflight 污染文档页样式。为新组件添加演示：

1. 在 `docs/demo-app/demos/` 新建 `XxxDemo.vue`
2. 在 `docs/demo-app/registry.ts` 注册（key 与组件目录名一致）
3. 在组件 `api.md` 的合适位置插入 `<ComponentDemo name="Xxx" />`

演示构建：`pnpm run docs:demos`（已包含在 `docs:build` 中）。
