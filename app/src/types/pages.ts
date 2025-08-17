export interface Base {
  site_title: string
  description?: string
  charset: string
  lang: string
  is_dev: boolean
  vite_js: string
  vite_css: string
}

//Ai você cria uma interface com as variaveis que cada página precisa
export interface Home extends Base {
}

