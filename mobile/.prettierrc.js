module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  importOrder: [
    '^react$',
    '^react-native$',
    '^(@contexts|./contexts)',
    '^@stacks',
    '^(@common|@components|./components)',
    '^(@utils|@types|@styles|@types|@constants|@navigation|@configs)',
    '^(@assets/(.*)|@assets)',
    '^(./(.*)$|../(.*)$)',
  ],
};