import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { Options } from './types/index';

export const cleanDir = (dirPath: string, shouldRmdir = false): void => {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  fs.readdirSync(dirPath)
    .map((file): string => path.join(dirPath, file))
    .forEach(fs.unlinkSync);

  shouldRmdir && fs.rmdirSync(dirPath);
};

/**
 * Caclulates hash based on options and source SVG files
 */
export const calcHash = (opts: Options): string => {
  const hash = crypto.createHash('md5');
  opts.srcFiles.forEach(
    (file): void => {
      hash.update(fs.readFileSync(file, 'utf8'));
    }
  );
  hash.update(JSON.stringify(opts));
  return hash.digest('hex');
};
