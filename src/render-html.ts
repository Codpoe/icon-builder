import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as prettier from 'prettier';

import renderCss from './render-css';
import { ToFontsOptions } from './types/index';

const renderHtml = (opts: ToFontsOptions): string => {
  const source = fs.readFileSync(opts.html.template as string, 'utf8');
  const template = handlebars.compile(source);
  
  const codepoints: { [key: string]: string } = {};
  // Transform codepoints to hex strings
  Object.keys(opts.codepoints).forEach((name): void => {
    codepoints[name] = opts.codepoints[name].toString(16);
  });

  // Styles embedded in the html file should use default CSS template and
  // have path to fonts that is relative to html file location.
  const styles = renderCss({
    ...opts,
    css: {
      ...opts.css,
      out: opts.html.out,
    },
  });

  const ctx = {
    codepoints,
    names: opts.names,
    fontName: opts.fontName,
    classPrefix: opts.classPrefix,
    styles: styles,
    ...opts.html.options,
  };
  return prettier.format(template(ctx), { parser: 'html', printWidth: 120 });
};

export default renderHtml;
