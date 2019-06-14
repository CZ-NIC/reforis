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
        filename: 'app.min.js',
        path: path.join(__dirname, '../reforis_static/reforis/js')
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
