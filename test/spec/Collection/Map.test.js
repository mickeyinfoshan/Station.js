/*
	tests for DSMap
*/
'use strict'
describe("DSMap", function() {

  var DataStation = require("../../../index");
  var Base = DataStation.Base;
  var DSMap = DataStation.DSMap;
  var Model = DataStation.Model;

  class MyModel extends Model {
    constructor() {
      super()
      this.value = 0;
    }
  }

  var myMap;
  var observer;
  var item1, item2;

  beforeEach(()=>{

    myMap = new DSMap();
    observer = new Base();
    item1 = new MyModel();
    item2 = new MyModel();

    observer.addSource(myMap.getDataStation(), "myItemKey.set");
    observer.addSource(myMap.getDataStation(), "myItemKey.delete");

    observer.addHandler(function(data) {
      this.addedInstance = data.instance;
    }.bind(observer), "myItemKey.set");

    observer.addHandler(function(data) {
      this.deletedInstance = data.instance;
    }.bind(observer), "myItemKey.delete");

  });


  it("should set the item and inform the observer", function() {

    myMap.set("myItemKey", item1);
    expect(observer.addedInstance).toBe(item1);

  });

  it("should delete the item and inform the observer", function() {

    var deleteResult2 = myMap.delete("myItemKey");
    expect(deleteResult2).toBe(false);
    expect(observer.deletedInstance).toBe(undefined);

    myMap.set("myItemKey", item1);
    var deleteResult = myMap.delete("myItemKey");

    expect(deleteResult).toBe(true);
    expect(observer.deletedInstance).toBe(item1);

  });


});
