import * as fs from 'fs';
import * as handlebars from 'handlebars';

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
        output: opts.html.output,
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
  return template(ctx);
};

export default renderHtml;
