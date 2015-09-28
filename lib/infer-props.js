'use strict';

var mdastToString = require('mdast-util-to-string');


module.exports = function (mdast, options) {
  var props = options.props;

  return function (ast) {
    // Infer name from headings.
    if (!props.name) {
      props.name = inferName(ast);
    }

    // Try to replace the default description with the content of the first
    // paragraph of readme body since they are often identical.
    if (props.description) {
      props.description = inferDescription(ast, props.description);
    }
  };
};


/**
 * Infer name from the top-level heading.
 */
function inferName (ast) {
  var inferredName;

  ast.children.some(function (node) {
    if (node.type == 'heading' && node.depth == 1) {
      inferredName = mdastToString(node);
      return true;
    }
  });

  return inferredName;
}


/**
 * Find description in the first paragraph of the AST, return that and
 * remove corresponding nodes from the AST.
 *
 * Return the original description if not found.
 */
function inferDescription (ast, description) {
  ast.children.some(function (node, index) {
    if (node.type == 'heading' && node.depth > 1) {
      return true;
    }

    var text = mdastToString(node);
    var prefix = text.slice(0, description.length);
    if (prefix.toLowerCase() == description.toLowerCase()) {
      description = text;
      ast.children.splice(index, 1);
      return true;
    }
  });

  return description;
}
