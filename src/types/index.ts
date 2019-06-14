export type FontType = 'svg' | 'eot' | 'woff' | 'woff2' | 'ttf';

export interface FormatOptions {
  svg?: object;
  ttf?: object;
  woff?: object;
  woff2?: object;
  eot?: object;
}

export interface ToFontsOptions {
  src?: string;
  out: string | false;
  srcFiles: string[];
  outFiles: string[];
  fontName: string;
  fontHeight: number;
  classPrefix: string;
  hash: boolean;
  hashStr?: string;
  css: {
    out: string | boolean;
    template: string;
    options?: object;
  };
  html: {
    out: string | boolean;
    template: string;
    options?: object;
  };
  types: FontType[];
  names?: string[];
  formatOptions: FormatOptions;
  startCodepoint: number;
  codepoints: { [index: string]: number };
  normalize: boolean;
  centerHorizontally: boolean;
  rename: (file: string) => string;
}

export interface FontsResult {
  svg?: string;
  eot?: Buffer;
  woff?: Buffer;
  woff2?: Buffer;
  ttf?: Buffer;
  generateCss?: (urlMap: UrlMap) => string;
  options?: ToFontsOptions;
}

export interface Gen {
  deps?: FontType[];
  fn: (options: ToFontsOptions, depsFonts: (string | Buffer)[]) => Promise<string | Buffer>;
}

export type UrlTemplate = (opts: { url: string; fontName?: string }) => string;

export type UrlMap = Partial<{ [index in FontType]: string }>;

export interface ToReactOptions {
  src: string;
  out: string;
  ts: boolean;
}
