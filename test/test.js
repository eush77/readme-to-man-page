'use strict';

var readmeToManPage = require('..');

var test = require('tape'),
    assign = require('object.assign'),
    months = require('months');

var fs = require('fs');


var manLines = function (readme, opts) {
  return readmeToManPage(readme, opts)
    .split('\n')
    .map(Function.call.bind(''.trim))
    .filter(Boolean);
};


var macro = function (name /* values */) {
  var values = [].slice.call(arguments, 1)
        .map(function (value) {
          return ' "' + value + '"';
        })
        .join('');
  return '.' + name.toUpperCase() + values;
};


test('metadata', function (t) {
  var info = {
    name: 'module',
    version: '1.0.0',
    description: 'Test module',
    date: new Date('2010-09-05'),
    section: 'test',
    manual: 'Test Manual'
  };

  var infoMan = manLines('', info);
  assertMainHeader(infoMan[0], assign({}, info, {
    date: 'September 2010'
  }), 'main header');
  t.equal(infoMan[1], macro('sh', 'NAME'), 'section NAME');
  t.equal(infoMan[2], '\\fB' + info.name + '\\fR - ' + info.description,
          'section NAME');

  var plainMan = manLines('text');
  assertMainHeader(plainMan[0], {
    date: months[new Date().getMonth()] + ' ' + new Date().getFullYear()
  }, 'no options - main header');
  t.equal(plainMan[1].split(' ')[0], macro('sh'),
          'no options - some section follows');

  t.end();

  function assertMainHeader (line, info, message) {
    t.equal(line, macro('th', (info.name || '').toUpperCase(),
                        (info.section || ''), (info.date || ''),
                        (info.version || ''), (info.manual || '')),
            message);
  }
});
