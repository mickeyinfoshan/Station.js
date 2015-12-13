/*
	tests for Base
*/

describe("Base", function() {

	var Base = require("../../../index.js").Base;
	var source;
	var dest;
	var data = {
		$type : "say",
		$content : "hello"
	};

	var handler = function(content) {
		content += "!";
		this.dataContainer = content;
		return {content : content};
	};

	beforeEach(function(){
		source = new Base();
		dest = new Base();
		dest.addSource(source,"say");
	});

	it("should not have a source before adding one to it", function(){
		expect(source.getSourcesCount()).toBe(0);
	}),

	it("should have a source after adding a source to it",function(){
		expect(source.hasDestination(dest)).toBe(true);
		expect(dest.hasSource(source, data.$type)).toBe(true);
		expect(source.getDestinationsCount()).toBe(1);
		expect(dest.getSourcesCount()).toBe(1);
	});

	it("should have no source after removing a source to it", function(){
		dest.addSource(source, "shout");
		dest.removeSource(source,"say");
		expect(source.hasDestination(dest)).toBe(true);
		expect(dest.hasSource(source, "say")).toBe(false);
		expect(dest.hasSource(source)).toBe(true);
		expect(source.getDestinationsCount()).toBe(1);
		expect(dest.getSourcesCount()).toBe(1);
		dest.removeSource(source);
		expect(source.hasDestination(dest)).toBe(false);
		expect(source.getDestinationsCount()).toBe(0);
		expect(dest.getSourcesCount()).toBe(0);
		expect(dest.hasSource(source)).toBe(false);
	});

	it("should have a corresponding handler after adding one to it", function(){
		dest.addHandler(handler, "say");
		expect(dest.hasHandler("say")).toBe(true);
		//source.dispatch(data);
	});

	it("should not have the handler that has been removed", function(){
		dest.addHandler(handler, "say");
		dest.removeHandler("say");
		expect(dest.hasHandler("say")).toBe(false);
	});

	it("should choose the corresponding handler and process it", function(){
		dest.addHandler(handler.bind(dest), "say");
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
			this.dataContainer = data + "@";
		}.bind(dest), "say");
		var result = dest.process(data);
		expect(dest.dataContainer).toBe("hello@");
	});

	it("should deliver the data to its destination", function(){
		dest.addHandler(handler.bind(dest), "say");
		source.deliver(data,dest);
		expect(dest.dataContainer).toBe("hello!");
	});

	it("should not deliver the data to another data station which is not a destionation",function(){
		var dest2 = new Base();
		dest2.addHandler(function(data){
			this.hasData = true;
		}.bind(dest2));
		source.deliver(data, dest2);
		expect(dest2.hasData).not.toBe(true);
	}, "say");

	it("should dispatch the data to its destinations if the handler has return value", function(){
		dest.addHandler(handler.bind(dest), "say");
		var dest2 = new Base();
		dest2.addHandler(function(data){
			this.dataContainer = data + "@";
		}.bind(dest2), "say");
		dest2.addSource(source,"say");
		source.dispatch(data);
		expect(dest.dataContainer).toBe("hello!");
		expect(dest2.dataContainer).toBe("hello@");
	});

	it("should dispatch the processed data to its desinations", function(){
		dest.addHandler(handler.bind(dest), "say");
		var dest2 = new Base();
		dest2.addHandler(function(data){
			this.hasData = true;
		}.bind(dest2), "say");
		dest2.addSource(dest,"say");
		source.dispatch(data);
		expect(dest.dataContainer).toBe("hello!");
		expect(dest2.hasData).toBe(true);
	});

	it("should not dispatch anything if there's no return value", function(){

		//handler return nothing
		dest.addHandler(function(data){
			this.dataContainer = data + "!";
		}.bind(dest), "say");

		var dest2 = new Base();
		dest2.addHandler(function(data){
			this.hasData = true;
		}.bind(dest2), "say");
		dest2.addSource(dest,"say");

		source.dispatch(data);

		expect(dest.dataContainer).toBe("hello!");
		expect(dest2.hasData).not.toBe(true);
	});

	it("can have different types for the same source" ,function(){
		dest.addSource(source);
		expect(dest.hasSource(source)).toBe(true);
		dest.addHandler(function(){
			this.gotData = true;
		}.bind(dest));
		dest.addHandler(handler.bind(dest), "say");
		source.dispatch({data:"ccc"});
		source.dispatch(data);
		expect(dest.dataContainer).toBe("hello!");
		expect(dest.gotData).toBe(true);
	});

});
