'use strict';

var postprocess = require('./lib/postprocess'),
    inferProps = require('./lib/infer-props'),
    createDescriptionSection = require('./lib/create-description-section');

var mdast = require('mdast'),
    mdastMan = require('mdast-man'),
    mdastStripBadges = require('mdast-strip-badges'),
    mdastSqueezeParagraphs = require('mdast-squeeze-paragraphs'),
    mdastNormalizeHeadings = require('mdast-normalize-headings'),
    mdastToString = require('mdast-util-to-string');


module.exports = function (readme, opts) {
  opts = opts || {};

  var manPage = mdast()
        .use(mdastStripBadges)
        .use(mdastSqueezeParagraphs)
        .use(mdastNormalizeHeadings)
        .use(inferProps, { props: opts })
        .use(createDescriptionSection, { skippedTypes: ['definition', 'html'] })
        .use(mdastMan, opts)
        .process(readme);

  return postprocess(manPage, opts);
};
