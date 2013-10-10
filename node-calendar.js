/*!
 * node-calendar
 * Copyright(c) 2013 Armin Tamzarian <tamzarian1989@gmail.com>
 * MIT Licensed
 */

(function() {


    /**
     * Base calendar class. This class doesn't do any formatting. It simply
     * provides data to subclasses.
     *
     * @param {Number} firstweekday
     * @api public
     */
    function Calendar(firstweekday) {
      this._firstweekday = typeof(firstweekday) === "undefined" ? 0 : firstweekday;

      this._oneday = 1000 * 60 * 60 * 24;
      this._onehour = 1000 * 60 * 60;
    }

    /**
     * Adjust the provided weekday index from the Javascript index scheme
     * (SUN=0, MON=1, ...) to the Python scheme (MON=0, TUE=1, ...)
     *
     * @api private
     */
    Calendar.prototype._adjustWeekday = function(weekday) {
      return weekday > 0 ? weekday - 1 : 6
    }

    /**
     * Getter for firstweekday
     *
     * @api public
     */
    Calendar.prototype.getfirstweekday = function() {
      return this._firstweekday;
    }

    /**
     * Setter for firstweekday
     *
     * @param {Number} firstweekday
     * @api public
     */
    Calendar.prototype.setfirstweekday = function(firstweekday) {
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
      var day = this._adjustWeekday(date.getDay());
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

        if(date.getMonth() !== month - 1 && this._adjustWeekday(date.getDay()) === this._firstweekday) {
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
        return value.getMonth() === month - 1 ? [value.getDate(), this._adjustWeekday(value.getDay())] : [0, this._adjustWeekday(value.getDay())];
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

    var _global = this;

    /* Initialization methodology courtesy node-uuid: https://github.com/broofa/node-uuid */
    if (typeof(module) != 'undefined' && module.exports) {
      // Publish as node.js module
      module.exports = Calendar;
    } else {
      // Publish as global (in browsers)
      var _previousRoot = _global.calendar;

      // **`noConflict()` - (browser only) to reset global 'Calendar' var**
      Calendar.noConflict = function() {
        _global.Calendar = _previousRoot;
        return Calendar;
      };

      _global.Calendar = Calendar;
    }

}).call(this);

