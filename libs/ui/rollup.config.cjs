const { withNx } = require('@nx/rollup/with-nx');
const url = require('@rollup/plugin-url');
const svg = require('@svgr/rollup');

module.exports = withNx(
  {
    main: './src/index.ts',
    outputPath: '../../dist/libs/ui',
    tsConfig: './tsconfig.lib.json',
    compiler: 'babel',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    format: ['esm'],
    assets: [
      { input: __dirname, output: '.', glob: 'README.md' },
      { input: `${__dirname}/src`, output: '.', glob: 'styles.css' },
      {
        input: `${__dirname}/src/styles`,
        output: 'styles',
        glob: '*.css',
      },
    ],
  },
  {
    // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
    plugins: [
      svg({
        svgo: false,
        titleProp: true,
        ref: true,
      }),
      url({
        limit: 10000, // 10kB
      }),
    ],
  },
);
