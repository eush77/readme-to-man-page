'use strict';

var readmeToManPage = require('..'),
    macro = require('../lib/macro');

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
  t.equal(manLines('', info)[0], mainHeader(assign({}, info, {
    date: 'September 2010'
  })), 'main header');

  t.equal(manLines('text')[0], mainHeader({
    date: months[new Date().getMonth()] + ' ' + new Date().getFullYear()
  }), 'default main header');

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


test('section NAME', function (t) {
  var man;

  man = manLines('# bla\n\ntext', info);
  t.equal(man[man.indexOf(macro('sh', 'NAME')) + 1],
          nameSection(info.name, info.description),
          'both name, description');

  man = manLines('# bla\n\ntext', { name: info.name });
  t.equal(man[man.indexOf(macro('sh', 'NAME')) + 1],
          nameSection(info.name),
          'only name');

  t.end();
});


test('section DESCRIPTION', function (t) {
  var man, index;

  man = manLines('# module\n\nTest module\n\n## rest');
  index = man.indexOf(macro('sh', 'NAME')) + 1;
  t.deepEqual(man.slice(index, index + 4), [
    nameSection(info.name),
    macro('sh', 'DESCRIPTION'),
    macro('p'),
    'Test module'
  ], 'creates new section if there\'s no description');

  man = manLines('# module\n\nTest module\n\nMore info\n\n## rest', info);
  index = man.indexOf(macro('sh', 'NAME')) + 1;
  t.deepEqual(man.slice(index, index + 5), [
    nameSection(info.name, info.description),
    macro('sh', 'DESCRIPTION'),
    macro('p'),
    'More info',
    macro('sh', 'REST')
  ], 'creates a new section if description is more than one paragraph');

  man = manLines('# module\n\nTest module. Built for _tests_.\n\n## rest', info);
  index = man.indexOf(macro('sh', 'NAME')) + 1;
  t.deepEqual(man.slice(index, index + 4), [
    nameSection(info.name, 'Test module. Built for tests.'),
    macro('sh', 'REST')
  ], 'does not create a new section if description is moved');

  t.end();
});


function manLines (readme, opts) {
  return readmeToManPage(readme, opts)
    .split('\n')
    .map(Function.call.bind(''.trim))
    .filter(Boolean);
}


function mainHeader (info) {
  return macro('th', (info.name || '').toUpperCase(),
               (info.section || ''), (info.date || ''),
               (info.version || ''), (info.manual || ''));
}


function nameSection (name, description) {
  name = '\\fB' + info.name + '\\fR';
  description = description ? ' - ' + description : '';
  return name + description;
}
