/*
	tests for DSSet
*/
'use strict'
describe("DSSet", function() {

  var DataStation = require("../../../index");
  var Base = DataStation.Base;
  var DSSet = DataStation.DSSet;
  var Model = DataStation.Model;

  class MyModel extends Model {
    constructor() {
      super()
      this.value = 0;
    }
  }

  var mySet;
  var observer;
  var item1, item2;

  beforeEach(()=>{

    mySet = new DSSet();
    observer = new Base();
    item1 = new MyModel();
    item2 = new MyModel();

    observer.addSource(mySet.getDataStation(), "MyModel.add");
    observer.addSource(mySet.getDataStation(), "MyModel.delete");

    observer.addHandler(function(data) {
      this.addedInstance = data.instance;
    }.bind(observer), "MyModel.add");

    observer.addHandler(function(data) {
      this.deletedInstance = data.instance;
    }.bind(observer), "MyModel.delete");

  });


  it("should add the item and inform the observer", function() {

    mySet.add(item1);

    expect(mySet.has(item1)).toBe(true);
    expect(observer.addedInstance).toBe(item1);

  });

  it("should inform the observer for once", function() {

    observer.addCounter = 0;
    //override the handler
    observer.addHandler(function(data) {
      this.addCounter++;
    }.bind(observer), "MyModel.add")

    mySet.add(item1);

    expect(observer.addCounter).toBe(1);

    mySet.add(item1);

    expect(observer.addCounter).toBe(1);

  });

  it("should delete the item and inform the observer", function() {

    var deleteResult2 = mySet.delete(item2);
    expect(deleteResult2).toBe(false);
    expect(observer.deletedInstance).toBe(undefined);

    mySet.add(item1);
    var deleteResult = mySet.delete(item1);

    expect(deleteResult).toBe(true);
    expect(observer.deletedInstance).toBe(item1);


  });


});
