const fs = require('fs');
const path = require('path');
const iconfont = require('../lib/index');

const output = 'test/temp';

if (fs.existsSync(output)) {
  fs.readdirSync(output)
    .map(file => path.join(output, file))
    .forEach(fs.unlinkSync);
} else {
  fs.mkdirSync(output);
}

const options = {
  src: 'test/icons/*.svg',
  output,
  fontName: 'manual',
  classPrefix: 'manual-icon-',
  html: { emit: true },
};

(async () => {
  try {
    await iconfont.default(options);
    console.log('Done!');
  } catch (err) {
    console.log('Fail!', err);
  }
})();
