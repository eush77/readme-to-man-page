'use strict';

var macro = require('./macro');


module.exports = function (man, opts) {
  man = man.split('\n');

  var lineIndex = man.indexOf(macro('sh', 'NAME'));

  if (lineIndex >= 0 && !opts.description) {
    man[lineIndex + 1] = man[lineIndex + 1].split(' - ', 1)[0];
  }

  return man.join('\n');
};
