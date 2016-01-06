'use strict';

var stripImages = require('./lib/strip-images'),
    inferProps = require('./lib/infer-props'),
    createDescriptionSection = require('./lib/create-description-section'),
    postprocess = require('./lib/postprocess');

var remark = require('remark'),
    stripBadges = require('remark-strip-badges'),
    squeezeParagraphs = require('remark-squeeze-paragraphs'),
    normalizeHeadings = require('remark-normalize-headings'),
    manCompiler = require('remark-man');


module.exports = function (readme, opts) {
  opts = opts || {};

  var manPage = remark()
        .use(stripBadges)
        .use(stripImages)
        .use(squeezeParagraphs)
        .use(normalizeHeadings)
        .use(inferProps, { props: opts })
        .use(createDescriptionSection, { skippedTypes: ['definition', 'html'] })
        .use(manCompiler, opts)
        .process(readme);

  return postprocess(manPage, opts);
};
