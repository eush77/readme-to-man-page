'use strict';

var readmeToManPage = require('..');

var test = require('tape'),
    assign = require('object.assign'),
    months = require('months'),
    mdast = require('mdast');

var fs = require('fs');


var info = {
  name: 'module',
  version: '1.0.0',
  description: 'Test module',
  date: new Date('2010-09-05'),
  section: 'test',
  manual: 'Test Manual'
};


test('metadata', function (t) {
  var infoMan = manLines('', info);
  t.equal(infoMan[0], mainHeader(assign({}, info, {
    date: 'September 2010'
  })), 'main header');
  t.equal(infoMan[1], macro('sh', 'NAME'), 'section NAME');
  t.equal(infoMan[2], nameSection(info), 'content of section NAME');

  var plainMan = manLines('text');
  t.equal(plainMan[0], mainHeader({
    date: months[new Date().getMonth()] + ' ' + new Date().getFullYear()
  }), 'no options - main header');
  t.equal(plainMan[1].split(' ')[0], macro('sh'),
          'no options - some section follows');

  t.end();
});


test('inferred name', function (t) {
  var ast = mdast.parse(fs.readFileSync(__dirname + '/../README.md', 'utf8'),
                        { position: false });
  ast.children.unshift({
    type: 'heading',
    depth: 1,
    children: [{
      type: 'text',
      value: 'module'
    }]
  });
  var readme = mdast.stringify(mdast.run(ast));

  t.deepEqual(manLines(readme), manLines(readme, { name: 'module' }),
              'name inferred from headings');
  t.deepEqual(manLines(readme, { description: 'Test module' }),
              manLines(readme, { name: 'module', description: 'Test module' }),
              'name inferred from headings, with description');
  t.end();
});


function manLines (readme, opts) {
  return readmeToManPage(readme, opts)
    .split('\n')
    .map(Function.call.bind(''.trim))
    .filter(Boolean);
}


function macro (name /* values */) {
  var values = [].slice.call(arguments, 1)
        .map(function (value) {
          return ' "' + value + '"';
        })
        .join('');
  return '.' + name.toUpperCase() + values;
}


function mainHeader (info) {
  return macro('th', (info.name || '').toUpperCase(),
               (info.section || ''), (info.date || ''),
               (info.version || ''), (info.manual || ''));
}


function nameSection (info) {
  return '\\fB' + info.name + '\\fR - ' + info.description;
}


