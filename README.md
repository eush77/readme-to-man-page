[![npm](https://nodei.co/npm/readme-to-man-page.png)](https://npmjs.com/package/readme-to-man-page)

# readme-to-man-page

[![Dependency Status][david-badge]][david]

Turn Markdown readme to a good-looking man page.

[david]: https://david-dm.org/eush77/readme-to-man-page
[david-badge]: https://david-dm.org/eush77/readme-to-man-page.png

## Example

```js
var readme = fs.readFileSync('./README.md', { encoding: 'utf8' });
var pkg = require('./package');

readmeToManPage(readme, pkg)
//=> '.TH "README-TO-MAN-PAGE" "npm" "July 2015" "0.1.2" "Nutty Programming Men"\n.SH "NAME"\n\\f...'
```

## API

#### `readmeToManPage([readme], [opts])`

`readme` defaults to `opts.readme`.

Options:

- `name`: package name.
- `version`: package version.
- `description`: package description.
- `time`: readme date or string or object with `modified` field (as returned from the npm registry).

## Install

```
npm install readme-to-man-page
```

## License

MIT
