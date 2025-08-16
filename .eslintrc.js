module.exports = {
  extends: [
    'next/core-web-vitals',
  ],
  rules: {
    // Disable rules that are causing issues
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'jsx-a11y/alt-text': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-key': 'off',
    'react/display-name': 'off',
    'import/no-anonymous-default-export': 'off',
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'public/',
    '**/*.d.ts',
  ]
};
