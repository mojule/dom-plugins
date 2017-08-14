'use strict'

const is = require( '@mojule/is' )

const core = ({ core }) => {
  core.isState = state =>
    is.object( state ) && is.object( state.value ) &&
    is.integer( state.value.nodeType )
}

module.exports = core
