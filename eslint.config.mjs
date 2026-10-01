import nx from "@nx/eslint-plugin";

export default [
    ...nx.configs["flat/base"],
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: [],
                    depConstraints: [
                        {
                            sourceTag: "*",
                            onlyDependOnLibsWithTags: [
                                "*"
                            ]
                        }
                    ]
                }
            ],
            "@angular-eslint/prefer-standalone": [
                "off"
            ]
        }
    },
    ...nx.configs["flat/typescript"],
    {
        files: [
            "**/*.ts",
            "**/*.tsx"
        ],
        rules: {
            semi: [
                "error",
                "always"
            ],
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@angular-eslint/prefer-standalone": [
                "off"
            ]
        },
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.*?.json"
            }
        }
    },
    ...nx.configs["flat/javascript"]
];
