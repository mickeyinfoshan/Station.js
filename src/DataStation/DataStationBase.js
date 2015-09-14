var Stream = require("stream");
var assign = require("object-assign");

var DataStationBase = function() {
	this.sources = [];
	this.destinations = [];
	this.handlers = {};
	this.receiveStream = new Stream();
	this.receiveStream.readable = true;
	this.dataBuffer = "";
	this.receiveStream.on("data",function(chunk) {
		this.dataBuffer += chunk;
	});
	this.receiveStream.on("end", function() {
		//TODO : parse data to JSON
		this.process(this.dataBuffer);
	});
};

DataStationBase.prototype = assign({},DataStationBase,{
	addSource : function(dataStation) {
		dataStation.addDestination(this);
		this.sources.push(dataStation);
	},
	addDestination : function(dataStation) {
		dataStation.addSource(this);
		this.destinations.add(dataStation;)
	},
	deliver : function(data, dataStation, callback) {
		callback = callback || function(){return true;};
		var receiveStream = dataStation.getReceiveStream();
		var sourceStream = this.makeSourceStream();
		return sourceStream.write(data,'utf-8',function(){
			sourceStream.pipe(receiveStream);
			sourceStream.on("end",callback);
		});
	},
	makeSourceStream : function() {
		return new Stream();
	},
	getReceiveStream : function() {
		return this.receiveStream;
	},
	addHandlers : function(dataType, handler) {
		this.handlers[dataType] = this.handlers[dataType] || [];
		this.handlers[dataType].push(handler);
	},

	//process the data received
	//TODO : serialize return values of handlers to JSON
	process : function(data,callback) {
		var handlers = this.handlers[dataType] || [];
		callback = callback || this.dispatch;
		var promises = handlers.map(function(handler){
			return Promise.resolve(handler(data));
		});
		Promise.all(promises).then(callback,function(){
			throw "Error during processing";
		});
		this.dataBuffer = "";
		return true;
	},

	//deliver the data to all destinations
	dispatch : function(data,callback) {
		var _this = this;
		callback = callback || function(){return true};
		this.promises = [];
		this.destinations.forEach(function(des,i){
			_this.deliver(data,des,function(response) {
				_this.promises[i] = Promise.resolve(response);
			});
		});
		Promise.all(this.promises).then(callback,function(){
			throw "Error during dispatching";
		});
		return true;
	}
});

export default DataStationBase;