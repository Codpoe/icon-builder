import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as glob from 'glob';
import * as _ from 'lodash';

import generateFonts from './generateFonts';
import renderCss from './renderCss';
import renderHtml from './renderHtml';
import { calcHash } from './utils';

import { Options, FontsResult, FontType, UrlMap } from './types/index';

const TEMPLATES_DIR = path.join(__dirname, '../templates');
const TEMPLATES = {
  css: path.join(TEMPLATES_DIR, 'css.hbs'),
  html: path.join(TEMPLATES_DIR, 'html.hbs'),
};

const DEFAULT_OPTIONS: Options = {
  fontName: 'iconfont',
  fontHeight: 600,
  emit: true,
  classPrefix: 'icon-',
  hash: true,
  files: [],
  css: {
    emit: true,
    template: TEMPLATES.css,
    options: {},
  },
  html: {
    emit: false,
    template: TEMPLATES.html,
    options: {},
  },
  types: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
  rename: (file: string): string => path.basename(file, path.extname(file)),
  formatOptions: {},
  /**
   * Unicode Private Use Area start.
   * http://en.wikipedia.org/wiki/Private_Use_(Unicode)
   */
  codepoints: {},
  startCodepoint: 0xf101,
  normalize: true,
  centerHorizontally: true,
};

const writeFile = (filePath: string, content: string | Buffer): void => {
  mkdirp.sync(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
};

const writeResult = (fonts: FontsResult, opts: Options): void => {
  const hashStr = calcHash(opts);
  opts.hashStr = hashStr;

  Object.keys(fonts).forEach(
    (key): void => {
      const filePath = path.join(
        opts.output as string,
        `${opts.fontName}${opts.hash ? `_${hashStr}` : ''}.${key}`
      );
      writeFile(filePath, fonts[key as FontType] as string | Buffer);
    }
  );

  if (opts.css.emit && opts.css.output) {
    const css = renderCss(opts, hashStr);
    let { output } = opts.css;

    // not a css file
    if (!/\.(css|scss)$/.test(output)) {
      output = path.join(output, `${opts.fontName}.css`);
    }

    writeFile(output, css);
  }

  if (opts.html.emit && opts.html.output) {
    const html = renderHtml(opts, hashStr);
    let { output } = opts.html;

    // not a html file
    if (!/\.(html|htm)?$/.test(output)) {
      output = path.join(output, `${opts.fontName}.html`);
    }

    writeFile(output, html);
  }
};

export default async (options: Partial<Options>): Promise<FontsResult> => {
  const opts = _.merge({}, DEFAULT_OPTIONS, options);

  if (!opts.output) {
    throw new Error(`Option "output" is ${opts.output}.`);
  }

  if (!opts.src) {
    throw new Error(`Option "src" is ${opts.src}.`);
  }

  const files = glob.sync(opts.src);

  if (!files || !files.length) {
    throw new Error('Option "src" is invalid.');
  }

  opts.files = files.filter((file): boolean => file.endsWith('.svg'));
  opts.names = opts.files.map(opts.rename);

  if (!opts.css.output) {
    opts.css.output = path.join(opts.output, `${opts.fontName}.css`);
  }

  if (!opts.html.output) {
    opts.html.output = path.join(opts.output, `${opts.fontName}.html`);
  }

  // Generates codepoints starting from `opts.startCodepoint`,
  // skipping codepoints explicitly specified in `opts.codepoints`
  let currentCodepoint = opts.startCodepoint;
  const codepointsValues = Object.values(opts.codepoints || {});
  const getNextCodepoint = (): number => {
    while (codepointsValues.indexOf(currentCodepoint) > -1) {
      currentCodepoint++;
    }
    return currentCodepoint++;
  };

  opts.names.forEach(
    (name: string): void => {
      if (!opts.codepoints[name]) {
        opts.codepoints[name] = getNextCodepoint();
      }
    }
  );

  // TODO output
  const result = await generateFonts(opts);

  if (opts.emit) {
    writeResult(result, opts);
  }

  // output css-generator
  result.generateCss = (urls: UrlMap): string => {
    return renderCss(opts, urls);
  };

  // expose the options
  result.options = opts;

  return result;
};

export const templates = TEMPLATES;
