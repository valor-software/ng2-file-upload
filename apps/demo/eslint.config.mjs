
import baseConfig from "../../eslint.config.mjs";
import nx from "@nx/eslint-plugin";

export default [
    ...baseConfig,
    ...nx.configs["flat/angular"],
    {
        files: [
            "**/*.ts"
        ],
        rules: {
            "@angular-eslint/prefer-standalone": [
                "off"
            ],
            // Angular 22 migration pins existing components to ChangeDetectionStrategy.Eager to keep v21 behavior
            "@angular-eslint/prefer-on-push-component-change-detection": [
                "off"
            ]
        }
    },
    ...nx.configs["flat/angular-template"]
];
