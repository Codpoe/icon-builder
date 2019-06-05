import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as glob from 'glob';
import * as _ from 'lodash';

import generateFonts from './generate-fonts';
import renderCss from './render-css';
import renderHtml from './render-html';
import { calcHash } from './utils';

import { ToFontsOptions, FontsResult, FontType, UrlMap } from './types/index';

const TEMPLATES_DIR = path.join(__dirname, '../templates');
const TEMPLATES = {
  css: path.join(TEMPLATES_DIR, 'css.hbs'),
  html: path.join(TEMPLATES_DIR, 'html.hbs'),
};

const DEFAULT_OPTIONS: ToFontsOptions = {
  fontName: 'iconfont',
  fontHeight: 600,
  out: false,
  classPrefix: 'icon-',
  hash: true,
  srcFiles: [],
  outFiles: [],
  css: {
    out: true,
    template: TEMPLATES.css,
    options: {},
  },
  html: {
    out: false,
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

const writeFile = (filePath: string, content: string | Buffer, opts: ToFontsOptions): void => {
  mkdirp.sync(path.dirname(filePath));
  fs.writeFileSync(filePath, content);

  // record the absolute path of output file
  opts.outFiles.push(path.resolve(filePath));
};

const writeResult = (fonts: FontsResult, opts: ToFontsOptions): void => {
  const hashStr = calcHash(opts);
  opts.hashStr = hashStr;

  Object.keys(fonts).forEach(
    (key): void => {
      const filePath = path.join(opts.out as string, `${opts.fontName}${opts.hash ? `_${hashStr}` : ''}.${key}`);
      writeFile(filePath, fonts[key as FontType] as string | Buffer, opts);
    }
  );

  if (opts.css.out) {
    const css = renderCss(opts, hashStr);
    let out = opts.css.out as string;

    // not a css file
    if (!/\.(css|scss)$/.test(out)) {
      out = path.join(out, `${opts.fontName}.css`);
    }

    writeFile(out, css, opts);
  }

  if (opts.html.out) {
    const html = renderHtml(opts, hashStr);
    let out = opts.html.out as string;

    // not a html file
    if (!/\.(html|htm)?$/.test(out)) {
      out = path.join(out, `${opts.fontName}.html`);
    }

    writeFile(out, html, opts);
  }
};

export default async (options: Partial<ToFontsOptions>): Promise<FontsResult> => {
  const opts = _.merge({}, DEFAULT_OPTIONS, options);

  if (!opts.src) {
    throw new Error(`Option "src" is ${opts.src}.`);
  }

  const files = glob.sync(opts.src);

  if (!files || !files.length) {
    throw new Error('Option "src" is invalid.');
  }

  opts.srcFiles = files.filter((file): boolean => file.endsWith('.svg'));
  opts.names = opts.srcFiles.map(opts.rename);

  if (opts.out) {
    if (opts.css.out === true) {
      opts.css.out = path.join(opts.out, `${opts.fontName}.css`);
    }

    if (opts.html.out === true) {
      opts.html.out = path.join(opts.out, `${opts.fontName}.html`);
    }
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
    (name): void => {
      if (!opts.codepoints[name]) {
        opts.codepoints[name] = getNextCodepoint();
      }
    }
  );

  const result = await generateFonts(opts);

  if (opts.out) {
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
