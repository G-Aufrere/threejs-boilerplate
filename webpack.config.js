const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: {
        bundle: path.resolve(__dirname, 'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][contenthash].js',
        clean: true,
        assetModuleFilename: '[name][ext]',
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            //{
            //    test: /\.scss$/,
            //    use: ['style-loader', 'css-loader', 'sass-loader'],
            //},
            {
                test: /\.scss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: ''
                    }
                },
                {
                    loader: 'css-loader',

                },
                {
                    loader: 'postcss-loader',

                },
                {
                    loader: 'sass-loader',

                },
                ]
            },

            {
                test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
                loader: 'file-loader',
                options: {
                    name(file) {
                        return '[hash].[ext]'
                    }
                }
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },

            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },

            {
                test: /\.(glsl|frag|vert)$/,
                loader: 'raw-loader',
                exclude: /node_modules/
            },

            {
                test: /\.(glsl|frag|vert)$/,
                loader: 'glslify-loader',
                exclude: /node_modules/
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Webpack app',
            filename: 'index.html',
            template: 'src/template.html',
        }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),

        new CleanWebpackPlugin()
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            ["gifsicle", {
                                interlaced: true
                            }],
                            ["jpegtran", {
                                progressive: true
                            }],
                            ["optipng", {
                                optimizationLevel: 5
                            }],
                        ],
                    },
                },
            }),
        ]
    },
}