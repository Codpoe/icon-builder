import fs from 'fs';
import path from 'path';
import iconfont from '../lib/index';

describe('iconfont', () => {
  const SRC = path.join(__dirname, 'icons/*.svg');
  const OUTPUT = path.join(__dirname, 'output');
  const TYPES = ['ttf', 'woff', 'woff2', 'eot', 'svg'];
  const FONT_NAME = 'my-icon';
  const OPTIONS = {
    src: SRC,
    output: OUTPUT,
    fontName: FONT_NAME,
    types: TYPES,
  };
  const TEMPLATE = path.join(__dirname, 'custom-template.hbs');
  const TEMPLATE_OPTIONS = { test: 'TEST' };
  const RENDERED_TEMPLATE = `custom template ${TEMPLATE_OPTIONS.test}\n`;

  // delete emitted file after test
  afterEach(() => {
    fs.readdirSync(OUTPUT)
      .map(file => path.join(OUTPUT, file))
      .forEach(fs.unlinkSync);
  });

  // delete dest dir
  afterAll(() => {
    fs.rmdirSync(OUTPUT);
  });

  it('returns object with fonts and function generateCSS()', async () => {
    const result = await iconfont(OPTIONS);

    expect(result).toHaveProperty('svg');
    expect(result).toHaveProperty('ttf');
    expect(result).toHaveProperty('woff');
    expect(result).toHaveProperty('woff2');
    expect(result).toHaveProperty('eot');

    expect(typeof result.generateCss).toBe('function');
    expect(typeof result.generateCss()).toBe('string');
    expect(typeof result.options).toBe('object');
  });

  it('generates all fonts and css files', async () => {
    const { options } = await iconfont(OPTIONS);

    TYPES.forEach(type => {
      const file = path.join(OUTPUT, `${FONT_NAME}_${options.hashStr}.${type}`);
      expect(fs.existsSync(file)).toBeTruthy(); // font file exists
      expect(fs.statSync(file).size).toBeGreaterThan(0); // font files is not empty
    });

    // for (const i in TYPES) {
    //   const type = TYPES[i];
    //   const filename = `${FONT_NAME}.${type}`;
    //   const filepath = path.join(OUTPUT, filename);
    //   assert(destFiles.indexOf(filename) !== -1, `${type} file exists`);
    //   assert(fs.statSync(filepath).size > 0, `${type} file is not empty`);

    //   const DETECTABLE = ['ttf', 'woff', 'woff2', 'eot'];
    //   if (_.contains(DETECTABLE, type)) {
    //     const chunk = readChunk.sync(filepath, 0, 262);
    //     const filetype = getFileType(chunk);
    //     assert.equal(type, filetype && filetype.ext, 'ttf filetype is correct');
    //   }
    // }

    const cssFile = path.join(OUTPUT, `${FONT_NAME}.css`);
    expect(fs.existsSync(cssFile)).toBeTruthy(); // css file exists
    expect(fs.statSync(cssFile).size).toBeGreaterThan(0); // css file is not empty

    // const htmlFile = path.join(OUTPUT, `${FONT_NAME}.html`);
    // expect(fs.existsSync(htmlFile)).toBeFalsy(); // html not exists
  });

  it('generates html file when options.html.emit is true', async () => {
    await iconfont({ ...OPTIONS, html: { emit: true } });

    const htmlFile = path.join(OUTPUT, `${FONT_NAME}.html`);
    expect(fs.existsSync(htmlFile)).toBeTruthy(); // html file exists
    expect(fs.statSync(htmlFile).size).toBeGreaterThan(0); // html file is not empty
  });

  it('generates css file with custom name in other output', async () => {
    const cssFile = path.join(__dirname, 'output-2/your-icon.css');

    await iconfont({ ...OPTIONS, css: { emit: true, output: cssFile } });

    expect(fs.existsSync(cssFile)).toBeTruthy(); // html file exists
    expect(fs.statSync(cssFile).size).toBeGreaterThan(0); // html file is not empty
  });

  it('generates html file with custom name in other output', async () => {
    const htmlFile = path.join(__dirname, 'output-2/your-icon.html');

    await iconfont({ ...OPTIONS, html: { emit: true, output: htmlFile } });

    expect(fs.existsSync(htmlFile)).toBeTruthy(); // html file exists
    expect(fs.statSync(htmlFile).size).toBeGreaterThan(0); // html file is not empty
  });

  it('function generateCss can change urls', async () => {
    const result = await iconfont(OPTIONS);
    const urls = {
      svg: 'AAA',
      ttf: 'BBB',
      woff: 'CCC',
      eot: 'DDD',
    };

    expect(result.generateCss(urls).indexOf('AAA')).toBeGreaterThan(-1);
  });

  it('gives error when "output" is invalid', async () => {
    const options = { ...OPTIONS, output: '' };

    expect.assertions(1);
    try {
      await iconfont(options);
    } catch (err) {
      expect(err.message).toMatch('output');
    }
  });

  it('gives error when "src" is invalid or length equals 0', async () => {
    const options = { ...OPTIONS, src: '' };

    expect.assertions(1);
    try {
      await iconfont(options);
    } catch (err) {
      expect(err.message).toMatch('src');
    }
  });

  it('uses codepoints and startCodepoint', async () => {
    const START_CODEPOINT = 0x40;
    const CODEPOINTS = {
      close: 0xff,
    };
    const options = {
      ...OPTIONS,
      codepoints: CODEPOINTS,
      startCodepoint: START_CODEPOINT,
    };

    const {
      options: { hashStr },
    } = await iconfont(options);

    const svg = fs.readFileSync(
      path.join(OUTPUT, `${FONT_NAME}_${hashStr}.svg`),
      'utf8'
    );
    const isCodepointInSvg = codepoint => {
      return svg.indexOf(codepoint.toString(16).toUpperCase()) !== -1;
    };

    expect(isCodepointInSvg(START_CODEPOINT)).toBeTruthy(); // startCodepoint used
    // expect(isCodepointInSvg(START_CODEPOINT + 1)).toBeTruthy(); // startCodepoint incremented
    expect(isCodepointInSvg(CODEPOINTS.close)).toBeTruthy(); // codepoints used
  });

  it('uses custom css template', async () => {
    const options = {
      ...OPTIONS,
      css: {
        emit: true,
        template: TEMPLATE,
        options: TEMPLATE_OPTIONS,
      },
    };

    await iconfont(options);
    const cssFile = fs.readFileSync(
      path.join(OUTPUT, `${FONT_NAME}.css`),
      'utf8'
    );
    expect(cssFile).toBe(RENDERED_TEMPLATE);
  });

  it('uses custom html template', async () => {
    const options = {
      ...OPTIONS,
      html: {
        emit: true,
        template: TEMPLATE,
        options: TEMPLATE_OPTIONS,
      },
    };

    await iconfont(options);
    const htmlFile = fs.readFileSync(
      path.join(OUTPUT, `${FONT_NAME}.html`),
      'utf8'
    );
    expect(htmlFile).toBe(RENDERED_TEMPLATE);
  });

  // describe('scss template', () => {
  //   const TEST_SCSS_SINGLE = path.join(__dirname, 'scss', 'singleFont.scss');
  //   const TEST_SCSS_MULTIPLE = path.join(__dirname, 'scss', 'multipleFonts.scss');

  //   it('creates mixins that can be used to create icons styles', async () => {
  //     const OUTPUT_CSS = path.join(OUTPUT, `${FONT_NAME}.scss`);
  //     const options = _.extend({}, OPTIONS, {
  //       cssTemplate: genIcon.templates.scss,
  //       cssDest: OUTPUT_CSS,
  //     });

  //     await genIcon(options);
  //     const rendered = sass.renderSync({
  //       file: TEST_SCSS_SINGLE,
  //     });
  //     const css = rendered.css.toString();
  //     expect(css.indexOf(FONT_NAME)).toBeGreaterThan(-1);
  //   });

  //   it('multiple scss mixins can be used together', async () => {
  //     const FONT_NAME_2 = `${FONT_NAME}2`;
  //     const OUTPUT_CSS = path.join(OUTPUT, `${FONT_NAME}.scss`);
  //     const OUTPUT_CSS_2 = path.join(OUTPUT, `${FONT_NAME_2}.scss`);

  //     const options1 = _.extend({}, OPTIONS, {
  //       cssTemplate: genIcon.templates.scss,
  //       cssDest: OUTPUT_CSS,
  //       files: [path.join(SRC, 'close.svg')],
  //     });
  //     const options2 = _.extend({}, OPTIONS, {
  //       fontName: FONT_NAME_2,
  //       cssTemplate: genIcon.templates.scss,
  //       cssDest: OUTPUT_CSS_2,
  //       files: [path.join(SRC, 'back.svg')],
  //     });

  //     const generate1 = Q.nfcall(genIcon, options1);
  //     const generate2 = Q.nfcall(genIcon, options2);

  //     await Q.all([generate1, generate2]);
  //     const rendered = sass.renderSync({
  //       file: TEST_SCSS_MULTIPLE,
  //     });
  //     const css = rendered.css.toString();
  //     expect(css.indexOf(FONT_NAME)).toBeGreaterThan(-1);
  //     expect(css.indexOf(FONT_NAME_2)).toBeGreaterThan(-1);
  //   });
  // });
});
