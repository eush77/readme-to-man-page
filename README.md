[![npm](https://nodei.co/npm/readme-to-man-page.png)](https://npmjs.com/package/readme-to-man-page)

# readme-to-man-page

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Turn Markdown README into a good-looking man page.

Bells and whistles on top of the excellent [remark-man] by [@wooorm].

[@wooorm]: https://github.com/wooorm

[travis]: https://travis-ci.org/eush77/readme-to-man-page
[travis-badge]: https://travis-ci.org/eush77/readme-to-man-page.svg?branch=master
[david]: https://david-dm.org/eush77/readme-to-man-page
[david-badge]: https://david-dm.org/eush77/readme-to-man-page.png

## Example

```js
var readme = fs.readFileSync('./README.md', 'utf8');
var pkg = require('./package');

readmeToManPage(readme, {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  section: 'npm',
  manual: 'Node Package Manager'
})
//=> '.TH "README-TO-MAN-PAGE" "npm" "July 2015" "0.1.2" "Node Package Manager"\n.SH "NAME"\n\\f...'
```

## API

### `readmeToManPage(readme, [opts])`

Returns man page as a string.

#### `readme`

Type: `String` <br>

Readme text in Markdown.

#### Options

No option is required. But the more options are set, the more pleasing the output will be.

- `name` — can be inferred from headings.
- `version`
- `description`
- `date` — latest revision date, passed to `Date` constructor.
- `section` — section code (e.g. `1`).
- `manual` — full section name (e.g. `Linux Programmer's Manual`).

## Related

- [remark-man] — compile Markdown to man pages with [remark].
- [npm-man] — open any package readme from npm as a man page.
- [man-pager] — display a man page in the terminal programmatically.

[remark]: https://github.com/wooorm/remark
[remark-man]: https://github.com/wooorm/remark-man
[npm-man]: https://github.com/eush77/npm-man
[man-pager]: https://github.com/eush77/man-pager

## Install

```
npm install readme-to-man-page
```

## License

MIT
