/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const path = require('path');


module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'js/app.min.js',
        path: path.join(__dirname, '../reforis/static/')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    mode: 'development'
};
