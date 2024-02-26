module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "standard-with-typescript",
    "plugin:import/typescript",
    "plugin:prettier/recommended"
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.cjs"],
      parserOptions: {
        sourceType: "module",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    project: "./tsconfig.json",
    ecmaFeatures: {
			"jsx": true
		},
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "semi": "off",
    "@typescript-eslint/semi": ["error", "always"],
    "@typescript-eslint/no-misused-promises": 0,
    "@typescript-eslint/promise-function-async": 0,
    "@typescript-eslint/explicit-function-return-type" : 0
  }
};
