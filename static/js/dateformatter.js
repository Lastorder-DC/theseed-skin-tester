"use strict";

var dateFormatter = (function () {
  function dateFormatter() { }

  /*
  swig/dateFormatter.js

  Swig is licensed under the MIT License:
  Copyright (c) 2010-2013 Paul Armstrong
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */

  /*
    Remove utils.js requirement
    16-07-06
  */

  var _months = {
      full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    _days = {
      full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      alt: {'-1': 'Yesterday', 0: 'Today', 1: 'Tomorrow'}
    };

  /*
  DateZ is licensed under the MIT License:
  Copyright (c) 2011 Tomo Universalis (http://tomouniversalis.com)
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */
  dateFormatter.tzOffset = 0;
  dateFormatter.DateZ = function () {
    var members = {
        'default': ['getUTCDate', 'getUTCDay', 'getUTCFullYear', 'getUTCHours', 'getUTCMilliseconds', 'getUTCMinutes', 'getUTCMonth', 'getUTCSeconds', 'toISOString', 'toGMTString', 'toUTCString', 'valueOf', 'getTime'],
        z: ['getDate', 'getDay', 'getFullYear', 'getHours', 'getMilliseconds', 'getMinutes', 'getMonth', 'getSeconds', 'getYear', 'toDateString', 'toLocaleDateString', 'toLocaleTimeString']
      },
      d = this;

    d.date = d.dateZ = (arguments.length > 1) ? new Date(Date.UTC.apply(Date, arguments) + ((new Date()).getTimezoneOffset() * 60000)) : (arguments.length === 1) ? new Date(new Date(arguments['0'])) : new Date();

    d.timezoneOffset = d.dateZ.getTimezoneOffset();

    for (var i in members.z) {
      var name = members.z[i];
      d[name] = function () {
        return d.dateZ[name]();
      };
    }
    for (var i in members['default']) {
      var name = members['default'][i];
      d[name] = function () {
        return d.date[name]();
      };
    }

    this.setTimezoneOffset(dateFormatter.tzOffset);
  };
  dateFormatter.DateZ.prototype = {
    getTimezoneOffset: function () {
      return this.timezoneOffset;
    },
    setTimezoneOffset: function (offset) {
      this.timezoneOffset = offset;
      this.dateZ = new Date(this.date.getTime() + this.date.getTimezoneOffset() * 60000 - this.timezoneOffset * 60000);
      return this;
    }
  };

  // Day
  dateFormatter.d = function (input) {
    return (input.getDate() < 10 ? '0' : '') + input.getDate();
  };
  dateFormatter.D = function (input) {
    return _days.abbr[input.getDay()];
  };
  dateFormatter.j = function (input) {
    return input.getDate();
  };
  dateFormatter.l = function (input) {
    return _days.full[input.getDay()];
  };
  dateFormatter.N = function (input) {
    var d = input.getDay();
    return (d >= 1) ? d : 7;
  };
  dateFormatter.S = function (input) {
    var d = input.getDate();
    return (d % 10 === 1 && d !== 11 ? 'st' : (d % 10 === 2 && d !== 12 ? 'nd' : (d % 10 === 3 && d !== 13 ? 'rd' : 'th')));
  };
  dateFormatter.w = function (input) {
    return input.getDay();
  };
  dateFormatter.z = function (input, offset, abbr) {
    var year = input.getFullYear(),
      e = new dateFormatter.DateZ(year, input.getMonth(), input.getDate(), 12, 0, 0),
      d = new dateFormatter.DateZ(year, 0, 1, 12, 0, 0);

    e.setTimezoneOffset(offset, abbr);
    d.setTimezoneOffset(offset, abbr);
    return Math.round((e - d) / 86400000);
  };

  // Week
  dateFormatter.W = function (input) {
    var target = new Date(input.valueOf()),
      dayNr = (input.getDay() + 6) % 7,
      fThurs;

    target.setDate(target.getDate() - dayNr + 3);
    fThurs = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }

    return 1 + Math.ceil((fThurs - target) / 604800000);
  };

  // Month
  dateFormatter.F = function (input) {
    return _months.full[input.getMonth()];
  };
  dateFormatter.m = function (input) {
    return (input.getMonth() < 9 ? '0' : '') + (input.getMonth() + 1);
  };
  dateFormatter.M = function (input) {
    return _months.abbr[input.getMonth()];
  };
  dateFormatter.n = function (input) {
    return input.getMonth() + 1;
  };
  dateFormatter.t = function (input) {
    return 32 - (new Date(input.getFullYear(), input.getMonth(), 32).getDate());
  };

  // Year
  dateFormatter.L = function (input) {
    return new Date(input.getFullYear(), 1, 29).getDate() === 29;
  };
  dateFormatter.o = function (input) {
    var target = new Date(input.valueOf());
    target.setDate(target.getDate() - ((input.getDay() + 6) % 7) + 3);
    return target.getFullYear();
  };
  dateFormatter.Y = function (input) {
    return input.getFullYear();
  };
  dateFormatter.y = function (input) {
    return (input.getFullYear().toString()).substr(2);
  };

  // Time
  dateFormatter.a = function (input) {
    return input.getHours() < 12 ? 'am' : 'pm';
  };
  dateFormatter.A = function (input) {
    return input.getHours() < 12 ? 'AM' : 'PM';
  };
  dateFormatter.B = function (input) {
    var hours = input.getUTCHours(), beats;
    hours = (hours === 23) ? 0 : hours + 1;
    beats = Math.abs(((((hours * 60) + input.getUTCMinutes()) * 60) + input.getUTCSeconds()) / 86.4).toFixed(0);
    return ('000'.concat(beats).slice(beats.length));
  };
  dateFormatter.g = function (input) {
    var h = input.getHours();
    return h === 0 ? 12 : (h > 12 ? h - 12 : h);
  };
  dateFormatter.G = function (input) {
    return input.getHours();
  };
  dateFormatter.h = function (input) {
    var h = input.getHours();
    return ((h < 10 || (12 < h && 22 > h)) ? '0' : '') + ((h < 12) ? h : h - 12);
  };
  dateFormatter.H = function (input) {
    var h = input.getHours();
    return (h < 10 ? '0' : '') + h;
  };
  dateFormatter.i = function (input) {
    var m = input.getMinutes();
    return (m < 10 ? '0' : '') + m;
  };
  dateFormatter.s = function (input) {
    var s = input.getSeconds();
    return (s < 10 ? '0' : '') + s;
  };
  //u = function () { return ''; },

  // Timezone
  //e = function () { return ''; },
  //I = function () { return ''; },
  dateFormatter.O = function (input) {
    var tz = input.getTimezoneOffset();
    /* temporary fix. original = tz < 0 */
    return (tz > 0 ? '-' : '+') + (tz / 60 < 10 ? '0' : '') + Math.abs((tz / 60)) + '00';
  };
  //T = function () { return ''; },
  dateFormatter.Z = function (input) {
    return input.getTimezoneOffset() * 60;
  };

  // Full Date/Time
  dateFormatter.c = function (input) {
    return input.toISOString();
  };
  dateFormatter.r = function (input) {
    return input.toUTCString();
  };
  dateFormatter.U = function (input) {
    return input.getTime() / 1000;
  };

  return dateFormatter;
})();

function formatDate(date, format) {
  if (typeof format === 'undefined') {
    format = "Y-m-d H:i:sO";
  }

  var l = format.length,
    cur,
    i = 0,
    out = '';

  for (i; i < l; i += 1) {
    cur = format.charAt(i);
    if (cur === '\\') {
      i += 1;
      out += (i < l) ? format.charAt(i) : cur;
    } else if (dateFormatter.hasOwnProperty(cur)) {
      out += dateFormatter[cur](date);
    } else {
      out += cur;
    }
  }
  return out;
}
