declare module 'merge' {
  function merge<A extends Record<string, any>>(a: A): A;
  function merge<A extends Record<string, any>, B>(a: A, b: B): A & B;
  function merge<A extends Record<string, any>, B, C>(
    a: A,
    b: B,
    c: C
  ): A & B & C;
  function merge<A extends Record<string, any>, B, C, D>(
    a: A,
    b: B,
    c: C,
    d: D
  ): A & B & C & D;
  function merge<A extends Record<string, any>, B, C, D, E>(
    a: A,
    b: B,
    c: C,
    d: D,
    e: E
  ): A & B & C & D & E;

  function merge<A extends Record<string, any>>(recursive: boolean, a: A): A;
  function merge<A extends Record<string, any>, B>(
    recursive: boolean,
    a: A,
    b: B
  ): A & B;
  function merge<A extends Record<string, any>, B, C>(
    recursive: boolean,
    a: A,
    b: B,
    c: C
  ): A & B & C;
  function merge<A extends Record<string, any>, B, C, D>(
    recursive: boolean,
    a: A,
    b: B,
    c: C,
    d: D
  ): A & B & C & D;
  function merge<A extends Record<string, any>, B, C, D, E>(
    recursive: boolean,
    a: A,
    b: B,
    c: C,
    d: D,
    e: E
  ): A & B & C & D & E;

  namespace merge {
    function recursive<A extends Record<string, any>>(a: A): A;
    function recursive<A extends Record<string, any>, B>(a: A, b: B): A & B;
    function recursive<A extends Record<string, any>, B, C>(
      a: A,
      b: B,
      c: C
    ): A & B & C;
    function recursive<A extends Record<string, any>, B, C, D>(
      a: A,
      b: B,
      c: C,
      d: D
    ): A & B & C & D;
    function recursive<A extends Record<string, any>, B, C, D, E>(
      a: A,
      b: B,
      c: C,
      d: D,
      e: E
    ): A & B & C & D & E;
  }

  export = merge;
}

declare module 'svgicons2svgfont';
declare module 'svg2ttf';
declare module 'ttf2woff';
declare module 'ttf2woff2';
declare module 'ttf2eot';
