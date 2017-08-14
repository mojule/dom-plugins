'use strict'

const is = require( '@mojule/is' )

const defaultAttributes = ({ core }) => {
  core.registerAttribute({
    name: 'class',
    propertyName: () => 'className',
    stringify: value => value || ''
  })

  core.registerAttribute({ name: 'id', stringify: value => value || '' })
  core.registerAttribute({ name: 'name', stringify: value => value })
  core.registerAttribute({ name: 'title', stringify: value => value || '' })
}

module.exports = defaultAttributes
