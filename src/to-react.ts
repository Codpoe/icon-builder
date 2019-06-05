import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as camelcase from 'camelcase';
import * as uppercamelcase from 'uppercamelcase';
import * as cheerio from 'cheerio';
import * as prettier from 'prettier';

import { ToReactOptions } from './types/index';

const initialTypeDefinitions = `/// <reference types="react" />
import { ComponentType, SVGAttributes } from 'react';
interface Props extends SVGAttributes<SVGElement> {
  color?: string;
  size?: string | number;
}
type Icon = ComponentType<Props>;
`;

const parseSvg = (svg: string): CheerioStatic => {
  svg = svg.replace(/<!--.*-->/, '');

  const $ = cheerio.load(svg, { xmlMode: true });

  $('*').each(
    (index, el): void => {
      Object.keys(el.attribs).forEach(
        (name): void => {
          if (name.includes('-')) {
            $(el)
              .attr(camelcase(name), el.attribs[name])
              .removeAttr(name);
          }

          if (name === 'stroke') {
            $(el).attr(name, 'currentColor');
          }
        }
      );

      if (el.name === 'svg') {
        $(el).attr('otherProps', '...');
      }
    }
  );

  return $;
};

const getComponent = ($: CheerioStatic, componentName: string): string => {
  const component = `
    import React from 'react';
    import PropTypes from 'prop-types';
    const ${componentName} = (props) => {
      const { color, size, ...otherProps } = props;
      return (
        ${$('svg')
          .toString()
          .replace(new RegExp('stroke="currentColor"', 'g'), 'stroke={color}')
          .replace('width="24"', 'width={size}')
          .replace('height="24"', 'height={size}')
          .replace('otherProps="..."', '{...otherProps}')}
      )
    };
    ${componentName}.propTypes = {
      color: PropTypes.string,
      size: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
    }
    ${componentName}.defaultProps = {
      color: 'currentColor',
      size: '24',
    }
    export default ${componentName}
  `;

  return prettier.format(component, {
    singleQuote: true,
    trailingComma: 'es5',
    bracketSpacing: true,
    parser: 'flow',
  });
};

export default async (opts: ToReactOptions): Promise<void> => {
  const icons = glob.sync(opts.src);

  if (!icons) {
    throw new Error('src is invalid');
  }

  const indexPath = path.join(opts.out, 'index.js');
  const indexTypePath = path.join(opts.out, 'index.d.ts');

  fs.writeFileSync(indexPath, '', 'utf-8');
  fs.writeFileSync(indexTypePath, initialTypeDefinitions, 'utf-8');

  icons.forEach(
    (icon): void => {
      let name = path.basename(icon, '.svg');
      name = name === 'github' ? 'GitHub' : uppercamelcase(name);

      const $ = parseSvg(fs.readFileSync(icon, 'utf-8'));
      const component = getComponent($, name);
      const exportStr = `export ${name} from './icons/${name}';\r\n`;
      const exportTypeStr = `export const ${name}: Icon;\n`;

      fs.writeFileSync(path.join(opts.out, `${name}.js`), component, 'utf-8');
      fs.appendFileSync(indexPath, exportStr, 'utf-8');
      fs.appendFileSync(indexTypePath, exportTypeStr, 'utf-8');
    }
  );
};
