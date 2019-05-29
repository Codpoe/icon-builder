# iconfont generator

![CircleCI](https://img.shields.io/circleci/build/github/Codpoe/iconfont.svg)
![David](https://img.shields.io/david/codpoe/iconfont.svg)
![npm (scoped)](https://img.shields.io/npm/v/@codpoe/iconfont.svg)

Fork from [webfonts-generator](https://github.com/sunflowerdeath/webfonts-generator)

- 🎉Support `svg`, `ttf`, `woff`, `woff2`, `eot`
- 🥊Develop with TypeScript
- ✅Pass test
- 👀Friendly preview

## Install
```
yarn add @codpoe/iconfont
```

## Usage
```
import iconfont from '@codpoe/iconfont';

async () => {
  const result = await iconfont({
    src: 'icons/*.svg',
    output: 'icons-output',
  });
}();
```

## Options

| option | type | default | description |
|---|---|---|---|
| src | `string` | | required |
| out | `string | false` | `false` | |
| fontName | `string` | `'iconfont'` | |
| classPrefix | `string` | `'icon-'` | |
| hash | `boolean` | `true` | use hash |
| types | `array` | `['svg', 'ttf', 'eot', 'woff', 'woff2']` | font types |
| startCodepoint | `number` | `0xf101` | |
| codepoints | `object` | `{}` | unicode start |
| normalize | `boolean` | `true` | |
| centerHorizontally | `boolean` | `true` | |

## Note

Before generating the iconfont, it's best to convert the svg icons from stroke to fill.

For example, sketch / layer / convert to outlines.
