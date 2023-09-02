const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {transpileOnly: true}
                }
            },
            {
                test: /\.scss$/, // Match .scss files
                use: [
                  'style-loader',  // Inject styles into the DOM
                  'css-loader',    // Handles the import and resolution of CSS
                  'sass-loader',   // Transpile Sass to CSS
                ],
              },
        ]
    },
    plugins : [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new ForkTsCheckerWebpackPlugin(),
    ],
    devServer: {
        historyApiFallback: true,
      },

}