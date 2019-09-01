# icon-builder

![CircleCI](https://img.shields.io/circleci/build/github/Codpoe/icon-builder.svg)
![David](https://img.shields.io/david/codpoe/icon-builder.svg)
![npm](https://img.shields.io/npm/v/icon-builder.svg)

An icon builder forked from [webfonts-generator](https://github.com/sunflowerdeath/webfonts-generator).

- 🎉 Supports: `svg`, `ttf`, `woff`, `woff2`, `eot`
- 💥 Converts SVG icons to React components
- 🥊 Developed with TypeScript
- ✅ Passes all tests
- 👀 Generates a friendly preview in HTML

## Install

```sh
$ yarn add icon-builder
```

## Usage

```js
import { toFonts } from 'icon-builder';

(async () => {
  const result = await toFonts({
    fontName: 'helloworld',
    src: 'icons/*.svg',
    out: 'icons-output',
  });
})();
```

### Options

| option | type | default | description |
|---|---|---|---|
| src | `string` | | Required |
| out | `string` / `false` | `false` | |
| fontName | `string` | `'iconfont'` | |
| classPrefix | `string` | `'icon-'` | |
| hash | `boolean` | `true` | Use hash |
| types | `array` | `['svg', 'ttf', 'eot', 'woff', 'woff2']` | Font types |
| startCodepoint | `number` | `0xf101` | |
| codepoints | `object` | `{}` | Unicode start |
| normalize | `boolean` | `true` | |
| centerHorizontally | `boolean` | `true` | |
| css | `object` | | CSS config |
| html | `object` | | HTML config |

### css / html config

```js
{
  out: true, // string | boolean
  template: 'path/to/the/template.hbs',
  options: {},
}
```

#### `out`

- `string`: The output path of CSS/HTML file.
- `true`: The output path is the same as the fonts path (see `out` in [Options](#options)).
- `false`: No emit CSS/HTML file.

By default, `css.out` is `true`, `html.out` is `false`.

#### `template`

Templates must be coded in [Handlebars](https://handlebarsjs.com) (`.hbs`) format. See [`templates` folder](https://github.com/Codpoe/icon-builder/tree/master/templates) as a reference.

This is optional.

#### `options`

This is any extra data passed to the Handlebars template set in `template`.

This is optional.

## React components

```js
import { toReact } from 'icon-builder';

(async () => {
  await toReact({
    src: 'icons/*.svg',
    out: 'icons-output',
  });
})();
```

## Note

Before building the icon font, it is recommended to convert the SVG icons from stroke to fill.

For example: *Sketch* > *Layer* > *Convert to outlines*
