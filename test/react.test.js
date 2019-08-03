import fs from 'fs';
import path from 'path';
import { toReact } from '../src/index';

describe('toReact', () => {
  const src = path.join(__dirname, 'icons/*.svg');
  const out = path.join(__dirname, 'out-react');

  // delete emitted file after test
  afterEach(() => {
    fs.readdirSync(out)
      .map(file => path.join(out, file))
      .forEach(fs.unlinkSync);
  });

  // delete dest dir
  afterAll(() => {
    fs.rmdirSync(out);
  });

  it('coverts svg icons to react components', async () => {
    await toReact({ src, out });
  });

  it('gives error when "src" or "out" is invalid', async () => {
    try {
      await toReact({ src: undefined, out });
    } catch (err) {
      expect(err.message).toMatch('src');
    }

    try {
      await toReact({ src, out: undefined });
    } catch (err) {
      expect(err.message).toMatch('out');
    }
  });
});
