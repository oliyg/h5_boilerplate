const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const config = {
    entry: path.resolve('src', 'index.js'),
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.styl']
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.(png|jpg|gif)$/i, // 大小限制内转 base64
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 10 * 1024
                    }
                }
            ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({ // 模板 html 文件插值
            title: 'Custom title',
            template: 'index.template.html'
        }),
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            _: 'lodash',
            $: 'jquery'
        })
    ]
}

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map'
        config.devServer = {
            contentBase: './dist',
            hot: true // 热更新
        }
        config.module.rules.push({
            test: /\.(styl)$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'stylus-loader'
            }]
        })
        config.plugins.push(new webpack.HotModuleReplacementPlugin()) // 热更新
    }
    if (argv.mode === 'production') {
        config.externals = { // 生产环境使用 CDN 避免打包
            lodash: '_',
            jquery: '$'
        }
        config.optimization = { // 单独打包 node_modules 模块
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                minChunks: 1,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module, chunks, chcheGroupKey) {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                            return `npm.${packageName.replace('@', '')}`
                        }
                    }
                }
            }
        }
        config.module.rules.push({
            test: /\.styl$/,
            use: [{
                loader: MiniCssExtractPlugin.loader // 提取 CSS 文件
            }, {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader'
            }, {
                loader: 'stylus-loader'
            }]
        })
        config.plugins.push(new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css'
        }))
        config.plugins.push(new webpack.HashedModuleIdsPlugin()) // 计算模块相对路径哈希
    }
    return config
}
