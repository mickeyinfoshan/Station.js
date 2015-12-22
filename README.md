# Station.js

**Station.js** is a basic module for more complex architectures. Let's consider the architecture of an application as a directed graph, which including nodes and links. Everything in an application that process/store data is a node of the graph and the connections between them are links.
In **Station.js**, we consider a node as a data station and a link as communication between nodes.

---

## Base

***Base implements basic function of a data station.***

DataStation is a core concept in Station.js.

The structure of a complex application is like a tree(graph) and a data station is like a node of the tree. A data station take the responsibility to receive data, process data, and then dispatch the processed data to the next.

Everything can be a data station. Models, views and controllers in MVC can be data stations. Dispatchers and stores in Flux can be data stations.

A data station can have several data sources. Sources can be
added through 'addSource' method which will create a receiver
waiting for data.

A data station can have one or more data destinations. When a data station add an another data station as a data source, this data station will be a data destination of the other one.

A data station can have several handlers dealing with a certain data type respectively. When data comes, a data station will choose the corresponding handler to process the data. If there's no corresponding handler found, do nothing. If a handler returns a value, then the data station will dispatch the return value to all data destinations of it. Otherwise, nothing more to do. If the return value doesn't have '$type' attribute, the origin data type will add to it.

A single data station won't do anything for you!

### Methods

**addSource(source: Base [, $type: String]): void**
 Add a data station as a source. When the source dispatch data of such type, this data station will get the data. If no type provided, a default type will be used.

**removeSource(source: Base [, $type: String])** No longer receive data of the type from that station. If no type provided, remove all data types, which means this data station will not receive any from the source anymore.

**hasSource(source: Base [, $type: String]): boolean** Determine whether receiving data of the type from the source. If no type provided, determine whether receiving any data from the source.

**getSourceCount(): Number** Return the number of sources.

**addHandler(handler : Function [, $type: String]): void**
Add a data handler for a certain data type. The handler can have a return value. If so, this data station will dispatch the return value to all its destination automatically. There are two things need to be mentioned here. First, if the handler is a method of an object which uses `this`, you need to `bind` the correct `this` to the handler or the handler will not work as your expectation. Second, your return value should be an object or it will throw a type error. You can set the data type of your return value by setting the `$type` attribute. If you don't, the data type this handler deal with will be used.

**removeHandler($type : String): void**
Remove a data handler for a certain data type.

**hasHandler($type : String): boolean** Determine whether the data station process such type of data.

**dispatch(data): void** Dispatch the data to all its destinations, which may invoke the handler of the destinations. This method would be invoked automatically after this data station receives data, process it and has a return value. The data object should have `$type` and `$content`.

### Example:
```
  const {Base} = require("data-station");

	var d1, d2, d3;
	d1 = new Base();
	d2 = new Base();
	d2 = new Base();

	d2.name = "D2";
	d3.name = "D3";

	//make a chain of delivering.
	d2.addSource(d1, "data");
	d3.addSource(d2, "data");

	//the handler
	function gotData(data) {
		this.hasData = true;                                                                  //`this` will be set by using `bind`
		console.log(this.name + " got the data. The type of data is '" + data.$type + "'.");
		return data;		                                                                      //just return the value
	}

	d2.addHandler(gotData.bind(d2), "data");
	d3.addHandler(gotData.bind(d3), "data");

	//the data delivered through the chain
	var data = {
		$type : "data",
    $content : null,
	};

	d1.dispatch(data);
	/*
		d2.hasData == true
		d3.hasData == true

		OUTPUT :
		D2 got the data. The type of data is 'data'.
		D3 got the data. The type of data is 'data'.
	*/
```


## Model

Model, which is inherited from Base, is developed to solve the problem that it's no easy job to detect the changes of a model.
Something similar to Observer pattern is used here. When the `set` method is called, the instance will dispatch the information to all it's `destinations`(Observers).

### Methods

**get(fieldName : String)**

Get the value of the provided field.

