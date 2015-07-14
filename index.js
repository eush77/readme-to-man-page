'use strict';

var npmExpansion = require('npm-expansion'),
    assign = require('object.assign'),
    mdast = require('mdast'),
    mdastFile = require('mdast/lib/file'),
    mdastMan = require('mdast-man'),
    mdastStripBadges = require('mdast-strip-badges'),
    mdastSqueezeParagraphs = require('mdast-squeeze-paragraphs'),
    mdAstVisit = require('mdast-util-visit'),
    mdAstToString = require('mdast-util-to-string');


/**
 * Find description in the first paragraph of the AST, return that and
 * remove corresponding nodes from the AST.
 *
 * Return the original description if not found.
 */
var descriptionText = function (ast, description) {
  mdAstVisit(ast, 'paragraph', function (node, index, parent) {
    var firstParagraph = mdAstToString(node);
    var prefix = firstParagraph.slice(0, description.length);
    if (prefix.toLowerCase() == description.toLowerCase()) {
      description = firstParagraph;
      parent.children.splice(index, 1);
    }
    return false;
  });

  return description;
};


module.exports = function (readme, opts) {
  if (typeof readme == 'object') {
    opts = readme;
    readme = opts.readme;
  }

  opts = opts || {};

  if (opts.time && opts.time.modified) {
    opts.time = opts.time.modified;
  }

  var ast = mdast()
        .use(mdastStripBadges)
        .use(mdastSqueezeParagraphs)
        .run(mdast.parse(readme));

  // Try to replace the default description with the content of the first
  // paragraph of readme body since they are often identical.
  if (opts.description) {
    opts.description = descriptionText(ast, opts.description);
  }

  var manmd = mdast().use(mdastMan, assign({}, opts, {
    section: 'npm',
    manual: npmExpansion()
  }));

  // mdast-man captures some settings on the File object.
  var file = mdastFile();
  return manmd.stringify(manmd.run(ast, file), file, {});
};
