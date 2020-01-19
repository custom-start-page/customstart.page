'use strict';

const helpers = {
    // Returns a date in "yyyy-MM-dd" format.
    dateToString: function(date) {
        var month = date.getMonth() + 1;

        if (month < 10) {
            month = '0' + month;
        }

        return date.getFullYear() + '-' + month + '-' + date.getDate();
    },
    /**
     * Check if var is object (and not array).
     * @param {*} obj
    */
    isObject: function(obj) {
        if (obj instanceof Array) {
            return false;
        }

        return obj === Object(obj);
    },
};

module.exports = helpers;
