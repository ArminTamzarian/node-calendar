/*!
 * node-calendar
 * Copyright(c) 2013 Armin Tamzarian <tamzarian1989@gmail.com>
 * MIT Licensed
 */

(function() {

    /**
     * Adjust the provided weekday index from the Javascript index scheme
     * (SUN=0, MON=1, ...) to the Python scheme (MON=0, TUE=1, ...)
     *
     * @api private
     */
    function _adjustWeekday(weekday) {
      return weekday > 0 ? weekday - 1 : 6
    }

    /**
     * Return true for leap years, false for non-leap years.
     *
     * @param {Number} year
     * @api public
     */
    function isleap(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }

    /**
     * Return number of leap years in range [y1, y2).
     * Assumes y1 <= y2.
     *
     * @param {Number} y1
     * @param {Number} y2
     * @api public
     */
    function leapdays(y1, y2) {
      y1--;
      y2--;
      return (Math.floor(y2/4) - Math.floor(y1/4)) - (Math.floor(y2/100) - Math.floor(y1/100)) + (Math.floor(y2/400) - Math.floor(y1/400));
    }

    /**
     * Return starting weekday (0-6 ~ Mon-Sun) and number of days (28-31) for
     * year, month.
     *
     * @param {Number} year
     * @param {Number} month
     * @throws {IllegalMonthError} If the provided month is invalid.
     * @api public
     */
    function monthrange(year, month) {
      if(month < 1 || month > 12) {
        throw new IllegalMonthError();
      }

      var mdays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      var day1 = weekday(year, month, 1);
      var ndays = mdays[month] + (month === 2 && isleap(year));

      return [day1, ndays];
    }

    /**
     * Return weekday (0-6 ~ Mon-Sun) for year (1970-...), month (1-12),
     * day (1-31).
     *
     * @param {Number} year
     * @param {Number} month
     * @param {Number} day
     * @api public
     */
    function weekday(year, month, day) {
      var date = new Date(year, month - 1, day);
      return _adjustWeekday(date.getDay());
    }

    /**
     * Base calendar class. This class doesn't do any formatting. It simply
     * provides data to subclasses.
     *
     * @param {Number} firstweekday
     * @throws {IllegalWeekdayError} If the provided firstweekday is invalid.
     * @api public
     */
    function Calendar(firstweekday) {
      this._firstweekday = typeof(firstweekday) === "undefined" ? 0 : firstweekday;

      if(firstweekday < 0 || firstweekday > 6) {
        throw new IllegalWeekdayError();
      }

      this._oneday = 1000 * 60 * 60 * 24;
      this._onehour = 1000 * 60 * 60;
    }

    /**
     * GET-er for firstweekday
     *
     * @api public
     */
    Calendar.prototype.getfirstweekday = function() {
      return this._firstweekday;
    }

    /**
     * SET-er for firstweekday
     *
     * @param {Number} firstweekday
     * @throws {IllegalWeekdayError} If the provided firstweekday is invalid.
     * @api public
     */
    Calendar.prototype.setfirstweekday = function(firstweekday) {
      if(firstweekday < 0 || firstweekday > 6) {
        throw new IllegalWeekdayError();
      }

      this._firstweekday = firstweekday;
    }

    /**
     * Return an array for one week of weekday numbers starting with the
     * configured first one.
     *
     * @api public
     */
    Calendar.prototype.iterweekdays = function() {
      var weekdays = [];
      for(var i = this._firstweekday; i < this._firstweekday + 7; i++) {
        weekdays.push(i % 7);
      }

      return weekdays;
    }

    /**
     * Return an array for one month. The array will contain Date
     * values and will always iterate through complete weeks, so it will yield
     * dates outside the specified month.
     *
     * @param {Number} year
     * @param {Number} month
     * @api public
     */
    Calendar.prototype.itermonthdates = function(year, month) {
      var date = new Date(year, month - 1, 1);
      var day = _adjustWeekday(date.getDay());
      var days = (day - this._firstweekday)  >= 0 ? (day - this._firstweekday) % 7 : 7 + (day - this._firstweekday);

      date.setTime(date.getTime() - (days * this._oneday));

      var dates = [];
      while(true) {
        dates.push(new Date(date.getTime()));

        var currentDate = date.getDate();
        date.setTime(date.getTime() + this._oneday);

        // Hack to account for DST
        while(date.getDate() === currentDate) {
          date.setTime(date.getTime() + this._onehour);
        }

        if(date.getMonth() !== month - 1 && _adjustWeekday(date.getDay()) === this._firstweekday) {
          break;
        }
      }

      return dates;
    }

    /**
     * Like itermonthdates(), but will yield day numbers. For days outside
     * the specified month the day number is 0.
     *
     * @param {Number} year
     * @param {Number} month
     * @api public
     */
    Calendar.prototype.itermonthdays = function(year, month) {
      return this.itermonthdates(year, month).map(function(value){
        return value.getMonth() === month - 1 ? value.getDate() : 0;
      });
    }

    /**
     * Like itermonthdates(), but will yield [day number, weekday number]
     * arrays. For days outside the specified month the day number is 0.
     *
     * @param {Number} year
     * @param {Number} month
     * @api public
     */
    Calendar.prototype.itermonthdays2 = function(year, month) {
      return this.itermonthdates(year, month).map(function(value){
        return value.getMonth() === month - 1 ? [value.getDate(), _adjustWeekday(value.getDay())] : [0, _adjustWeekday(value.getDay())];
      }, this);
    }

    /**
     * Return a matrix (array of array) representing a month's calendar.
     * Each row represents a week; week entries are Date values.
     *
     * @param {Number} year
     * @param {Number} month
     * @api public
     */
    Calendar.prototype.monthdatescalendar = function(year, month) {
      var days = [];
      dates = this.itermonthdates(year, month);
      for(var i = 0; i < dates.length; i += 7) {
        days.push(dates.slice(i, i + 7));
      }

      return days;
    }

    /**
     * Return a matrix representing a month's calendar.
     * Each row represents a week; days outside this month are zero.
     *
     * @param {Number} year
     * @param {Number} month
     * @api public
     */
    Calendar.prototype.monthdayscalendar = function(year, month) {
      var days = [];
      dates = this.itermonthdays(year, month);
      for(var i = 0; i < dates.length; i += 7) {
        days.push(dates.slice(i, i + 7));
      }

      return days;
    }

    /**
     * Return a matrix representing a month's calendar.
     * Each row represents a week; week entries are
     * [day number, weekday number] arrays. Day numbers outside this month
     * are zero.
     *
     * @param {Number} year
     * @param {Number} month
     * @api public
     */
    Calendar.prototype.monthdays2calendar = function(year, month) {
      var days = [];
      dates = this.itermonthdays2(year, month);
      for(var i = 0; i < dates.length; i += 7) {
        days.push(dates.slice(i, i + 7));
      }

      return days;
    }

    /**
     * Return the data for the specified year ready for formatting. The return
     * value is an array of month rows. Each month row contains up to width months.
     * Each month contains between 4 and 6 weeks and each week contains 1-7
     * days. Days are Date objects.
     *
     * @param {Number} year
     * @param {Number} width
     * @api public
     */
    Calendar.prototype.yeardatescalendar = function(year, width) {
      width = typeof(width) === "undefined" ? 3 : width;

      var months = [];
      for(var month = 1; month <= 12; month++) {
        months.push(this.monthdatescalendar(year, month));
      }

      var rows = [];
      for(var i = 0; i < months.length; i += width) {
        rows.push(months.slice(i, i + width));
      }
      return rows;
    }

    /**
     * Return the data for the specified year ready for formatting (similar to
     * yeardatescalendar()). Entries in the week arrays are day numbers.
     * Day numbers outside this month are zero.
     *
     * @param {Number} year
     * @param {Number} width
     * @api public
     */
    Calendar.prototype.yeardayscalendar = function(year, width) {
      width = typeof(width) === "undefined" ? 3 : width;

      var months = [];
      for(var month = 1; month <= 12; month++) {
        months.push(this.monthdayscalendar(year, month));
      }

      var rows = [];
      for(var i = 0; i < months.length; i += width) {
        rows.push(months.slice(i, i + width));
      }
      return rows;
    }

    /**
     * Return the data for the specified year ready for formatting (similar to
     * yeardatescalendar()). Entries in the week arrays are
     * [day number, weekday number] arrays. Day numbers outside this month are
     * zero.
     *
     * @param {Number} year
     * @param {Number} width
     * @api public
     */
    Calendar.prototype.yeardays2calendar = function(year, width) {
      width = typeof(width) === "undefined" ? 3 : width;

      var months = [];
      for(var month = 1; month <= 12; month++) {
        months.push(this.monthdays2calendar (year, month));
      }

      var rows = [];
      for(var i = 0; i < months.length; i += width) {
        rows.push(months.slice(i, i + width));
      }
      return rows;
    }

    /**
     * Error indicating a month index specified outside of the expected range (1-12 ~ Jan-Dec).
     *
     * @param {String} message
     * @api public
     */
    function IllegalMonthError(message) {
      this.name = "IllegalMonthError";
      this.message = typeof(message) === "undefined" ? "Invalid month specified." : message;
    }
    IllegalMonthError.prototype = new Error();
    IllegalMonthError.prototype.constructor = IllegalMonthError;

    /**
     * Error indicating a weekday index specified outside of the expected range (0-6 ~ Mon-Sun).
     *
     * @param {String} message
     * @api public
     */
    function IllegalWeekdayError(message) {
      this.name = "IllegalWeekdayError ";
      this.message = typeof(message) === "undefined" ? "Invalid weekday specified." : message;
    }
    IllegalWeekdayError .prototype = new Error();
    IllegalWeekdayError .prototype.constructor = IllegalWeekdayError ;

    // export of package-like object with explicit public API
    var calendar = function() {};

    calendar.isleap     = isleap;
    calendar.leapdays   = leapdays;
    calendar.monthrange = monthrange;
    calendar.weekday    = weekday;
    calendar.Calendar   = Calendar;

    calendar.IllegalMonthError   = IllegalMonthError
    calendar.IllegalWeekdayError = IllegalWeekdayError

    calendar.MONDAY     = 0;
    calendar.TUESDAY    = 1;
    calendar.WEDNESDAY  = 2;
    calendar.THURSDAY   = 3;
    calendar.FRIDAY     = 4;
    calendar.SATURDAY   = 5;
    calendar.SUNDAY     = 6;


    // Initialization methodology and noConflict courtesy node-uuid:
    // https://github.com/broofa/node-uuid

    var _global = this;

    // Publish as node.js module
    if (typeof(module) != 'undefined' && module.exports) {
      module.exports = calendar;
    }

    // Publish as global (in browsers)
    else {
      var _previousRoot = _global.calendar;

      /**
        * Reset global 'calendar' variable
        *
        * @api public
        */
      calendar.noconflict = function() {
        _global.calendar = _previousRoot;
        return calendar;
      };

      _global.calendar = calendar;
    }

}).call(this);
