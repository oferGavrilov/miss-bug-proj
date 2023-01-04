// console.log(Babel.availablePresets)
// console.log(Babel.availablePlugins)
const {availablePlugins} = Babel
Babel.registerPreset('ca-preset', {
  plugins: [
    availablePlugins['transform-object-rest-spread'],
    availablePlugins['syntax-jsx'],
    availablePlugins['transform-react-jsx'],
    availablePlugins['transform-react-display-name'],
    availablePlugins['transform-class-properties'],
    availablePlugins['transform-es2015-modules-umd'],
  ]
})