describe("DataStationBase", function() {

	var DataStationBase = require("../../src/DataStation/DataStationBase.js");
	var source;
	var dest;
	var data = {
		dataType : "say",
		content : "hello"
	};

	var handler = function(data) {
		var content = data.content;
		console.log("say: " + content);
		content += "!";
		return {content : content};
	};

	beforeEach(function(){
		source = new DataStationBase();
		dest = new DataStationBase();
		dest.addSource(source);
	});

	it("should have a source after adding a source to it",function(){
		expect(source.destinations.length).toBe(1);
		expect(dest.sources[source]).not.toBe(undefined);
		expect(source.getDestinationsCount()).toBe(1);
		expect(dest.getSourcesCount()).toBe(1);
	});

	it("should have no source after removing a source to it", function(){
		dest.removeSource(source);
		expect(source.destinations.length).toBe(0);
		expect(dest.sources[source]).toBe(undefined);
		expect(source.getDestinationsCount()).toBe(0);
		expect(dest.getDestinationsCount()).toBe(0);
	});

	it("should have a corresponding handler after adding one to it", function(){
		dest.addHandler("say",handler);
		expect(dest.hasHandler("say")).toBe(true);
		source.dispatch(data);
	});
});

