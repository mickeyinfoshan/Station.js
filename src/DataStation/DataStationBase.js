/*
	@author : Mickey
	@email : mickey.in.foshan@gmail.com

	****************************************

	DataStation is a core concept. 
	An undirectional application is like a tree
	and a dataStation is like a node of the tree.
	A dataStation take the responsibility to receive
	data, process data, and then dispatch the processed
	data to next dataStations.
	Everitything can be a dataStation. Models, views and 
	controllers in MVC can be dataStations. Dispatchers
	and stores in Flux can be dataStations.
	A dataStation can have several handlers dealing
	with a certain dataType. 
	When data comes, a dataStation will choose the 
	corresponding handler to process the data.
	If no corresponding handler found, do nothing.
	If a handler returns value, then the dataStation will
	dispatch the return value. Otherwise, nothing more to do.
	If the return value doesn't have 'dataType' attribute, 
	the origin dataType will add to it.
*/
var Stream = require("stream");
var assign = require("object-assign");

var DataStationBase = function() {
	this.sources = []; //for the future use
	this.destinations = [];
	this.handlers = {};
	this.dataContainer = null;
	
};

DataStationBase.prototype = assign({},DataStationBase,{
	addSource : function(dataStation) {
		if(this.destinations.indexOf(dataStation) >= 0) {
			//a data station shouldn't be the source and destination 
			//at the same time for the same data station, which will 
			//cause a curse with no end
			throw "Curse data flow";
		}
		dataStation.addDestination(this);
		this.sources[dataStation] = {
			dataStation : dataStation,
			stream : new Stream(),
			dataBuffer : ""
		};
		var source = this.sources[dataStation];
		source.stream.readable = true;
		source.stream.on("data", function(chunk){
			source.dataBuffer += chunk;
		});
		var thisStation = this;
		source.stream.on("end", function(){
			var data = JSON.parse(this.dataBuffer);
			this.dataBuffer = ""; //reset the data buffer
			thisStation.process(data);
		});

	},

	//shouldn't invoke by users, this is
	// a private method
	addDestination : function(dataStation) {
		if(this.destinations.indexOf(dataStation) < 0){
			this.destinations.push(dataStation);
		}	
	},
	deliver : function(data, dataStation, callback) {
		callback = callback || function(){return true;};
		var receiveStream = dataStation.getReceiveStream(this);
		if(!receiveStream) {
			throw "receive stream not found";
		}
		var sourceStream = this.makeSourceStream();
		var jsonData = JSON.stringify(data);
		return sourceStream.write(jsonData,'utf-8',function(){
			sourceStream.pipe(receiveStream);
			sourceStream.on("end",callback);
		});
	},
	makeSourceStream : function() {
		return new Stream();
	},
	getReceiveStream : function(dataStation) {
		return this.sources[dataStation].stream;
	},
	addHandler : function(dataType, handler) {
		//adding the handler of data type existed
		//will override the origin one
		this.handlers[dataType] = handler;
	},

	//process the data received
	process : function(data,callback) {
		
		var handler = this.handlers[data.dataType];
		//if the handler of such data type doesn't exist, then 
		//do nothing
		if(!handler) {
			return;
		}

		//handle the data
		processedData = handler(data);
		if(processedData && processedData.dataType == undefined){
			processedData.dataType = data.dataType;
		}
		//default callback is this.dispatch
		callback = callback || this.dispatch;
		return callback(processedData);
	},

	//dispatch the data to all destinations
	dispatch : function(data,callback) {
		//If the handler didn't produce any data, 
		//do nothing.
		if(!data) {
			return;
		}
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