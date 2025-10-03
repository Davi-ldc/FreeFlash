export default {
	extends: ['stylelint-config-standard-scss'],
	plugins: ['stylelint-order', 'stylelint-scss'],
	rules: {
		'at-rule-empty-line-before': [
			'always',
			{
				ignore: [
					'after-comment',
					'first-nested',
					'inside-block',
					'blockless-after-same-name-blockless',
					'blockless-after-blockless',
				],
			},
		],
		'custom-property-empty-line-before': null,
		'custom-property-pattern': '[a-z]',
		'no-descending-specificity': null,
		'order/properties-alphabetical-order': true,
		'scss/no-global-function-names': null,
		'scss/percent-placeholder-pattern': '[a-z]',
		'selector-class-pattern': '[a-z]',
	},
}
