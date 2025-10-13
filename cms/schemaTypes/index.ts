import { defineType } from 'sanity'

export const schemaTypes = [
	defineType({
		fields: [
			{
				name: 'text',
				title: 'Text',
				type: 'string',
			},
			{
				name: 'OtherText',
				title: 'Other Text',
				type: 'string',
			},
		],
		name: 'simpleText',
		title: 'Simple Text',
		type: 'document',
	}),
]
