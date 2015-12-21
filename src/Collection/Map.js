
'use strict'

var Base = require("../Base/Base.js");

class DSMap extends Map {

  constructor() {
    super();
    this.$dataStation = new Base();
  }

  getDataStation() {
    return this.$dataStation;
  }

  set(key, value) {
    super.set(key, value);
    this.getDataStation().dispatch({
      $type : `${key}.set`,
      $content : {
        instance : value
      }
    })
  }

  delete(key) {
    var originItem = this.get(key);
    var deleteResult = super.delete(key);
    if(deleteResult) {
      this.getDataStation().dispatch({
        $type : `${key}.delete`,
        $content : {
          instance : originItem
        }
      })
    }
    return deleteResult;
  }

}

module.exports = DSMap;
