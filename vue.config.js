var FriendlyErrorsPlugin = require("friendly-errors-plugin");

module.exports = {
  configureWebpack: {
    devtool: "source-map",
    plugins: [new FriendlyErrorsPlugin()],
  },
};
