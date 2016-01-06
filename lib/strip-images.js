'use strict';

var select = require('unist-util-select'),
    remove = require('unist-util-remove');


module.exports = function () {
  return function (ast) {
    remove(ast, select(ast, 'image'));
  };
};
