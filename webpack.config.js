const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.tsx', // Entry point for your application
    module: {
        rules: [
            {
                test: /\.tsx?$/, // Match both .ts and .tsx files
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.jsx?$/, // Match .js and .jsx files
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.module\.scss$/, // Match only .module.scss files for SCSS modules
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]__[hash:base64:5]', // Custom naming convention for class names
                                namedExport: false,
                            },
                            importLoaders: 1,
                            sourceMap: true,
                        },
                    },
                    'sass-loader',
                ],
                generator: {
                    filename: "bundle.css",
                },
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/, // Match regular .scss files (non-modular)
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                generator: {
                    filename: "bundle.css",
                },
                exclude: /\.module\.scss$/, // Exclude files that are SCSS modules
            },
            {
                test: /\.module\.css$/, // Match only .module.css files for CSS modules
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]__[hash:base64:5]', // Custom naming convention for class names
                                namedExport: false,
                            },
                            importLoaders: 1,
                            sourceMap: true,
                        },
                    },
                ],
                generator: {
                    filename: "bundle.css",
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/, // Match regular .css files (non-modular)
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                generator: {
                    filename: "bundle.css",
                },
                exclude: /\.module\.css$/, // Exclude files that are CSS modules
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i, // Match image files
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]', // Output path for images
                },
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg)$/, // Match font files
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]', // Output path for fonts
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'], // Resolve these extensions
    },
    output: {
        filename: 'bundle.js', // Output filename
        path: path.resolve(__dirname, 'dist'), // Output path
        clean: true, // Clean the output directory before each build
    },
    mode: 'development', // Can be 'development' or 'production'
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // Path to your HTML template
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css', // Output filename for CSS
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'), // Serve files from the dist directory
        },
        compress: true, // Enable gzip compression for everything served
        port: 9000, // Port to run the development server on
        open: true, // Automatically open the browser when the server starts
        hot: true, // Enable Hot Module Replacement (HMR)
    },
};
