
'use strict'

var Base = require("../Base/Base.js");

class DSSet extends Set {
  constructor() {
    super();
    this.$dataStation = new Base();
  }

  add(item) {
    if(this.has(item)) {
      return;
    }
    super.add(item);
    var itemClassName = item.constructor.name;
    this.getDataStation().dispatch({
      $type : `${itemClassName}.add`,
      $content : {
        instance : item
      }
    });
  }

  delete(item) {
    var deleteResult = super.delete(item);
    var itemClassName = item.constructor.name;
    if(deleteResult) {
      this.getDataStation().dispatch({
        $type : `${itemClassName}.delete`,
        $content : {
          instance : item
        }
      });
    }

    return deleteResult;
  }

  getDataStation() {
    return this.$dataStation;
  }
}

module.exports = DSSet;
