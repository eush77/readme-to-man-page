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

  if (opts.description) {
    // Try to replace the default description with the content of the first
    // paragraph of readme body since they are often identical.
    mdAstVisit(ast, 'paragraph', function (node, index, parent) {
      var firstParagraph = mdAstToString(node);
      var prefix = firstParagraph.slice(0, opts.description.length);
      if (prefix.toLowerCase() == opts.description.toLowerCase()) {
        opts.description = firstParagraph;
        parent.children.splice(index, 1);
      }
      return false;
    });
  }

  var manmd = mdast().use(mdastMan, assign({}, opts, {
    section: 'npm',
    manual: npmExpansion()
  }));

  // mdast-man captures some settings on the File object.
  var file = mdastFile();
  return manmd.stringify(manmd.run(ast, file), file, {});
};
