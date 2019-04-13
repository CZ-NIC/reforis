/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

// https://jestjs.io/docs/en/configuration.html
module.exports = {
    clearMocks: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coverageDirectory: 'coverage',
    setupFiles: ['<rootDir>/src/testUtils/setupGlobals.js'],
    testPathIgnorePatterns: ['\\\\node_modules\\\\'],
    verbose: false,
    setupFilesAfterEnv: ['react-testing-library/cleanup-after-each',]
};
