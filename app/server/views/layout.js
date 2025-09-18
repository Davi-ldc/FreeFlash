import { jsx as e, jsxs as t } from 'hono/jsx/jsx-runtime'
import o from './layout/Footer'
import n from './sections/Welcome'
export default (r) => {
  let { lang: c, is_dev: i, site_title: a, description: l, vite_css: p, vite_js: s } = r
  return t('html', {
    lang: c,
    children: [
      t('head', {
        children: [
          e('meta', {
            charSet: 'UTF-8',
          }),
          e('meta', {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0',
          }),
          e('title', {
            children: a,
          }),
          e('meta', {
            name: 'description',
            content: l,
          }),
          e('meta', {
            property: 'og:description',
            content: l,
          }),
          e('meta', {
            property: 'og:title',
            content: a,
          }),
          e('meta', {
            property: 'og:image',
            content: '',
          }),
          e('meta', {
            property: 'og:url',
            content: '',
          }),
          e('meta', {
            property: 'og:locale',
            content: 'pt_BR',
          }),
          !i &&
            p &&
            e('link', {
              rel: 'stylesheet',
              href: p,
            }),
        ],
      }),
      t('body', {
        children: [
          e('div', {
            class: 'canvas',
          }),
          e('div', {
            class: 'app',
            children: e('div', {
              class: 'page',
              children: t('div', {
                class: 'page__wrapper',
                children: [
                  r.page.content.map((t) =>
                    'welcome' === t._type
                      ? e(n, {
                          ...t,
                        })
                      : (console.warn(`Unknown section type: ${t._type}`), null),
                  ),
                  e(o, {
                    ...r,
                  }),
                ],
              }),
            }),
          }),
          i &&
            e('script', {
              type: 'module',
              src: '/@vite/client',
            }),
          e('script', {
            type: 'module',
            src: s,
          }),
        ],
      }),
    ],
  })
}
