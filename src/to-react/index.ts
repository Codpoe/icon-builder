import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as mkdirp from 'mkdirp';
import loadSvg from './load-svg';
import renderJsComponent from './render-js-component';
import renderTsComponent from './render-ts-component';
import { upperCamelCase } from '../utils';

import { ToReactOptions } from '../types/index';

export default async (opts: ToReactOptions): Promise<void> => {
  if (!opts.src) {
    throw new Error('src is invalid');
  }

  if (!opts.out) {
    throw new Error('out is invalid');
  }

  const icons = glob.sync(opts.src);

  if (!icons) {
    throw new Error('src is invalid');
  }

  mkdirp.sync(opts.out);

  const ext = opts.ts ? 'ts' : 'js';
  const iconNames = icons.map(
    (icon): string => {
      let name = path.basename(icon, '.svg');
      name = `Icon${name === 'github' ? 'GitHub' : upperCamelCase(name)}`;

      const $ = loadSvg(fs.readFileSync(icon, 'utf-8'));
      const component = opts.ts ? renderTsComponent($, name) : renderJsComponent($, name);

      fs.writeFileSync(path.join(opts.out, `${name}.${ext}x`), component, 'utf-8');
      return name;
    }
  );

  const exportAny = iconNames.map((name): string => `export * from './${name}';`).join('\n');

  fs.writeFileSync(path.join(opts.out, `index.${ext}`), `${exportAny}\n`, 'utf-8');
};
