// import plugins
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

/**
 * Base webpack configuration
 *
 * @param env -> env parameters
 * @param argv -> CLI arguments, 'argv.mode' is the current webpack mode (development | production)
 * @returns object
 */
module.exports = (env, argv) => {
    return {
        // absolute path to the base directory
        context: path.resolve(__dirname, "src"),

        // entry files to compile (relative to the base dir)
        entry: [
            "./js/app.js",
            "./scss/app.scss",
        ],

        // enable development source maps
        // * will be overwritten by 'source-maps' in production mode
        devtool: "inline-source-map",

        // path to store compiled JS bundle
        output: {
            // bundle relative name
            filename: "js/app.js",
            // base build directory
            path: path.resolve(__dirname, "dist"),
            // path to build relative asset links
            publicPath: "../"
        },

        // plugins configurations
        plugins: [
            // clean 'dist' directory
            new CleanWebpackPlugin(),

            // save compiled SCSS into separated CSS file
            new MiniCssExtractPlugin({
                filename: "css/style.css"
            }),

            // copy static assets directory
            new CopyPlugin([
                {from: 'static', to: 'static'}
            ]),

            // image optimization
            new ImageminPlugin({
                // disable for dev builds
                disable: argv.mode !== 'production',
                test: /\.(jpe?g|png|gif)$/i,
                pngquant: {quality: '70-85'},
                optipng: {optimizationLevel: 9}
            }),
        ],

        // production mode optimization
        optimization: {
            minimizer: [
                // CSS optimizer (JS optimized by default)
                new OptimizeCSSAssetsPlugin(),
            ],
        },

        // custom loaders configuration
        module: {
            rules: [
                // styles loader
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader"
                    ],
                },

                // images loader
                {
                    test: /\.(png|jpe?g|gif)$/,
                    loaders: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "img/[name].[ext]"
                            }
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                disable: argv.mode !== 'production',
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                },
                                pngquant: {
                                    quality: '65-90',
                                    speed: 4
                                },
                                optipng: {enabled: false},
                                gifsicle: {interlaced: false},
                                webp: {quality: 75}
                            }
                        },
                    ],
                },

                // fonts loader
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "fonts/[name].[ext]"
                            }
                        },
                    ],
                },

                // svg inline 'data:image' loader
                {
                    test: /\.svg$/,
                    loader: "svg-url-loader"
                },
            ]
        },
    };
};