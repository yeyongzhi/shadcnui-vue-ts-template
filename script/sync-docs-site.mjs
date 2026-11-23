/**
 * 组件文档同步脚本：
 * 扫描 src/components/x/**\/api.md，生成
 * 1. docs/reference/x/*.md        组件 API 页面（使用示例前置，`<` 转义防 Vue 编译）
 * 2. docs/.vitepress/generated/catalog.json  侧边栏数据
 * 3. docs/reference/index.md      分组索引页
 *
 * 生成物不提交 Git；新增 / 修改组件的 api.md 后运行 `pnpm run docs:sync`。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const GROUPS = [
  { key: 'x', title: 'X 组件', source: path.join(root, 'src/components/x') },
]

const referenceDir = path.join(root, 'docs/reference')
const generatedDir = path.join(root, 'docs/.vitepress/generated')

/** 把「使用示例」类章节移到 Props 等章节之前 */
function examplesFirst(md) {
  const headingPattern = /^## .+$/gm
  const headings = []
  let match
  while ((match = headingPattern.exec(md)) !== null) {
    headings.push({ title: match[0].replace(/^##\s*/, '').trim(), index: match.index })
  }
  if (headings.length === 0) return md

  // 切分章节
  const sections = headings.map((h, i) => ({
    title: h.title,
    content: md.slice(h.index, i + 1 < headings.length ? headings[i + 1].index : md.length),
  }))

  const isExample = t => /示例|用法|基础用法|快速开始/.test(t)
  const examples = sections.filter(s => isExample(s.title))
  const rest = sections.filter(s => !isExample(s.title))

  // 简介段落（第一个 ## 之前的内容）
  const introEnd = headings[0].index
  const intro = md.slice(0, introEnd)

  return intro + examples.map(s => s.content).join('\n') + rest.map(s => s.content).join('\n')
}

/** 代码围栏之外把 `<` 转义为 `&lt;`，防止 Vue 模板编译报错 */
function literalMarkdown(md) {
  const parts = md.split(/(```[\s\S]*?```)/g)
  return parts
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/</g, '&lt;')))
    .join('')
}

function collectApiFiles(sourceDir, nonRecursive = false) {
  const results = []
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (!nonRecursive) walk(full)
        continue
      }
      if (entry.name === 'api.md') results.push(full)
    }
  }
  walk(sourceDir)
  return results.sort()
}

let generatedCount = 0
const catalog = []

for (const group of GROUPS) {
  const groupOutDir = path.join(referenceDir, group.key)
  fs.mkdirSync(groupOutDir, { recursive: true })
  fs.mkdirSync(generatedDir, { recursive: true })

  const items = []
  const apiFiles = collectApiFiles(group.source)

  for (const apiFile of apiFiles) {
    const componentName = path.basename(path.dirname(apiFile))
    const raw = fs.readFileSync(apiFile, 'utf8')
    const processed = literalMarkdown(examplesFirst(raw))

    const page = [
      '---',
      `title: "${componentName}"`,
      '---',
      '',
      processed.trim(),
      '',
      '---',
      '',
      `> 文档来源：\`src/components/x/${componentName}/api.md\`。修改后运行 \`pnpm run docs:sync\` 同步到文档站。`,
      '',
    ].join('\n')

    fs.writeFileSync(path.join(groupOutDir, `${componentName}.md`), page)
    items.push({
      text: componentName,
      link: `/reference/${group.key}/${componentName}.html`,
      source: path.relative(root, apiFile).replaceAll('\\', '/'),
    })
    generatedCount += 1
  }

  catalog.push({ key: group.key, title: group.title, items })

  // 清理不再存在的生成页
  const expected = new Set(apiFiles.map(f => `${path.basename(path.dirname(f))}.md`))
  for (const entry of fs.readdirSync(groupOutDir)) {
    if (entry.endsWith('.md') && !expected.has(entry)) {
      fs.unlinkSync(path.join(groupOutDir, entry))
    }
  }
}

// catalog.json（驱动侧边栏）
fs.writeFileSync(
  path.join(generatedDir, 'catalog.json'),
  `${JSON.stringify(catalog, null, 2)}\n`,
)

// 分组索引页
const indexLines = [
  '# 组件总览',
  '',
  '共 ' + generatedCount + ' 个组件。点击左侧边栏或下方列表查看详细 API。',
  '',
]
for (const group of catalog) {
  indexLines.push(`## ${group.title}`, '')
  for (const item of group.items) {
    indexLines.push(`- [${item.text}](${item.link})`)
  }
  indexLines.push('')
}
fs.writeFileSync(path.join(referenceDir, 'index.md'), indexLines.join('\n'))

console.log(`docs sync: ${generatedCount} api.md -> docs/reference, catalog.json updated`)
