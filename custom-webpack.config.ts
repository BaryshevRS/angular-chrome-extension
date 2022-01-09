import type { Configuration } from 'webpack';

module.exports = {
  entry: {
    background: 'src/extension/background.ts',
    content: 'src/extension/content.ts'
  },
} as Configuration;
