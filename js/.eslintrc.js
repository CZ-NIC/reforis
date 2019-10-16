const path = require("path");

module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "jest": true
    },
    "extends": [
        "airbnb",
        "airbnb/hooks"
    ],
    "globals": {
        "_": "readonly",
        "babel": "readonly",
        "ForisTranslations": "readonly",
        "ngettext": "readonly",
        "ForisPlugins": "readonly"
    },
    "parser": "babel-eslint",
    "rules": {
        "quotes": ["error", "double"],
        "indent": ["error", 4],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "import/no-unresolved": [
            "error",
            // Ignore imports used only in tests
            {ignore: ["customTestRender"]}
        ],
        "no-console": "error",
        "no-use-before-define": ["error", {
            functions: false,
            classes: true,
            variables: true
        }],
        // Should be enabled in the future
        "no-param-reassign": "off",
        "react/jsx-props-no-spreading": "off",
        "react/require-default-props": "off",
        "react/default-props-match-prop-types": "off",
        "react/forbid-prop-types": "off",
        // Permanently disabled
        "camelcase": "off",
        "react/jsx-filename-extension": "off",
        "no-plusplus": "off",
        "consistent-return": "off",
        "radix": "off",
        "no-continue": "off",
        "react/no-danger": "off",
        "no-multiple-empty-lines": ["error", {
            max: 1,
            maxBOF: 1,
            maxEOF: 0
        }],
    },
    "settings": {
        "import/resolver": {
            "webpack": {
                "env": { "lighttpd": true },
                "config": path.resolve(__dirname, "webpack.config.js")
            }
        }
    }
};
