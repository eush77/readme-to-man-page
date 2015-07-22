'use strict';

var npmExpansion = require('npm-expansion'),
    assign = require('object.assign'),
    semverMax = require('semver-max'),
    mdast = require('mdast'),
    mdastFile = require('mdast/lib/file'),
    mdastMan = require('mdast-man'),
    mdastStripBadges = require('mdast-strip-badges'),
    mdastSqueezeParagraphs = require('mdast-squeeze-paragraphs/plugin'),
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

    // Skip definitions.
    while (startNode && startNode.type == 'definition') {
      startNode = ast.children[++startIndex];
    }

    if (!startNode || startNode.type == 'heading') {
      return;
    }
  }
  else {
    return;
  }

  mdAstNormalizeHeadings(ast).children.splice(startIndex, 0, {
    type: 'heading',
    depth: 2,
    children: [{
      type: 'text',
      value: 'DESCRIPTION'
    }]
  });
};


var normalize = {
  date: function (opts) {
    return opts.time && opts.time.modified ? opts.time.modified : opts.time;
  },
  version: function (opts) {
    if (opts.version) {
      return opts.version;
    }
    else if (opts.versions) {
      if (!Array.isArray(opts.versions)) {
        opts.versions = Object.keys(opts.versions);
      }
      return opts.versions.reduce(semverMax);
    }
  }
};


var normalizeOptions = function (opts) {
  opts = opts || {};
  Object.keys(normalize).forEach(function (key) {
    opts[key] = normalize[key](opts);
  });
  return opts;
};


module.exports = function (readme, opts) {
  if (typeof readme == 'object') {
    opts = readme;
    readme = opts.readme;
  }

  opts = normalizeOptions(opts);

  var ast = mdast()
        .use(mdastStripBadges)
        .use(mdastSqueezeParagraphs)
        .run(mdast.parse(readme, { position: false }));

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
