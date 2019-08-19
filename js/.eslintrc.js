const path = require("path");

module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "jest": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/errors",
        "plugin:import/warnings"
    ],
    "globals": {
        "_": "readonly",
        "babel": "readonly",
        "ngettext": "readonly",
        "ForisTranslations": "readonly",
        "ForisPlugins": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-hooks",
        "jsx-a11y",
        "import"
    ],
    "rules": {
        "no-console": "error",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/prop-types": "warn",
        "import/no-unresolved": [
            "error",
            // Ignore imports used only in tests
            {ignore: ["mockWS", "customTestRender"]}
        ]
    },
    "settings": {
        "react": {
            "version": "detect"
        },
        "import/resolver": {
            "webpack": {
                "env": {"lighttpd": true},
                "config": path.resolve(__dirname, "webpack.config.js")
            }
        }
    }
};
