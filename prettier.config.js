/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    plugins: ['prettier-plugin-tailwindcss'],
    singleQuote: true,
    jsxSingleQuote: false,
    tabWidth: 4,
    semi: true,
    bracketSpacing: true,
    parser: 'typescript',
    endOfLine: 'auto',
};

export default config;
