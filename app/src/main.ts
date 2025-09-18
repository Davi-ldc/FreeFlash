import './styles/main.scss'
import.meta.glob('./assets/images/**/*.{png,jpg,jpeg,svg,webp,avif}')

import { CONFIG } from './ts/globals'
import { debounce } from './ts/utils'

document.addEventListener('DOMContentLoaded', async (): Promise<void> => {
  window.addEventListener(
    'resize',
    debounce((): void => {}, CONFIG.DEBOUNCE_DELAY),
  )
})
