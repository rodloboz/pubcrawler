const { environment } = require('@rails/webpacker')

environment.loaders.set('style', {
    test: /\.(scss|sass|css)$/,
    use: [{
        loader: "to-string-loader"
    }, {
        loader: "css-loader"
    }, {
        loader: "postcss-loader"
    }, {
        loader: "resolve-url-loader"
    }, {
        loader: "sass-loader"
    }]
})

// Bootstrap 3 has a dependency over jQuery:
const webpack = require('webpack')
environment.plugins.set('Provide',
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  })
)

module.exports = environment
