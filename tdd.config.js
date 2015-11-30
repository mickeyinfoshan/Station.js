var KarmaServer = require('karma').Server;
var webpack = require('webpack');
var webpackConfig = require("./webpack.config.js");
var WebpackDevServer = require("webpack-dev-server");

module.exports =  {
	test : function(done) {
		new KarmaServer({
    		configFile: __dirname + '/test/karma.conf.js',
    		singleRun: true
  		}, function(exitCode) {
  			done(!exitCode);
  		}).start();
	},
	beforeTest : function() {
		var myConfig = Object.create(webpackConfig);
  		myConfig.devtool = "eval";
  		myConfig.debug = true;
 		  myConfig.watch = true;
  		new WebpackDevServer(webpack(myConfig), {
   	 		publicPath: "/" + myConfig.output.publicPath,
    		stats: {
      			colors: true
    		}
  		}).listen(8080, "localhost", function(err) {
    		if(err) throw err;
   			console.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
  		});
	},
	afterTest : function(done) {
    done();
	}
};