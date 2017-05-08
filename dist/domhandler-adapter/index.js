'use strict';

var DomHandler = function DomHandler(nodeApi, options) {
  var state = State(nodeApi, options);

  var handler = { state: state };

  var api = Api(handler);

  return api;
};

//default options
var defaultOpts = {
  normalizeWhitespace: false
};

var State = function State(nodeApi, options) {
  options = Object.assign({}, defaultOpts, options);

  var fragment = nodeApi.createDocumentFragment();
  var done = false;
  var tagStack = [];
  var parser = null;

  var state = {
    options: options, fragment: fragment, done: done, tagStack: tagStack, parser: parser, nodeApi: nodeApi
  };

  return state;
};

var Api = function Api(handler) {
  var _handler$state = handler.state,
      options = _handler$state.options,
      nodeApi = _handler$state.nodeApi,
      tagStack = _handler$state.tagStack,
      fragment = _handler$state.fragment;


  var onend = function onend() {
    handler.state.done = true;
    handler.state.parser = null;

    onerror(null);
  };

  var onerror = function onerror(err) {
    if (err) throw err;
  };

  var onclosetag = function onclosetag() {
    return tagStack.pop();
  };

  var onopentag = function onopentag(name, attribs) {
    var element = nodeApi.createElement(name, attribs);

    addDomNode(handler, element);

    tagStack.push(element);
  };

  var ontext = function ontext(data) {
    var text = nodeApi.createText(data);

    addDomNode(handler, text);
  };

  var oncomment = function oncomment(data) {
    var comment = nodeApi.createComment(data);

    addDomNode(handler, comment);
    tagStack.push(comment);
  };

  var onprocessinginstruction = function onprocessinginstruction(name, data) {
    /* only support html5 doctype, look into parsing the data string properly */
    if (data.toLowerCase().startsWith('!doctype')) {
      var doctype = nodeApi.createDocumentType('html');

      addDomNode(handler, doctype);

      return;
    }

    oncomment(data);
    oncommentend();
  };

  var oncommentend = function oncommentend() {
    return handler.state.tagStack.pop();
  };

  var getDom = function getDom() {
    return handler.state.fragment;
  };

  var api = {
    onend: onend, onerror: onerror, onclosetag: onclosetag, onopentag: onopentag, ontext: ontext, oncomment: oncomment,
    oncommentend: oncommentend, onprocessinginstruction: onprocessinginstruction, getDom: getDom
  };

  return api;
};

var addDomNode = function addDomNode(handler, node) {
  var _handler$state2 = handler.state,
      tagStack = _handler$state2.tagStack,
      fragment = _handler$state2.fragment;


  var parent = tagStack[tagStack.length - 1];
  var target = parent || fragment;

  target.append(node);
};

module.exports = DomHandler;