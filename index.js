'use strict';

var npmExpansion = require('npm-expansion'),
    assign = require('object.assign'),
    mdast = require('mdast'),
    mdastFile = require('mdast/lib/file'),
    mdastMan = require('mdast-man'),
    mdastStripBadges = require('mdast-strip-badges'),
    mdastSqueezeParagraphs = require('mdast-squeeze-paragraphs'),
    mdAstVisit = require('mdast-util-visit'),
    mdAstToString = require('mdast-util-to-string'),
    mdAstNormalizeHeadings = require('mdast-normalize-headings');


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


/**
 * Move anything other than title string away from the NAME section.
 */
var createDescriptionSection = function (ast) {
  var startNode;

  if (!ast.children.length) {
    return;
  }
  if (ast.children[0].type != 'heading') {
    startNode = 0;
  }
  else if (ast.children[0].depth == 1 && ast.children.length >= 2) {
    startNode = 1;

    // Skip definitions.
    while (ast.children[startNode].type == 'definition') {
      if (++startNode == ast.children.length ||
          ast.children[startNode].type == 'heading') {
        return;
      }
    }
  }
  else {
    return;
  }

  mdAstNormalizeHeadings(ast).children.splice(startNode, 0, {
    type: 'heading',
    depth: 2,
    children: [{
      type: 'text',
      value: 'DESCRIPTION'
    }]
  });
};


module.exports = function (readme, opts) {
  if (typeof readme == 'object') {
    opts = readme;
    readme = opts.readme;
  }

  opts = opts || {};
  opts.date = opts.time && opts.time.modified ? opts.time.modified : opts.time;

  var ast = mdast()
        .use(mdastStripBadges)
        .use(mdastSqueezeParagraphs)
        .run(mdast.parse(readme));

  // Try to replace the default description with the content of the first
  // paragraph of readme body since they are often identical.
  if (opts.description) {
    opts.description = descriptionText(ast, opts.description);
  }

  // Create DESCRIPTION section if needed.
  createDescriptionSection(ast);

  var manmd = mdast().use(mdastMan, assign(opts, {
    section: 'npm',
    manual: npmExpansion()
  }));

  // mdast-man captures some settings on the File object.
  var file = mdastFile();
  return manmd.stringify(manmd.run(ast, file), file, {});
};
