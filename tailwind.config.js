module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: ['./public/**/*.html', './src/**/*.vue'],
  theme: {
    extend: {},
  },
  variants: {extend: {tableLayout: ['hover']}, cursor: ['hover']},
  plugins: [],
};
