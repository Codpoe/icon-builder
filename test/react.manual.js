/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { toReact } = require('../lib/index');

const out = 'test/temp-react';

if (fs.existsSync(out)) {
  fs.readdirSync(out)
    .map(file => path.join(out, file))
    .forEach(fs.unlinkSync);
} else {
  fs.mkdirSync(out);
}

(async () => {
  try {
    await toReact({ src: 'test/icons/*.svg', out, ts: true });
    console.log('Done!'); // eslint-disable-line no-console
  } catch (err) {
    console.log('Fail!', err); // eslint-disable-line no-console
  }
})();
