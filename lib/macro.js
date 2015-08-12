'use strict';


module.exports = function (name /* values */) {
  var values = [].slice.call(arguments, 1)
        .map(function (value) {
          return ' "' + value + '"';
        })
        .join('');
  return '.' + name.toUpperCase() + values;
};
