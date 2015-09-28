'use strict';

var inferProps = require('./lib/infer-props'),
    createDescriptionSection = require('./lib/create-description-section'),
    postprocess = require('./lib/postprocess');

var mdast = require('mdast'),
    stripBadges = require('mdast-strip-badges'),
    squeezeParagraphs = require('mdast-squeeze-paragraphs'),
    normalizeHeadings = require('mdast-normalize-headings'),
    mdastMan = require('mdast-man');


module.exports = function (readme, opts) {
  opts = opts || {};

  var manPage = mdast()
        .use(stripBadges)
        .use(squeezeParagraphs)
        .use(normalizeHeadings)
        .use(inferProps, { props: opts })
        .use(createDescriptionSection, { skippedTypes: ['definition', 'html'] })
        .use(mdastMan, opts)
        .process(readme);

  return postprocess(manPage, opts);
};
