#Station.js

---

**Station.js** is a basic module for more complex architectures. Let's consider the architecture of an application as a directed graph, which including nodes and links. Everything in an application that process/store data is a node of the graph and the connections between them are links.
In **Station.js**, we consider a node as a data station and a link as communication between nodes.

##DataStation

---

DataStation is a core concept in Station.js. 

An undirectional application is like a tree(graph)	and a data station is like a node of the tree. A data station take the responsibility to receive data, process data, and then dispatch the processed data to the next.

Everything can be a data station. Models, views and controllers in MVC can be data stations. Dispatchers and stores in Flux can be data stations.

A data station can have several data sources. Sources can be 
added through 'addSource' method which will create a receiver 
waiting for data. 

A data station can have one or more data destinations. When a data station add an another data station as a data source, this data station will be a data destination of the other one.

A data station can have several handlers dealing with a certain data type respectively. When data comes, a data station will choose the corresponding handler to process the data. If there's no corresponding handler found, do nothing. If a handler returns a value, then the data station will dispatch the return value to all data destinations of it. Otherwise, nothing more to do. If the return value doesn't have '$type' attribute, the origin data type will add to it.

A single data station won't do anything for you!

---

###API

**addSource(DataStation source[, String $type]): void**
 Add a data station as a source. When the source dispatch data of such type, this data station will get the data. If no type provided, a default type will be used.

**removeSource(DataStation source[, String $type])** No longer receive data of the type from that station. If no type provided, remove all data types, which means this data station will not receive any from the source anymore.

**hasSource(DataStation source[, String $type]): boolean** Determine wheter receiving data of the type from the source. If no type provided, determine wheter receiving any data from the source.

**getSourceCount(): int** Return the number of sources.

**addHandler(String type, Function handler): void**
Add a data handler for a certain data type. The handler can have a return value. If so, this data station will dispatch the return value to all its destination automatically. There are two things need to be mentioned here. First, if the handler is a method of an object which uses `this`, you need to `bind` the correct `this` to the handler or the handler will not work as your expectation. Second, your return value should be an object or it will throw a type error. You can set the data type of your return value by setting the `$type` attribute. If you don't, the data type this handler deal with will be used.

**removeHandler(String $type): void**
Remove a data handler for a certian data type.

**hasHandler(String $type): boolean** Determine wheter the data station process suce type of data.

**dispatch(Object data): void** Dispatch the data to all its destinations, which may invoke the handler of the destinations. This method would be invoked automatically after this data station receives data, process it and has a return value.

###Example:
	
	`var d1, d2, d3;
	d1 = new DataStationBase();
	d2 = new DataStationBase();
	d2 = new DataStationBase();

	d2.name = "D2";
	d3.name = "D3";

	//make a chain of delivering.
	d2.addSource(d1, "data");
	d3.addSource(d2, "data");

	//the handler
	function gotData(data) {
		this.hasData = true; //`this` will be set by using `bind`
		console.log(this.name + " got the data. The type of data is '" + data.$type + "'.");
		return data;		 //just return the value
	}

	d2.addHandler("data", gotData.bind(d2));
	d3.addHandler("data", gotData.bind(d3));

	//the data delivered through the chain
	var data = {
		$type : "data"
	};

	d1.dispatch(data);
	/*
		d2.hasData == true
		d3.hasData == true

		output : 
		D2 got the data. The type of data is 'data'.
		D3 got the data. The type of data is 'data'.
	*/
	`



	To know more about the features, just read the test!

