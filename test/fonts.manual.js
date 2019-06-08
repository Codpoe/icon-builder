/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { toFonts } = require('../lib/index');

const out = 'test/temp-fonts';

if (fs.existsSync(out)) {
  fs.readdirSync(out)
    .map(file => path.join(out, file))
    .forEach(fs.unlinkSync);
} else {
  fs.mkdirSync(out);
}

const options = {
  fontName: 'hello-world',
  src: 'test/icons/*.svg',
  out,
  classPrefix: 'hw-icon-',
  html: { out: true },
};

(async () => {
  try {
    await toFonts(options);
    console.log('Done!');
  } catch (err) {
    console.log('Fail!', err);
  }
})();
