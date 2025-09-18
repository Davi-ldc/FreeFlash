import Welcome, { type WelcomeProps } from '../views/sections/Welcome'

export const sections = {
  welcome: { component: Welcome, props: {} as WelcomeProps },
} as const

export type SectionMap = {
  [K in keyof typeof sections]: (typeof sections)[K]['props']
}

export type SectionEntry = {
  [K in keyof SectionMap]: { _type: K } & SectionMap[K]
}[keyof SectionMap]

export type PageModel = {
  content: SectionEntry[]
}

// Asset helper é injetado pelo app e pode ser usado em qualquer view
export type AssetFn = (path: string) => string

export interface LayoutProps {
  asset: AssetFn
  description?: string
  is_dev: boolean
  lang: string
  page: PageModel
  site_title: string
  vite_css: string
  vite_js: string
}
