module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
      },
    ],
  ],
};
