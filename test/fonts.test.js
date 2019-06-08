import fs from 'fs';
import path from 'path';
import { toFonts } from '../lib/index';

describe('toFonts', () => {
  const SRC = path.join(__dirname, 'icons/*.svg');
  const OUT = path.join(__dirname, 'out');
  const TYPES = ['ttf', 'woff', 'woff2', 'eot', 'svg'];
  const FONT_NAME = 'my-icon';
  const OPTIONS = {
    src: SRC,
    out: OUT,
    fontName: FONT_NAME,
    types: TYPES,
  };
  const HTML_TEMPLATE = path.join(__dirname, 'templates/html.hbs');
  const CSS_TEMPLATE = path.join(__dirname, 'templates/css.hbs');
  const TEMPLATE_OPTIONS = { test: 'TEST' };
  const RENDERED_TEMPLATE = `custom template ${TEMPLATE_OPTIONS.test}`;

  // delete emitted file after test
  afterEach(() => {
    fs.readdirSync(OUT)
      .map(file => path.join(OUT, file))
      .forEach(fs.unlinkSync);
  });

  // delete dest dir
  afterAll(() => {
    fs.rmdirSync(OUT);
  });

  it('returns object with fonts and function generateCSS()', async () => {
    const result = await toFonts(OPTIONS);

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
    const { options } = await toFonts(OPTIONS);

    TYPES.forEach(type => {
      const file = path.join(OUT, `${FONT_NAME}_${options.hashStr}.${type}`);
      expect(fs.existsSync(file)).toBeTruthy(); // font file exists
      expect(fs.statSync(file).size).toBeGreaterThan(0); // font files is not empty
    });

    const cssFile = path.join(OUT, `${FONT_NAME}.css`);
    expect(fs.existsSync(cssFile)).toBeTruthy(); // css file exists
    expect(fs.statSync(cssFile).size).toBeGreaterThan(0); // css file is not empty

    // outFiles
    options.outFiles.forEach(file => {
      expect(fs.existsSync(file)).toBeTruthy();
      expect(fs.statSync(file).size).toBeGreaterThan(0);
    });
  });

  it('generates html file when options.html.out is true', async () => {
    const { options } = await toFonts({ ...OPTIONS, html: { out: true } });

    const htmlFile = path.resolve(OUT, `${FONT_NAME}.html`);
    expect(options.outFiles.indexOf(htmlFile)).toBeGreaterThanOrEqual(0);
    expect(fs.existsSync(htmlFile)).toBeTruthy(); // html file exists
    expect(fs.statSync(htmlFile).size).toBeGreaterThan(0); // html file is not empty
  });

  it('generates css file with custom name in other output', async () => {
    const cssFile = path.join(__dirname, 'out-2/your-icon.css');
    const { options } = await toFonts({ ...OPTIONS, css: { out: cssFile } });

    expect(options.outFiles.indexOf(path.resolve(cssFile))).toBeGreaterThanOrEqual(0);
    expect(fs.existsSync(cssFile)).toBeTruthy(); // html file exists
    expect(fs.statSync(cssFile).size).toBeGreaterThan(0); // html file is not empty
  });

  it('generates html file with custom name in other output', async () => {
    const htmlFile = path.join(__dirname, 'out-2/your-icon.html');

    const { options } = await toFonts({ ...OPTIONS, html: { out: htmlFile } });

    expect(options.outFiles.indexOf(path.resolve(htmlFile))).toBeGreaterThanOrEqual(0);
    expect(fs.existsSync(htmlFile)).toBeTruthy(); // html file exists
    expect(fs.statSync(htmlFile).size).toBeGreaterThan(0); // html file is not empty
  });

  it('function generateCss can change urls', async () => {
    const result = await toFonts(OPTIONS);
    const urls = {
      svg: 'AAA',
      ttf: 'BBB',
      woff: 'CCC',
      eot: 'DDD',
    };

    expect(result.generateCss(urls).indexOf('AAA')).toBeGreaterThan(-1);
  });

  it('gives error when "src" is invalid or length equals 0', async () => {
    const options = { ...OPTIONS, src: '' };

    expect.assertions(1);
    try {
      await toFonts(options);
    } catch (err) {
      expect(err.message).toMatch('src');
    }
  });

  it('uses codepoints and startCodepoint', async () => {
    const START_CODEPOINT = 0x40;
    const CODEPOINTS = {
      github: 0xff,
    };
    const options = {
      ...OPTIONS,
      codepoints: CODEPOINTS,
      startCodepoint: START_CODEPOINT,
    };

    const {
      options: { hashStr },
    } = await toFonts(options);

    const svg = fs.readFileSync(path.join(OUT, `${FONT_NAME}_${hashStr}.svg`), 'utf8');
    const isCodepointInSvg = codepoint => {
      return svg.indexOf(codepoint.toString(16).toUpperCase()) !== -1;
    };

    expect(isCodepointInSvg(START_CODEPOINT)).toBeTruthy(); // startCodepoint used
    // expect(isCodepointInSvg(START_CODEPOINT + 1)).toBeTruthy(); // startCodepoint incremented
    expect(isCodepointInSvg(CODEPOINTS.github)).toBeTruthy(); // codepoints used
  });

  it('uses custom css template', async () => {
    const options = {
      ...OPTIONS,
      css: {
        out: true,
        template: CSS_TEMPLATE,
        options: TEMPLATE_OPTIONS,
      },
    };

    await toFonts(options);
    const cssFile = fs.readFileSync(path.join(OUT, `${FONT_NAME}.css`), 'utf8');
    expect(cssFile).toMatch(RENDERED_TEMPLATE);
  });

  it('uses custom html template', async () => {
    const options = {
      ...OPTIONS,
      html: {
        out: true,
        template: HTML_TEMPLATE,
        options: TEMPLATE_OPTIONS,
      },
    };

    await toFonts(options);
    const htmlFile = fs.readFileSync(path.join(OUT, `${FONT_NAME}.html`), 'utf8');
    expect(htmlFile).toMatch(RENDERED_TEMPLATE);
  });
});
