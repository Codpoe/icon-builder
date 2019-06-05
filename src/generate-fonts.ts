import * as fs from 'fs';
import * as _ from 'lodash';
import SVGIcons2SVGFont from 'svgicons2svgfont';
import svg2ttf from 'svg2ttf';
import ttf2woff from 'ttf2woff';
import ttf2woff2 from 'ttf2woff2';
import ttf2eot from 'ttf2eot';

import { FontType, FontsResult, Gen } from './types/index';
import { ToFontsOptions } from './types/index';

/**
 * Generators for files of different font types.
 */
const gens: { [key in FontType]: Gen } = {
  svg: {
    async fn(opts: ToFontsOptions): Promise<string> {
      let svgContent = '';

      const svgOpts = _.pick(opts, [
        'fontName',
        // 'fixedWidth',
        'centerHorizontally',
        'normalize',
        'fontHeight',
        'round',
        'descent',
        'metadata',
      ]);

      return new Promise(
        (resolve, reject): void => {
          const fontStream = new SVGIcons2SVGFont({
            ...svgOpts,
            log(): void {},
          })
            .on(
              'data',
              (data: string): void => {
                svgContent += data;
              }
            )
            .on(
              'finish',
              (): void => {
                resolve(svgContent);
              }
            )
            .on(
              'error',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (err: any): void => {
                reject(err);
              }
            );

          opts.srcFiles.forEach(
            (file: string, index: number): void => {
              const glyph: any = fs.createReadStream(file); // eslint-disable-line @typescript-eslint/no-explicit-any
              const name = (opts.names as string[])[index];
              const unicode = String.fromCharCode(opts.codepoints[name]);
              // let ligature = '';

              // for (let i = 0; i < name.length; i++) {
              //   ligature += String.fromCharCode(name.charCodeAt(i));
              // }

              glyph.metadata = {
                name,
                unicode: [unicode],
              };

              fontStream.write(glyph);
            }
          );

          fontStream.end();
        }
      );
    },
  },

  // _svg: {
  //   fn(options: ToFontsOptions, done) {
  //     let font = new Buffer(0);
  //     let svgOptions = _.pick(options,
  //       'fontName', 'fontHeight', 'descent', 'normalize', 'round');

  //     if (options.formatOptions.svg) {
  //       svgOptions = _.extend(svgOptions, options.formatOptions.svg);
  //     }

  //     svgOptions.log = function () {};

  //     const fontStream = svgicons2svgfont(svgOptions)
  //       .on('data', (data) => {
  //         font = Buffer.concat([font, data]);
  //       })
  //       .on('end', () => {
  //         done(null, font.toString());
  //       });

  //     _.each(options.files, (file, idx) => {
  //       const glyph = fs.createReadStream(file);
  //       const name = options.names[idx];
  //       const unicode = String.fromCharCode(options.codepoints[name]);
  //       let ligature = '';
  //       for (let i = 0; i < name.length; i++) {
  //         ligature += String.fromCharCode(name.charCodeAt(i));
  //       }
  //       glyph.metadata = {
  //         name,
  //         unicode: [unicode, ligature],
  //       };
  //       fontStream.write(glyph);
  //     });

  //     fontStream.end();
  //   },
  // },

  ttf: {
    deps: ['svg'],
    async fn(opts: ToFontsOptions, depsFonts: (string | Buffer)[]): Promise<Buffer> {
      const font = svg2ttf(depsFonts[0] as string, opts.formatOptions.ttf);
      return Buffer.from(font.buffer);
    },
  },

  woff: {
    deps: ['ttf'],
    async fn(opts: ToFontsOptions, depsFonts: (string | Buffer)[]): Promise<Buffer> {
      const font = ttf2woff(new Uint8Array(depsFonts[0] as Buffer), opts.formatOptions.woff);
      return Buffer.from(font.buffer);
    },
  },

  woff2: {
    deps: ['ttf'],
    async fn(opts: ToFontsOptions, depsFonts: (string | Buffer)[]): Promise<Buffer> {
      const font = ttf2woff2(new Uint8Array(depsFonts[0] as Buffer), opts.formatOptions.woff2);
      return Buffer.from(font.buffer);
    },
  },

  eot: {
    deps: ['ttf'],
    async fn(opts: ToFontsOptions, depsFonts: (string | Buffer)[]): Promise<Buffer> {
      const font = ttf2eot(new Uint8Array(depsFonts[0] as Buffer), opts.formatOptions.eot);
      return Buffer.from(font.buffer);
    },
  },
};

/**
 * @returns Promise
 */
const generateFonts = async (opts: ToFontsOptions): Promise<FontsResult> => {
  const genTasks: Record<string, Promise<string | Buffer>> = {};

  /**
   * First, creates tasks for dependent font types.
   * Then creates task for specified font type and chains it to dependencies promises.
   * If some task already exists, it reuses it.
   */
  const makeGenTask = async (type: FontType): Promise<string | Buffer> => {
    if (genTasks[type]) {
      return genTasks[type];
    }

    const gen = gens[type];
    const depsTasks = gen.deps ? gen.deps.map(makeGenTask) : [];
    const depsFonts = await Promise.all(depsTasks);
    const task = gen.fn(opts, depsFonts);

    genTasks[type] = task;
    return task;
  };

  // Create all needed generate and write tasks.
  await Promise.all(opts.types.map(makeGenTask));

  const types = Object.keys(genTasks);
  const tasks = types.map((type): Promise<string | Buffer> => genTasks[type]);
  const result: FontsResult = {};

  (await Promise.all(tasks)).forEach(
    (item, index): void => {
      result[types[index] as FontType] = item;
    }
  );

  return result;
};

export default generateFonts;
