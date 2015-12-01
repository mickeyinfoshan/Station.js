'use strict';

const DataStationBase = require("../DataStation/DataStationBase.js");

class ModelStationBase extends DataStationBase {
  get(fieldName) {
    return this[fieldName];
  }
  set(newStatus) {
    var prevStatus = newStatus;
    for(var field in newStatus) {
      prevStatus[field] = this.get(field);
      this.setField({
        field : field,
        value : newStatus[field]
      });
    }
    this.dispatch({
      $type : this.getClassName(),
      $content : {
        instance : this,
        prevStatus : prevStatus
      }
    })
  }

  setField(newStatus) {
    this[newStatus.field] = newStatus.value;
  }

  getClassName() {
    return this.constructor.name;
  }
}

module.exports = ModelStationBase;
