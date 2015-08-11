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

Other options:

- `name`: package name.
- `version`: package version.
- `versions`: array of versions or object with version keys (`{ "1.0.0": ..., "2.0.0": ...}`), the maximum version is selected. This is the alternative option to `version` (single). You should not specify both.
- `description`: package description.
- `time`: readme date or string or object with `modified` field (as returned from the npm registry).
- `section`: section code (e.g. `1`).
- `manual`: full section name (e.g. `Linux Programmer's Manual`).

You should be able to just pass the `package.json` file or JSON returned from  `registry.npmjs.com`.

## Related

- Use [`man-pager`][man-pager] to display a man page in the terminal.

[man-pager]: https://github.com/eush77/man-pager

## Install

```
npm install readme-to-man-page
```

## License

MIT
