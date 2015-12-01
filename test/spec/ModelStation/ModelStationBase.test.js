/*
	tests for ModelStationBase
*/
'use strict'
describe("ModelStationBase", function() {
  var ModelStationBase = require("../../../src/ModelStation/ModelStationBase.js");
  var DataStationBase = require("../../../src/DataStation/DataStationBase.js");
  class MyModel extends ModelStationBase {
    constructor() {
      super()
      this.value = 0;
    }
  }
  var myModel;
  var receiver;
  beforeEach(()=>{
    myModel = new MyModel();
    receiver = new DataStationBase();
    receiver.oldValue = null;
    receiver.newValue = null;
    receiver.addSource(myModel);
  });

  it("should set the new value and deliver to it's destination", function() {

    receiver.addHandler("MyModel.change", function(data) {

      console.log(JSON.stringify(data));

      this.oldValue = data.prevStatus.value;
      this.newValue = data.instance.get("value");
      this.sender = instance;
    }.bind(receiver));

    myModel.set({
      value : 5
    });

    var myModelValue = myModel.get("value");
    expect(myModelValue).toBe(5);
    expect(myModel.value).toBe(5);
    expect(receiver.oldValue).toBe(0);
    expect(receiver.newValue).toBe(5);
    expect(receiver.sender).toBe(myModel);
  });
});
