import globals from 'globals'
import hooks from 'eslint-plugin-react-hooks'
import refresh from 'eslint-plugin-react-refresh'
export default [{ ignores: ['dist'] }, { files: ['**/*.{js,jsx}'], languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: globals.browser, parserOptions: { ecmaFeatures: { jsx: true } } }, plugins: { 'react-hooks': hooks, 'react-refresh': refresh }, rules: { ...hooks.configs.recommended.rules, 'react-refresh/only-export-components': ['warn', { allowConstantExport: true }], 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }] } }]
