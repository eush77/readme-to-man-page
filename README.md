[![npm](https://nodei.co/npm/readme-to-man-page.png)](https://npmjs.com/package/readme-to-man-page)

# readme-to-man-page

[![Build Status][travis-badge]][travis] [![Dependency Status][david-badge]][david]

Turn Markdown readme to a good-looking man page.

[travis]: https://travis-ci.org/eush77/readme-to-man-page
[travis-badge]: https://travis-ci.org/eush77/readme-to-man-page.svg
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

Returns man page as a string marked up in roff.

#### `readme`

Type: `String` <br>

Readme text in Markdown.

#### Options

<dl>
<dt><code>name</code></dt>
<dd>
Package name.
</dd>

<dt><code>version</code></dt>
<dd>
Package version.
</dd>

<dt><code>description</code></dt>
<dd>
Package description.
</dd>

<dt><code>date</code></dt>
<dd>
Latest revision date.
</dd>

<dt><code>section</code></dt>
<dd>
Section code (e.g. `1`).
</dd>

<dt><code>manual</code></dt>
<dd>
Full section name (e.g. `Linux Programmer's Manual`).
</dd>
</dl>

## Related

- [npm-man] — open any package readme from npm as a man page.
- Use [`man-pager`][man-pager] to display a man page in the terminal programmatically.

[npm-man]: https://github.com/eush77/npm-man
[man-pager]: https://github.com/eush77/man-pager

## Install

```
npm install readme-to-man-page
```

## License

MIT
