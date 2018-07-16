'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const targetPath = path.resolve(__dirname, './server/dist');

module.exports = {
    entry: './server/index.js',
    target: 'node',
    node: false,
    mode: 'development',
    devtool: 'source-map',
    output: {
        path: targetPath,
        filename: 'index.js'
    },
    plugins: [
        new webpack.DefinePlugin({'global.GENTLY': false}),
        new CopyWebpackPlugin(
            [
                {from: 'package.json', to: targetPath},
                {from: 'package-lock.json', to: targetPath}
            ],
            {}
        )
    ],
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src')
        }
    }
};
