const { whenDev, whenProd } = require('@craco/craco')
// const CircularDependencyPlugin = require('circular-dependency-plugin')
const CracoEsbuildPlugin = require('craco-esbuild')
const Dotenv = require('dotenv-webpack')
const path = require('path')
const webpack = require('webpack')
const gitLastCommitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim()

module.exports = {
  plugins: [
    {
      plugin: CracoEsbuildPlugin, // https://github.com/pradel/create-react-app-esbuild/blob/main/packages/craco-esbuild/README.md
      options: {
        esbuildLoaderOptions: {
          loader: 'tsx',
          target: 'ESNext',
        },
        esbuildMinimizerOptions: {
          target: 'ESNext',
          css: true, // if true, OptimizeCssAssetsWebpackPlugin will also be replaced by esbuild.
        },
        skipEsbuildJest: false,
        esbuildJestOptions: {
          loaders: {
            '.ts': 'ts',
            '.tsx': 'tsx',
          },
        },
      },
    }
  ],
  webpack: {
    alias: {
      '~': path.resolve(__dirname, 'src/')
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.ignoreWarnings = [{ module: /node_modules*/, }]

      webpackConfig.resolve.fallback = {
        crypto: false,
        fs: false,
        os: false,
        stream: false
      }

      whenDev(() => {
        webpackConfig.devtool = 'eval-source-map'
      })

      whenProd(() => {
        webpackConfig.devtool = false
      })

      return webpackConfig
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({ React: 'react' }),
        new webpack.DefinePlugin({
          'process.env.GIT_LAST_COMMIT_HASH': JSON.stringify(gitLastCommitHash),
          'process.env.IS_STORYBOOK': false
        }),
        new Dotenv({ ignoreStub: true }),
        ...whenDev(() => [
          // TODO: Analyze this before production
          // new CircularDependencyPlugin({
          //   allowAsyncCycles: false,
          //   cwd: process.cwd(),
          //   include: /src/,
          //   exclude: /a\.js|node_modules/,
          //   onStart({ compilation }) {
          //     console.log('Start detecting webpack modules cycles')
          //   },
          //   onDetected({ module: webpackModuleRecord, paths, compilation }) {
          //     // `paths` will be an Array of the relative module paths that make up the cycle
          //     // `module` will be the module record generated by webpack that caused the cycle
          //     compilation.errors.push(new Error(paths.join(' --> ')))
          //   },
          //   onEnd({ compilation }) {
          //     console.log('Finish detecting webpack modules cycles')
          //   }
          // })
        ], [])
      ]
    }
  }
}
