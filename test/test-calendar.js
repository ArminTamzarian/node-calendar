if(!this.calendar) {
  assert          = require("assert");
  calendar        = require('../node-calendar');
  expected_year   = require("./data/expected_year");
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

describe('node-calendar calendar tests.', function() {
  describe('#isleap', function() {
    it('Make sure that the return is right for a few years.', function() {
      assert.ok(calendar.isleap(2000));
      assert.ok(!calendar.isleap(2001));
      assert.ok(!calendar.isleap(2002));
      assert.ok(!calendar.isleap(2003));
    });
  });

  describe('#leapdays', function() {
    it('Verify some leap day test cases.', function() {
      assert.equal(calendar.leapdays(2010,2010), 0);
      assert.equal(calendar.leapdays(2010,2011), 0);
      assert.equal(calendar.leapdays(2010,2012), 0);
      assert.equal(calendar.leapdays(2012,2013), 1);
      assert.equal(calendar.leapdays(1997,2020), 5);
    });
  });

  describe('#monthrange', function() {
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

  describe('#timegm', function() {
    it('Verify some day time stamps.', function() {
      assert.equal(calendar.timegm([1970, 1, 1, 0, 0, 0]), 0);
      assert.equal(calendar.timegm([1999, 12, 31, 23, 59, 59]), 946684799);
      assert.equal(calendar.timegm([2000, 1, 1, 0, 0, 0]), 946684800);
      assert.equal(calendar.timegm([2000, 1, 2, 3, 4, 5]), 946782245);
      assert.equal(calendar.timegm([2038, 1, 19, 3, 14, 7]), 2147483647);
      assert.equal(calendar.timegm([2038, 1, 19, 3, 14, 8]), 2147483648);
      assert.equal(calendar.timegm([2999, 1, 1, 0, 0, 0]), 32472144000);
    });

    it('Tests low invalid boundary case.', function() {
      assert.throws(function() {
          calendar.timegm([2000, 0, 1, 0, 0, 0]);
      }, calendar.IllegalMonthError);
      assert.throws(function() {
          calendar.timegm([2000, 1, 0, 0, 0, 0]);
      }, calendar.IllegalDayError);
      assert.throws(function() {
          calendar.timegm([2000, 1, 1, -1, 0, 0]);
      }, calendar.IllegalTimeError);
      assert.throws(function() {
          calendar.timegm([2000, 1, 1, 0, -1, 0]);
      }, calendar.IllegalTimeError);
      assert.throws(function() {
          calendar.timegm([2000, 1, 1, 0, 0, -1]);
      }, calendar.IllegalTimeError);
    });

    it('Tests high invalid boundary case.', function() {
      assert.throws(function() {
          calendar.timegm([2000, 13, 1, 0, 0, 0]);
      }, calendar.IllegalMonthError);
      assert.throws(function() {
          calendar.timegm([2000, 1, 40, 0, 0, 0]);
      }, calendar.IllegalDayError);
      assert.throws(function() {
          calendar.timegm([2000, 1, 1, 24, 0, 0]);
      }, calendar.IllegalTimeError);
      assert.throws(function() {
          calendar.timegm([2000, 1, 1, 0, 60, 0]);
      }, calendar.IllegalTimeError);
      assert.throws(function() {
          calendar.timegm([2000, 1, 1, 0, 0, 60]);
      }, calendar.IllegalTimeError);
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

    describe('Calendar()', function() {
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

    describe('#setfirstweekday()', function() {
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

    describe('#yeardayscalendar()', function() {
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
