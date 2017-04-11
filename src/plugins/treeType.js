'use strict'

const is = require( '@mojule/is' )

const treeType = node => {
  return {
    $treeType: () => 'tree'
  }
}

module.exports = treeType
