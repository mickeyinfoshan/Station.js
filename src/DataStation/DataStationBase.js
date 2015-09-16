/*
	@author : Mickey
	@email : mickey.in.foshan@gmail.com

	****************************************

	DataStation is a core concept in PipeFlux. 
	An undirectional application is like a tree
	and a data station is like a node of the tree.
	A data station take the responsibility to receive
	data, process data, and then dispatch the processed
	data to the next.
	Everything can be a data station. Models, views and 
	controllers in MVC can be data stations. Dispatchers
	and stores in Flux can be data stations.
	A data station can have several data sources. Sources can be 
	added through 'addSource' method which will create a stream 
	waiting for data. 
	A data station can have one or more data destinations. When a data station
	add an another data station as a data source, this data station will be a data
	destination of the other one.
	A data station can have several handlers dealing
	with a certain data type. When data comes, a data station will choose the 
	corresponding handler to process the data.
	If no corresponding handler found, do nothing.
	If a handler returns value, then the data station will
	dispatch the return value to all data destinations of it. 
	Otherwise, nothing more to do.
	If the return value doesn't have 'dataType' attribute, 
	the origin dataType will add to it.
*/

'use strict';


var Stream = require("stream");
var assign = require("object-assign");

//TODO: change sources, handlers to Map
//and change destinations to Set
var DataStationBase = function() {
	this.sources = {};
	this.destinations = [];
	this.handlers = {};
	this.dataContainer = null;
};

DataStationBase.prototype = assign({},DataStationBase,{

	//adding a data source will create new stream waiting for data 
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
		source.stream.writable = true;
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
	removeSource : function(dataStation) {
		dataStation.removeDestination(this);
		this.sources[dataStation] = null;
		delete this.sources[dataStation];
	},
	hasSource : function(dataStation) {
		return this.sources[dataStation]?true:false;
	},
	getSourcesCount : function() {
		var count = 0;
		for(var key in this.sources) {
			count++;
		}
		return count;
	},
	//shouldn't invoke by users, this is
	// a private method
	addDestination : function(dataStation) {
		if(this.destinations.indexOf(dataStation) < 0){
			this.destinations.push(dataStation);
		}	
	},
	removeDestination : function(dataStation) {
		var index = this.destinations.indexOf(dataStation);
		this.destinations.splice(index,1);
	},
	hasDestination : function(dataStation) {
		return this.destinations.indexOf(dataStation) >= 0;
	},
	getDestinationsCount : function() {
		return this.destinations.length;
	},

	//pipe the data to another dataStation
	deliver : function(data, dataStation) {
		//callback = callback || function(){return true;};
		var receiveStream = dataStation.getReceiveStream(this);
		if(!receiveStream) {
			throw "receive stream not found";
		}
		var jsonData = JSON.stringify(data);
		var outputStream = this.makeOutputStream(jsonData);
		outputStream.pipe(receiveStream);
	},

	//create an temperary stream for output 
	makeOutputStream : function(data) {
		var stream = new Stream.Readable();
		stream.push(data);
		stream.push(null);
		return stream;
	},
	getReceiveStream : function(dataStation) {
		return this.sources[dataStation].stream;
	},
	addHandler : function(dataType, handler) {
		//adding the handler of data type existed
		//will override the origin one
		this.handlers[dataType] = handler;
	},
	removeHandler : function(dataType) {
		this.handlers[dataType] = null;
		delete this.handlers[dataType];
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
	hasHandler : function(dataType) {
		return this.handlers[dataType]?true:false;
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

module.exports = DataStationBase;