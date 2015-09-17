/*
	tests for DataStationBase 
*/

describe("DataStationBase", function() {

	var DataStationBase = require("../../../src/DataStation/DataStationBase.js");
	var source;
	var dest;
	var data = {
		_type : "say",
		content : "hello"
	};

	var handler = function(data) {
		var content = data.content;
		//console.log("say: " + content);
		content += "!";
		this.dataContainer = content;
		return {content : content};
	};

	beforeEach(function(){
		source = new DataStationBase();
		dest = new DataStationBase();
		dest.addSource(source,"say");
	});

	it("should have a source after adding a source to it",function(){
		expect(source.hasDestination(dest)).toBe(true);
		expect(dest.hasSource(source)).toBe(true);
		expect(source.getDestinationsCount()).toBe(1);
		expect(dest.getSourcesCount()).toBe(1);
	});

	it("should not add a source if it's a destination", function(){
		expect(function(){
			source.addSource(dest);
		}).toThrow(Error("Curse data flow"));
	});

	it("should have no source after removing a source to it", function(){
		dest.removeSource(source);
		expect(source.hasDestination(dest)).toBe(false);
		expect(dest.hasSource(source)).toBe(false);
		expect(source.getDestinationsCount()).toBe(0);
		expect(dest.getSourcesCount()).toBe(0);
	});

	it("should have a corresponding handler after adding one to it", function(){
		dest.addHandler(handler,"say");
		expect(dest.hasHandler("say")).toBe(true);
		//source.dispatch(data);
	});

	it("should not have the handler that has been removed", function(){
		dest.addHandler("say",handler);
		dest.removeHandler("say");
		expect(dest.hasHandler("say")).toBe(false);
	});

	it("should choose the corresponding handler and process it", function(){
		dest.addHandler(handler.bind(dest),"say");
		var result = dest.process(data);
		expect(dest.dataContainer).toBe("hello!");
	});

	it("should do nothing if the corresponding handler not found", function(){
		dest.addHandler(handler.bind(dest));
		var result = dest.process(data);
		expect(dest.dataContainer).not.toBe("hello!");	
	});

	it("should override the handler of the same _type", function(){
		dest.addHandler(handler.bind(dest),"say");
		dest.addHandler(function(data){
			this.dataContainer = data.content + "@";
		}.bind(dest),"say");
		var result = dest.process(data);
		expect(dest.dataContainer).toBe("hello@");
	});

	it("should deliver the data to its destination", function(){
		dest.addHandler(handler.bind(dest),"say");
		source.deliver(data,dest);
		expect(dest.dataContainer).toBe("hello!");
	});

	it("should not deliver the data to another data station which is not a destionation",function(){
		var dest2 = new DataStationBase();
		expect(function(){
			source.deliver(data, dest2);
		}).toThrow(Error("Receiver not found"));
	});

	it("should dispatch the data to its destinations if the handler has return value", function(){
		dest.addHandler(handler.bind(dest),"say");
		var dest2 = new DataStationBase();
		dest2.addHandler(function(data){
			this.dataContainer = data.content + "@";
		}.bind(dest2),"say");
		dest2.addSource(source,"say");
		source.dispatch(data);
		expect(dest.dataContainer).toBe("hello!");
		expect(dest2.dataContainer).toBe("hello@");
	});

	it("should dispatch the processed data to its desinations", function(){
		dest.addHandler(handler.bind(dest),"say");
		var dest2 = new DataStationBase();
		dest2.addHandler(function(data){
			this.dataContainer = data.content + "@";
		}.bind(dest2),"say");
		dest2.addSource(dest,"say");
		source.dispatch(data);
		expect(dest.dataContainer).toBe("hello!");
		expect(dest2.dataContainer).toBe("hello!@");
	});

	it("should not dispatch anything if there's no return value", function(){
		
		//handler return nothing
		dest.addHandler(function(data){
			this.dataContainer = data.content + "!";
		}.bind(dest),"say");		

		var dest2 = new DataStationBase();
		dest2.addHandler(function(data){
			this.dataContainer = data.content + "@";
		}.bind(dest2),"say");
		dest2.addSource(dest,"say");

		source.dispatch(data);

		expect(dest.dataContainer).toBe("hello!");
		expect(dest2.dataContainer).not.toBe("hello!@");
	});
});