**set(newStatus : Object) : void**

Set the value of the provided fields and dispatch the change. The information dispatched include the instance itself and the previous status. You can figure out how to get them in the following example.

### Example

```
  const {Base, Model} = require("data-station");

  //define the class of the model
  class MyModel extends Model {
    constructor() {
      super();
      this.foo1 = 0;
      this.foo2 = false;
    }
  }

  var myModel = new MyModel();
  var observer = new Base(); //A simple data station, such as Base, can be the observer.
  observer.addSource(myModel, "MyModel.change"); //observe the model instance. Be careful, the type of the data source should be `${YourModelClassName}.change`.

  observer.addHandler(function(data) {

    //data.instance is the instance which dispatched its change.
    //data.prevStatus includes the changed fields and the changed values.

    for(var field in data.prevStatus) {
      console.log(`field ${field} was changed from ${prevStatus[field]} to ${data.instance.get(field)}`); // just log the change
    }

  }, "MyModel.change");

  myModel.set({
      foo1 : 1,
      foo2 : true
  });

  /*
    OUTPUT:
      field foo1 was changed from 0 to 1
      field foo2 was changed from false to true
  */

```


## DSSet

`DSSet` is inherited from ES6's `Set`, which means `DSSet` has all methods that `Set` has.

When an item is added or deleted, the `DSSet` instance will inform all its observers what happened.
You can read the example below to figure how to use it.

### Extra Method

**getDataStation() : Base**   
Get the dataStation to listen to.

### Example

```
  var DataStation = require("../../../index");
  var Base = DataStation.Base;
  var DSSet = DataStation.DSSet;
  var Model = DataStation.Model;

  class MyModel extends Model {
    constructor(name) {
      super()
      this.name = name;
    }
  }

  var mySet;
  var observer;
  var item1;

  mySet = new DSSet();
  observer = new Base();
  item1 = new MyModel("item1");

  observer.addSource(mySet.getDataStation(), "MyModel.add");
  observer.addSource(mySet.getDataStation(), "MyModel.delete");

  observer.addHandler(function(data) {
    console.log(`${data.instance.name} was added`);
  }.bind(observer), "MyModel.add");

  observer.addHandler(function(data) {
    console.log(`${data.instance.name} was deleted`);
  }.bind(observer), "MyModel.delete");

  mySet.add(item1);
  mySet.add(item1);  //won't invoke the handler
  mySet.delete(item1);

  /*
    OUTPUT:
      item1 was added.
      item1 was deleted.
  */

```


## DSMap

Similar to `DSSet`, `DSMap` is inherited from ES6's `Map`.

When a key is set or deleted, the `DSMap` instance will inform all its observers what happened.
You can read the example below to figure how to use it.

### Extra Method

**getDataStation() : Base**   
Get the dataStation to listen to.

### Example

```
  var DataStation = require("../../../index");
  var Base = DataStation.Base;
  var DSMap = DataStation.DSMap;
  var Model = DataStation.Model;

  class MyModel extends Model {
    constructor(name) {
      super()
      this.name = name;
    }
  }

  var myMap;
  var observer;
  var item1;

  myMap = new DSMap();
  observer = new Base();
  item1 = new MyModel("item1");

  observer.addSource(myMap.getDataStation(), "myItemKey.set");
  observer.addSource(myMap.getDataStation(), "myItemKey.delete");

  observer.addHandler(function(data) {
    console.log(`'myItemKey' was set to ${data.instance.name}`);
  }.bind(observer), "myItemKey.set");

  observer.addHandler(function(data) {
    console.log(`${data.instance.name} was deleted`);
  }.bind(observer), "myItemKey.delete");

  myMap.set("myItemKey", item1);
  myMap.delete("myItemKey");

  /*
    OUTPUT:
      'myItemKey' was set to item1.
      item1 was deleted.
  */

```


----------------

## More Features

To know more about the features, just read the test!

## Questions?
Feel free to open any issues. PRs are welcomed!
