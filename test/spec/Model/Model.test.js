/*
	tests for Model
*/
'use strict'
describe("Model", function() {

  var DataStation = require("../../../index.js");
  var Base = DataStation.Base;
  var Model = DataStation.Model;
  class MyModel extends Model {
    constructor() {
      super()
      this.value = 0;
    }
  }
  var myModel;
  var receiver;
  beforeEach(()=>{
    myModel = new MyModel();
    receiver = new Base();
    receiver.oldValue = null;
    receiver.newValue = null;
    receiver.addSource(myModel, "MyModel.change");
  });

  it("should get the value", function() {
    expect(myModel.get("value")).toBe(0);
  });

  it("the _setField method should work", function() {
    myModel._setField({
      field : "value",
      value : 5
    });
    expect(myModel.get("value")).toBe(5);
  });

  it("should set the value", function() {
    myModel.set({
      value : 5
    });
    expect(myModel.get("value")).toBe(5);
  });

  it("should get the correct className", function() {
    expect(myModel._getClassName()).toBe("MyModel");
  })

  it("should deliver changes to it's destination", function() {

    function handler(data) {
      this.oldValue = data.prevStatus.value;
      this.newValue = data.instance.get("value");
      this.sender = data.instance;
    }

    receiver.addHandler(handler.bind(receiver), "MyModel.change");

    myModel.set({
      value : 5
    });

    expect(receiver.oldValue).toBe(0);
    expect(receiver.newValue).toBe(5);
    expect(receiver.sender).toBe(myModel);
  });
});
