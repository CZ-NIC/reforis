/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

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
                // Since "foris" is not transpiled we shouldn't ignore it.
                exclude: /node_modules\/(?!foris)/,
                loader: "babel-loader",
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
                // Using different instances of library in reForis and foris JS (and plugins) cause
                // a bug about "using react-router components outside <Router/>". So we expose it to
                // use same instance of ReactRouterDOM everywhere.
                test: require.resolve("react-router-dom"),
                use: [{ loader: "expose-loader", options: "ReactRouterDOM" }],
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
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        pure_funcs: ["console.log", "console.info", "console.debug"],
                    },
                    mangle: false,
                },
            }),
        ],
        // Workaround to get ReactRouterDOM to be exposed. Otherwise, it's excluded as unused
        // imports as it's flagged as a module without side effects.
        sideEffects: false,
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
