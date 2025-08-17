import type { ColecaoAgrupada } from './sanity'

export interface Base {
  site_title: string
  description?: string
  charset: string
  lang: string
  is_dev: boolean
  vite_js: string
  vite_css: string
}

export interface Home extends Base {
  colecoes: ColecaoAgrupada[],
  latest_year: number
}

