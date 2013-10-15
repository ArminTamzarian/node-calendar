if(!this.calendar) {
  assert          = require("assert");
  calendar        = require('../node-calendar');
  expected_year   = require("./data/expected_year");
  expected_locale = require("./data/expected_locale");
}
else {
  assert = new (function() {
    this.ok = function(value, message) {
      if(!value) {
        throw new Error(message);
      }
    };

    this.equal = function(value, expected, message) {
      if(value !== expected) {
        throw new Error(message);
      }
    };

    this.throws = function(func, error) {
      try {
        func();
        throw new Error('Expected error not thrown.');
      }
      catch(err) {
        if(err.name !== error.name) {
          throw new Error('Incorrect error type.');
        }
      }
    };
  })();
}

function compare_year_equality(values, results) {
  for(var month_row_i = 0; month_row_i < values.length; month_row_i++) {
    for(var month_i=0; month_i < values[month_row_i].length; month_i++) {
      assert.equal(
        values[month_row_i][month_i].length,
        results[month_row_i][month_i].length,
        'Length of test results month week size is that of the expected results.'
      );

      compare_month_equality(values[month_row_i][month_i], results[month_row_i][month_i]);
    }
  }
}

function compare_month_equality(values, results) {
    for(var week_i=0; week_i < values.length; week_i++) {
      assert.equal(
        values[week_i].length,
        7,
        'Length of all weeks should be 7.'
      );

      for(var day_i=0; day_i < values[week_i].length; day_i++) {
        assert.equal(
          values[week_i][day_i],
          results[week_i][day_i],
          'Ensure value of each test result day is that of the expected results.'
        );
      }
    }
}

