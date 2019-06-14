import * as cheerio from 'cheerio';
import { camelCase } from '../utils';

export default (svg: string): CheerioStatic => {
  svg = svg.replace(/<!--.*-->/, '');

  const $ = cheerio.load(svg, { xmlMode: true });

  $('*').each(
    (index, el): void => {
      Object.keys(el.attribs).forEach(
        (name): void => {
          if (name.includes('-')) {
            $(el)
              .attr(camelCase(name), el.attribs[name])
              .removeAttr(name);
          }

          if (name.includes('xmlns:')) {
            $(el).removeAttr(name);
          }

          if (name === 'stroke') {
            $(el).attr(name, 'currentColor');
          }
        }
      );

      if (el.name === 'svg') {
        $(el).attr('restProps', '...');
      }

      if (el.name === 'title' || el.name === 'desc') {
        $(el).remove();
      }
    }
  );

  return $;
};
