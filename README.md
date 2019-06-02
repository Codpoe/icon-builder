# iconfont

![CircleCI](https://img.shields.io/circleci/build/github/Codpoe/iconfont.svg)
![David](https://img.shields.io/david/codpoe/iconfont.svg)
![npm (scoped)](https://img.shields.io/npm/v/@codpoe/iconfont.svg)

An iconfont generator, forked from [webfonts-generator](https://github.com/sunflowerdeath/webfonts-generator)

- 🎉Support `svg`, `ttf`, `woff`, `woff2`, `eot`
- 🥊Develop with TypeScript
- ✅Pass test
- 👀Friendly preview

## Install
```
yarn add @codpoe/iconfont
```

## Usage
```js
import iconfont from '@codpoe/iconfont';

(async () => {
  const result = await iconfont({
    fontName: 'helloworld',
    src: 'icons/*.svg',
    out: 'icons-output',
  });
})();
```

## Options

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

## Note

Before generating the iconfont, it's best to convert the svg icons from stroke to fill.

For example, sketch / layer / convert to outlines.
