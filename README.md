# icon-builder

![CircleCI](https://img.shields.io/circleci/build/github/Codpoe/icon-builder.svg)
![David](https://img.shields.io/david/codpoe/icon-builder.svg)
![npm](https://img.shields.io/npm/v/icon-builder.svg)

An icon builder, forked from [webfonts-generator](https://github.com/sunflowerdeath/webfonts-generator)

- 🎉Support `svg`, `ttf`, `woff`, `woff2`, `eot`
- 💥Covert svg icons to react components
- 🥊Develop with TypeScript
- ✅Pass test
- 👀Friendly preview

## Install
```
yarn add icon-builder
```

## iconfont
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
| src | `string` | | required |
| out | `string` / `false` | `false` | |
| fontName | `string` | `'iconfont'` | |
| classPrefix | `string` | `'icon-'` | |
| hash | `boolean` | `true` | use hash |
| types | `array` | `['svg', 'ttf', 'eot', 'woff', 'woff2']` | font types |
| startCodepoint | `number` | `0xf101` | |
| codepoints | `object` | `{}` | unicode start |
| normalize | `boolean` | `true` | |
| centerHorizontally | `boolean` | `true` | |
| css | `object` | | css config |
| html | `object` | | html config |

### css / html config
```js
{
  out: true, // string | boolean
  template: TEMPLATES.css / TEMPLATE.html,
  options: {},
}
```
About `out`:
- `string`: the output path of css / html file.
- `true`: the output path is the same as the fonts path.
- `false`: no emit css / html file.

By default, `css.out` is `true`, `html.out` is `false`.

## react components
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

Before building the iconfont, it's best to convert the svg icons from stroke to fill.

For example, sketch / layer / convert to outlines.
