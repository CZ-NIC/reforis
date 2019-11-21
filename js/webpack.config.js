/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => ({
    mode: "development",
    entry: "./src/app.js",
    output: {
        filename: "app.min.js",
        path: path.join(__dirname, "../reforis_static/reforis/js"),
    },
    resolve: {
        modules: [
            path.resolve(__dirname, "./src"),
            path.resolve(__dirname, "./node_modules"),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: require.resolve("immutability-helper"),
                use: [{ loader: "expose-loader", options: "immutability-helper" }],
            },
            {
                test: require.resolve("prop-types"),
                use: [{ loader: "expose-loader", options: "PropTypes" }],
            },
            {
                test: require.resolve("react"),
                use: [{ loader: "expose-loader", options: "React" }],
            },
            {
                test: require.resolve("react-dom"),
                use: [{ loader: "expose-loader", options: "ReactDOM" }],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.LIGHTTPD": JSON.stringify(env.lighttpd),
        }),
        new MiniCssExtractPlugin({
            filename: "../css/app.css",
        }),
    ],
});
