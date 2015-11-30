var path = require("path");
module.exports = {
    entry : {bundle : "./index.js"},
		module: {
      		loaders: [
        		{ test: /\.js[x]?$/,loader : "babel-loader"}
      		],    		
    },
    output: {
      path: path.join(__dirname, "dist"),
      publicPath: "dist/",
      filename: "[name].js",
      chunkFilename: "[chunkhash].js"
    },
    watch : false,
    plugins : []
};