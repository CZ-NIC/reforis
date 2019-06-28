/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const path = require('path');

module.exports = {
    title: 'reForis JS docs',
    sections: [
        {
            name: 'Introduction',
            content: 'docs/introduction.md'
        },
        {
            name: 'Foris forms system',
            components: [
                'src/formContainer/ForisForm.js',
                'src/formContainer/alerts.js',
                'src/formContainer/SubmitButton.js',

            ],
            exampleMode: 'expand',
            usageMode: 'expand',
        },
        {
            name: 'Foris forms components',
            components: [
                'src/lan/LAN.js',
                'src/wan/WAN.js',
                'src/wifi/WiFi.js',
                'src/dns/DNS.js',
                'src/guestNetwork/GuestNetwork.js',
                'src/interfaces/Interfaces.js',
                'src/notificationSettings/NotificationSettings.js',
                'src/packages/Packages.js',
                'src/regionAndTime/RegionAndTime.js',
                'src/updates/Updates.js',
                'src/password/Password.js',
            ],
            exampleMode: 'expand',
            usageMode: 'expand',
        },
        {
            name: 'Top bar components',
            components: [
                'src/languagesDropdown/LanguagesDropdown.js',
                'src/notifications/NotificationsDropdown/NotificationsDropdown.js',
            ],
            exampleMode: 'expand',
            usageMode: 'expand',
        },
        {
            name: 'Router state handlers',
            components: [
                'src/routerStateHandler/RouterStateHandler.js',
                'src/routerStateHandler/NetworkRestartHandler.js',
                'src/routerStateHandler/RebootHandler.js',
            ],
            exampleMode: 'expand',
            usageMode: 'expand',
        },
        {
            name: 'Other Foris components',
            components: [
                'src/overview/Overview.js',
                'src/overview/UpdatesApprovals.js',
                'src/notifications/Notifications/Notifications.js',
                'src/connectionTest/ConnectionTest.js',
                'src/reboot/Reboot.js',
                'src/guide/Guide.js',
            ],
            exampleMode: 'expand',
            usageMode: 'expand',
        },
        {
            name: 'Bootstrap components',
            description: 'Set of bootstrap components.',
            components: 'src/common/bootstrap/*.js',
            exampleMode: 'expand',
            usageMode: 'expand',
            ignore: [
                'src/common/bootstrap/constants.js'
            ]
        }
    ],
    require: [
        'babel-polyfill',
        path.join(__dirname, '../reforis_static/reforis/css/bootstrap.min.css'),
        path.join(__dirname, '../reforis_static/reforis/css/react-datatime.css'),
        path.join(__dirname, '../reforis_static/reforis/css/fontawesome.min.css'),
        './src/testUtils/setupGlobals.js',
    ],
    webpackConfig: {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                }, {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                }, {
                    test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                    loader: 'file-loader'
                },
            ]
        },
    }
};
