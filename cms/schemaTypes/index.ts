import {defineType} from 'sanity'

export const schemaTypes = [
  defineType({
    name: 'simpleText',
    title: 'Simple Text',
    type: 'document',
    fields: [
      {
        name: 'text',
        title: 'Text',
        type: 'string',
      },
    ],
  }),
]
