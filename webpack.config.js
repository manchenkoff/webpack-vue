const path                      = require('path');
const MiniCssExtractPlugin      = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin   = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin         = require('copy-webpack-plugin');
const ImageminPlugin            = require('imagemin-webpack-plugin').default;

module.exports = {
    // base source path
    context: path.resolve(__dirname, 'src'),

    // entry file names to compile
    entry: {
        app: [
            './js/main.js',
            './scss/main.scss'
        ]
    },

    // compiled files path
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: "../"
    },

    // enable source maps
    devtool: 'inline-source-map',

    // directory for starting webpack dev server
    devServer: {
        contentBase: './'
    },

    // connect other plugins
    plugins: [
        new MiniCssExtractPlugin({filename: "./css/[name].css"}),
        new CopyWebpackPlugin([{from: './img/static/', to: './img/static/'}]),
        new ImageminPlugin({ test: /\.(jpe?g|png|gif)$/i })
    ],

    // optimizing configuration
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
        ]
    },

    // setting up file extensions handlers
    module: {
        rules: [
            // Styles loader
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            // Image loader (for styles)
            {
                test: /\.(png|jpe?g|gif)$/,
                loaders: [
                    {
                        loader: 'file-loader',
                        options: {name: '[path][name].[ext]'},
                    },
                    {
                        loader: 'img-loader',
                        options: {
                            plugins: [
                                require('imagemin-gifsicle')({
                                    interlaced: false
                                }),
                                require('imagemin-mozjpeg')({
                                    progressive: true,
                                    arithmetic: false
                                }),
                                require('imagemin-pngquant')({
                                    floyd: 0.5,
                                    speed: 2
                                }),
                                require('imagemin-svgo')({
                                    plugins: [
                                        {removeTitle: true},
                                        {convertPathData: false}
                                    ]
                                })
                            ]
                        }
                    }
                ]
            },
            // SVG converter into 'data:image'
            {
                test: /\.svg$/,
                loader: 'svg-url-loader',
            },
        ]
    }
};