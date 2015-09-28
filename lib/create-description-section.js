'use strict';


/**
 * Move anything other than title string away from the NAME section
 * into DESCRIPTION.
 */
module.exports = function (mdast, options) {
  var skippedTypes = options.skippedTypes;

  return function (ast) {
    var startIndex;

    if (!ast.children.length) {
      return;
    }
    if (ast.children[0].type != 'heading') {
      startIndex = 0;
    }
    else if (ast.children[0].depth == 1 && ast.children.length >= 2) {
      startIndex = 1;
      var startNode = ast.children[startIndex];

      while (startNode && skippedTypes.indexOf(startNode.type) >= 0) {
        startNode = ast.children[++startIndex];
      }

      if (!startNode || startNode.type == 'heading') {
        return;
      }
    }
    else {
      return;
    }

    ast.children.splice(startIndex, 0, {
      type: 'heading',
      depth: 2,
      children: [{
        type: 'text',
        value: 'DESCRIPTION'
      }]
    });
  };
};
