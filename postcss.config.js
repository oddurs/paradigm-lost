const path = require('node:path');
const root = process.cwd();

module.exports = {
  plugins: {
    '@stylexswc/postcss-plugin': {
      include: [
        'app/**/*.{js,jsx,ts,tsx}',
        'components/**/*.{js,jsx,ts,tsx}',
        'design/**/*.{js,jsx,ts,tsx}',
        'data/**/*.{js,jsx,ts,tsx}',
        'engines/**/*.{js,jsx,ts,tsx}',
      ],
      rsOptions: {
        dev: process.env.NODE_ENV === 'development',
        treeshakeCompensation: true,
        aliases: { '@/*': [path.join(root, '*')] },
        unstable_moduleResolution: { type: 'commonJS', rootDir: root },
      },
    },
    autoprefixer: {},
  },
};
