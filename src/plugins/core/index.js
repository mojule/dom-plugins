'use strict'

const is = require( '@mojule/is' )

const core = ({ core }) => {
  core.isState = state =>
    is.object( state ) && is.object( state.value ) &&
    is.string( state.value.nodeName )
}

module.exports = core