describe('calendar', function() {
  describe('#setlocale', function(){
    try {
      var cldr = require("cldr");
    }
    catch(err) {
      it('Test locale integration without installed cldr module', function() {
        for(var month_full_i=0; month_full_i < calendar.month_name.length; month_full_i++) {
          assert.ok(expected_locale["month"]["full"].indexOf(calendar.month_name[month_full_i]) > -1);
        }
        for(var month_abbr_i=0; month_abbr_i < calendar.month_abbr.length; month_abbr_i++) {
          assert.ok(expected_locale["month"]["abbr"].indexOf(calendar.month_abbr[month_abbr_i]) > -1);
        }
        for(var day_full_i=0; day_full_i < calendar.day_name.length; day_full_i++) {
          assert.ok(expected_locale["day"]["full"].indexOf(calendar.day_name[day_full_i]) > -1);
        }
        for(var day_abbr_i=0; day_abbr_i < calendar.day_abbr.length; day_abbr_i++) {
          assert.ok(expected_locale["day"]["abbr"].indexOf(calendar.day_abbr[day_abbr_i]) > -1);
        }
      });
    }
  });

  describe('#isleap', function(){
    it('Make sure that the return is right for a few years.', function() {
      assert.ok(calendar.isleap(2000));
      assert.ok(!calendar.isleap(2001));
      assert.ok(!calendar.isleap(2002));
      assert.ok(!calendar.isleap(2003));
    });
  });

  describe('#leapdays', function(){
    it('Verify some leap day test cases.', function() {
      assert.equal(calendar.leapdays(2010,2010), 0);
      assert.equal(calendar.leapdays(2010,2011), 0);
      assert.equal(calendar.leapdays(2010,2012), 0);
      assert.equal(calendar.leapdays(2012,2013), 1);
      assert.equal(calendar.leapdays(1997,2020), 5);
    });
  });

  describe('#monthrange', function(){
    it('Tests valid lower boundary case.', function() {
      var range = calendar.monthrange(2004,1);
      assert.equal(range[0], 3);
      assert.equal(range[1], 31);
    });

    it('Tests February during leap year.', function() {
      var range = calendar.monthrange(2004,2);
      assert.equal(range[0], 6);
      assert.equal(range[1], 29);
    });

    it('Tests February during non-leap year.', function() {
      var range = calendar.monthrange(2010,2);
      assert.equal(range[0], 0);
      assert.equal(range[1], 28);
    });

    it('Tests valid upper boundary case.', function() {
      var range = calendar.monthrange(2004,12);
      assert.equal(range[0], 2);
      assert.equal(range[1], 31);
    });

    it('Tests low invalid boundary case.', function() {
      assert.throws(function() {
          calendar.monthrange(2004,0);
      }, calendar.IllegalMonthError);
    });

    it('Tests high invalid boundary case.', function() {
      assert.throws(function() {
          calendar.monthrange(2004,13);
      }, calendar.IllegalMonthError);
    });
  });

  describe('Calendar', function() {
    var calendar_mon = new calendar.Calendar(calendar.MONDAY)
      , calendar_tue = new calendar.Calendar(calendar.TUESDAY)
      , calendar_wed = new calendar.Calendar(calendar.WEDNESDAY)
      , calendar_thu = new calendar.Calendar(calendar.THURSDAY)
      , calendar_fri = new calendar.Calendar(calendar.FRIDAY)
      , calendar_sat = new calendar.Calendar(calendar.SATURDAY)
      , calendar_sun = new calendar.Calendar(calendar.SUNDAY)
      , calendar_nul = new calendar.Calendar();

    describe('Calendar()', function(){
      it('Tests low invalid boundary case.', function() {
        assert.throws(function() {
            calendar.Calendar(-1);
        }, calendar.IllegalWeekdayError);
      });

      it('Tests high invalid boundary case.', function() {
        assert.throws(function() {
            calendar.Calendar(7);
        }, calendar.IllegalWeekdayError);
      });
    });

    describe('#setfirstweekday()', function(){
      var calendar_test = new calendar.Calendar();

      it('Tests low invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.setfirstweekday(-1);
        }, calendar.IllegalWeekdayError);
      });

      it('Tests high invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.setfirstweekday(7);
        }, calendar.IllegalWeekdayError);
      });
    })

    describe('#yeardayscalendar()', function(){
      it('No-parameter calendar should equal MONDAY-based calendar.', function() {
        compare_year_equality(calendar_nul.yeardayscalendar(1969), calendar_mon.yeardayscalendar(1969));
        compare_year_equality(calendar_nul.yeardayscalendar(2004), calendar_mon.yeardayscalendar(2004));
        compare_year_equality(calendar_nul.yeardayscalendar(2039), calendar_mon.yeardayscalendar(2039));
      });

      it('1969y tests should be entirely equal.', function() {

        compare_year_equality(calendar_mon.yeardayscalendar(1969), expected_year["1969"]["MON"]);
        compare_year_equality(calendar_tue.yeardayscalendar(1969), expected_year["1969"]["TUE"]);
        compare_year_equality(calendar_wed.yeardayscalendar(1969), expected_year["1969"]["WED"]);
        compare_year_equality(calendar_thu.yeardayscalendar(1969), expected_year["1969"]["THU"]);
        compare_year_equality(calendar_fri.yeardayscalendar(1969), expected_year["1969"]["FRI"]);
        compare_year_equality(calendar_sat.yeardayscalendar(1969), expected_year["1969"]["SAT"]);
        compare_year_equality(calendar_sun.yeardayscalendar(1969), expected_year["1969"]["SUN"]);
      });

      it('2004y tests should be entirely equal.', function() {
        compare_year_equality(calendar_mon.yeardayscalendar(2004), expected_year["2004"]["MON"]);
        compare_year_equality(calendar_tue.yeardayscalendar(2004), expected_year["2004"]["TUE"]);
        compare_year_equality(calendar_wed.yeardayscalendar(2004), expected_year["2004"]["WED"]);
        compare_year_equality(calendar_thu.yeardayscalendar(2004), expected_year["2004"]["THU"]);
        compare_year_equality(calendar_fri.yeardayscalendar(2004), expected_year["2004"]["FRI"]);
        compare_year_equality(calendar_sat.yeardayscalendar(2004), expected_year["2004"]["SAT"]);
        compare_year_equality(calendar_sun.yeardayscalendar(2004), expected_year["2004"]["SUN"]);
      });

      it('2039y tests should be entirely equal.', function() {
        compare_year_equality(calendar_mon.yeardayscalendar(2039), expected_year["2039"]["MON"]);
        compare_year_equality(calendar_tue.yeardayscalendar(2039), expected_year["2039"]["TUE"]);
        compare_year_equality(calendar_wed.yeardayscalendar(2039), expected_year["2039"]["WED"]);
        compare_year_equality(calendar_thu.yeardayscalendar(2039), expected_year["2039"]["THU"]);
        compare_year_equality(calendar_fri.yeardayscalendar(2039), expected_year["2039"]["FRI"]);
        compare_year_equality(calendar_sat.yeardayscalendar(2039), expected_year["2039"]["SAT"]);
        compare_year_equality(calendar_sun.yeardayscalendar(2039), expected_year["2039"]["SUN"]);
      });
    })
  })
});
