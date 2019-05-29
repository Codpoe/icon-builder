import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as prettier from 'prettier';

import renderCss from './renderCss';
import { Options } from './types/index';

const renderHtml = (opts: Options, hashStr?: string): string => {
  const source = fs.readFileSync(opts.html.template as string, 'utf8');
  const template = handlebars.compile(source);

  // Styles embedded in the html file should use default CSS template and
  // have path to fonts that is relative to html file location.
  const styles = renderCss(
    {
      ...opts,
      css: {
        ...opts.css,
        out: opts.html.out,
      },
    },
    hashStr
  );

  const ctx = {
    names: opts.names,
    fontName: opts.fontName,
    classPrefix: opts.classPrefix,
    styles: styles,
    ...opts.html.options,
  };
  return prettier.format(template(ctx), { parser: 'html', printWidth: 120 });
};

export default renderHtml;
