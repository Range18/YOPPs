module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint/eslint-plugin', 'import'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        "plugin:import/errors",
        "plugin:import/warnings"
    ],
    "settings": {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts"]
        },
        "import/internal-regex": "^@",
        "import/resolver": {
            "eslint-import-resolver-custom-alias": {
                "alias": {
                    '@' : './src/'
                },
                "extensions": [".ts", '.d.ts', '.js'],
            }
        }
    },
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        "import/order": [
            "error",
            {
                "groups": [
                    "index",
                    "sibling",
                    "parent",
                    "internal",
                    "external",
                    "builtin",
                    "object",
                    "type"
                ]
            }
        ]
    },
};
