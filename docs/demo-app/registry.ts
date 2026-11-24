/**
 * 组件演示注册表。
 * key 与组件目录名一致，供 ComponentDemo iframe 的 ?component= 查询。
 */
import type { Component } from 'vue'
import XButtonDemo from './demos/XButtonDemo.vue'
import XSegmentedDemo from './demos/XSegmentedDemo.vue'
import XSelectDemo from './demos/XSelectDemo.vue'
import XRadioBoxDemo from './demos/XRadioBoxDemo.vue'
import XRadioGroupDemo from './demos/XRadioGroupDemo.vue'
import XCheckboxGroupDemo from './demos/XCheckboxGroupDemo.vue'

export const demoRegistry: Record<string, { component: Component, label: string }> = {
  XButton: { component: XButtonDemo, label: 'XButton 按钮' },
  XSegmented: { component: XSegmentedDemo, label: 'XSegmented 分段选择器' },
  XSelect: { component: XSelectDemo, label: 'XSelect 下拉选择' },
  XRadioBox: { component: XRadioBoxDemo, label: 'XRadioBox 胶囊单选' },
  XRadioGroup: { component: XRadioGroupDemo, label: 'XRadioGroup 单选' },
  XCheckboxGroup: { component: XCheckboxGroupDemo, label: 'XCheckboxGroup 多选' },
}