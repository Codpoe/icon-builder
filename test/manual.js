/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const iconfont = require('../lib/index');

const out = 'test/temp';

if (fs.existsSync(out)) {
  fs.readdirSync(out)
    .map(file => path.join(out, file))
    .forEach(fs.unlinkSync);
} else {
  fs.mkdirSync(out);
}

const options = {
  fontName: 'manual',
  src: 'test/icons/*.svg',
  out,
  classPrefix: 'manual-icon-',
  html: { out: true },
};

(async () => {
  try {
    await iconfont.default(options);
    console.log('Done!');
  } catch (err) {
    console.log('Fail!', err);
  }
})();
