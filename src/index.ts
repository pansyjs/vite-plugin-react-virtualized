import type { PluginOption } from 'vite';
import { createRequire } from 'node:module';
import { URL } from 'node:url';
import { join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;

export function virtualized(): PluginOption {
  return {
    name: 'flat:react-virtualized',
    configResolved: async () => {
      // @ts-ignore
      const url = import.meta.url;
      const require = createRequire(url);
      const reactVirtualizedPath = require.resolve('react-virtualized');
      const { pathname: reactVirtualizedFilePath } = new URL(reactVirtualizedPath, url);
      const file = reactVirtualizedFilePath.replace(
        join('dist', 'commonjs', 'index.js'),
        join('dist', 'es', 'WindowScroller', 'utils', 'onScroll.js'),
      );
      const code = readFileSync(file, 'utf-8');
      const modified = code.replace(WRONG_CODE, '');
      writeFileSync(file, modified);
    },
  };
}
