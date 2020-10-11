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
    // https://stackoverflow.com/a/5782563
    slugify: function(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
        var to   = "aaaaaeeeeeiiiiooooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    },
};

module.exports = helpers;
