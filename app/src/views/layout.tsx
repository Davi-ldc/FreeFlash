import type { LayoutProps } from '../types/views'
import Footer from './layout/Footer'
import Welcome from './sections/Welcome'

const Layout = (props: LayoutProps) => {
	const { lang, is_dev, site_title, description, vite_css, vite_js } = props

	return (
		<html lang={lang}>
			<head>
				<meta charset="UTF-8" />
				<meta content="width=device-width, initial-scale=1.0" name="viewport" />
				<link href={props.asset('src/assets/images/favicon.svg')} rel="icon" type="image/png" />
				<title>{site_title}</title>

				<meta content={description} name="description" />
				<meta content={description} property="og:description" />
				<meta content={site_title} property="og:title" />
				<meta content="" property="og:image" />
				<meta content="" property="og:url" />
				<meta content="pt_BR" property="og:locale" />

				{!is_dev && vite_css && <link href={vite_css} rel="stylesheet" />}
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

							<Footer text="Rodapé" />
						</div>
					</div>
				</div>

				{is_dev && <script src="/@vite/client" type="module"></script>}
				<script src={vite_js} type="module"></script>
			</body>
		</html>
	)
}

export default Layout
