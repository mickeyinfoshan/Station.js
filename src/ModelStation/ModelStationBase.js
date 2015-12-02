'use strict';

const DataStationBase = require("../DataStation/DataStationBase.js");

var objectAssign = require("object-assign");

class ModelStationBase extends DataStationBase {
  get(fieldName) {
    return this[fieldName];
  }
  set(newStatus) {
    var prevStatus = {};
    objectAssign(prevStatus, newStatus);
    for(var field in newStatus) {
      prevStatus[field] = this.get(field);
      this._setField({
        field : field,
        value : newStatus[field]
      });
    }

    this.dispatch({
      $type : this.getClassName() + ".change",
      $content : {
        instance : this,
        prevStatus : prevStatus
      }
    });
  }

  _setField(newStatus) {
    this[newStatus.field] = newStatus.value;
  }

  getClassName() {
    return this.constructor.name;
  }
}

module.exports = ModelStationBase;
