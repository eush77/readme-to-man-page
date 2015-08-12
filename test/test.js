'use strict';

var readmeToManPage = require('..');

var test = require('tape'),
    Test = test.Test,
    assign = require('object.assign');

var fs = require('fs');


var macro = function (name /* values */) {
  var values = [].slice.call(arguments, 1)
        .map(function (value) {
          return ' "' + value + '"';
        })
        .join('');
  return '.' + name.toUpperCase() + values;
};


Test.prototype.assertMetadata = function (man, info) {
  var lines = man.split('\n');
  this.equal(lines[0], macro('th', info.name.toUpperCase(), info.section,
                             info.date, info.version, info.manual));
  this.equal(lines[1], macro('sh', 'NAME'));
  this.equal(lines[2], '\\fB' + info.name + '\\fR - ' + info.description);
};


test(function (t) {
  var info = {
    name: 'module',
    version: '1.0.0',
    description: 'Test module',
    date: new Date('2010-09-05'),
    section: 'test',
    manual: 'Test Manual'
  };

  var man = readmeToManPage('', info);
  t.assertMetadata(man, assign({}, info, {
    date: 'September 2010'
  }));

  t.end();
});
