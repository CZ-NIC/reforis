/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

// https://jestjs.io/docs/en/configuration.html
module.exports = {
    moduleDirectories: [
        "node_modules",
        "<rootDir>/src/",
    ],
    moduleNameMapper: {
        "\\.(css|less)$": "<rootDir>/src/__mocks__/styleMock.js",
    },
    clearMocks: true,
    collectCoverageFrom: ["src/**/*.{js,jsx}"],
    coverageDirectory: "coverage",
    testPathIgnorePatterns: ["/node_modules/", "/__fixtures__/"],
    transformIgnorePatterns: ["node_modules/(?!(foris)/)"],
    verbose: false,
    setupFilesAfterEnv: [
        "@testing-library/react/cleanup-after-each",
        "foris/testUtils/setup",
    ],
    globals: {
        TZ: "utc",
    },
};
