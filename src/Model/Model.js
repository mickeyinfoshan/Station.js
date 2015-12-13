/*
	@author : Mickey
	@email : mickey.in.foshan@gmail.com

	****************************************

	Model, which is inherited from Base, is developed to
  solve the problem that it's no easy job to detect the changes of a model.
  Something similar to Observer pattern is used here. When the `set` method is called,
  the instance will dispatch the information to all it's `destinations`(Observers).

  For more information, read the test!

*/


'use strict';

const Base = require("../Base/Base.js");

class Model extends Base {

  //get the value of the field provided
  get(fieldName) {
    return this[fieldName];
  }

  //change the value of the field provided and dispatch the information to its Observers
  set(newStatus) {
    var prevStatus = {};
    for(var field in newStatus) {
      prevStatus[field] = this.get(field);
      this._setField({
        field : field,
        value : newStatus[field]
      });
    }

    //dispatch the information to Observers
    this.dispatch({
      $type : this._getClassName() + ".change",
      $content : {
        instance : this,
        prevStatus : prevStatus
      }
    });
  }

  //change the value of a certain field
  _setField(newStatus) {
    this[newStatus.field] = newStatus.value;
  }

  //get the class name of the instance
  _getClassName() {
    return this.constructor.name;
  }
}

module.exports = Model;
