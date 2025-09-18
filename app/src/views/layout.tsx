import type { FC } from 'hono/jsx'

import type { LayoutProps } from '../types/views'
import Footer from './layout/Footer'
import Welcome from './sections/Welcome'

const Layout: FC<LayoutProps> = (props) => {
  const { lang, is_dev, site_title, description, vite_css, vite_js } = props

  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{site_title}</title>

        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:title" content={site_title} />
        <meta property="og:image" content="" />
        <meta property="og:url" content="" />
        <meta property="og:locale" content="pt_BR" />

        {!is_dev && vite_css && <link rel="stylesheet" href={vite_css} />}
      </head>

      <body>
        <div class="canvas"></div>

        <div class="app">
          <div class="page">
            <div class="page__wrapper">
              {props.page.content.map((entry) => {
                switch (entry._type) {
                  case 'welcome':
                    return <Welcome {...entry} />

                  default:
                    console.warn(`Unknown section type: ${entry._type}`)

                    return null
                }
              })}

              <Footer {...props} />
            </div>
          </div>
        </div>

        {is_dev && <script type="module" src="/@vite/client"></script>}
        <script type="module" src={vite_js}></script>
      </body>
    </html>
  )
}

export default Layout
