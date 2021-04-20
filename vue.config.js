var FriendlyErrorsPlugin = require("friendly-errors-plugin");

module.exports = {
  publicPath:'',
  configureWebpack: {
    devtool: "source-map",
    plugins: [new FriendlyErrorsPlugin()],
  },
};
