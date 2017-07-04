'use strict'

const defaultAttributes = ({ core }) => {
  core.registerAttribute({
    name: 'class',
    propertyName: () => 'className'
  })

  core.registerAttribute({ name: 'id' })
  core.registerAttribute({ name: 'name' })
  core.registerAttribute({ name: 'title' })
}

module.exports = defaultAttributes
