if(!this.calendar) {
  assert                     = require("assert");
  calendar                   = require('../node-calendar');
  expected_yeardatescalendar = require("./data/expected_yeardatescalendar");
  expected_yeardayscalendar  = require("./data/expected_yeardayscalendar");
  expected_yeardays2calendar = require("./data/expected_yeardays2calendar");
}

function compare_year_equality(values, results, equality_function) {
  for(var month_row_i = 0; month_row_i < values.length; month_row_i++) {
    for(var month_i=0; month_i < values[month_row_i].length; month_i++) {
      assert.equal(
        values[month_row_i][month_i].length,
        results[month_row_i][month_i].length,
        'Length of test results month week size is that of the expected results. (' + values[month_row_i][month_i].length + ' !== ' + results[month_row_i][month_i].length + ')'
      );

      compare_month_equality(values[month_row_i][month_i], results[month_row_i][month_i], equality_function);
    }
  }
}

function compare_month_equality(values, results, equality_function) {
    for(var week_i=0; week_i < values.length; week_i++) {
      assert.equal(
        values[week_i].length,
        7,
        'Length of all weeks should be 7.  (' + values[week_i].length + ' !== 7)'
      );

      for(var day_i=0; day_i < values[week_i].length; day_i++) {
        equality_function(values[week_i][day_i], results[week_i][day_i]);
      }
    }
}

function compare_day_dates(value, result) {
  assert.equal(value.getTime(), result.getTime(), 'Ensure value of each test result day is that of the expected result. (' + value.getTime() + ' !== ' + result.getTime() + ')');
}

function compare_day_yeardatescalendar(value, result) {
  assert.equal(value.getFullYear(),  result[0], 'Ensure value of each test result year is that of the expected result. (' + value.getFullYear() + ' !== ' + result[0] + ')');
  assert.equal(value.getMonth(),     result[1], 'Ensure value of each test result month is that of the expected result. (' + value.getMonth() + ' !== ' + result[1] + ')');
  assert.equal(value.getDate(),      result[2], 'Ensure value of each test result day is that of the expected result. (' + value.getDate() + ' !== ' + result[2] + ')');
}

function compare_day_yeardayscalendar(value, result) {
  assert.equal(value, result, 'Ensure value of each test result day is that of the expected results.');
}

function compare_day_yeardays2calendar(value, result) {
  assert.equal(value[0], result[0], 'Ensure value of each test result day is that of the expected result. (' + value[0] + ' !== ' + result[0] + ')');
  assert.equal(value[1], result[1], 'Ensure value of each test result weekday is that of the expected result. (' + value[1] + ' !== ' + result[1] + ')');
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
      assert.equal(calendar.timegm([2004, 2, 29, 0, 0, 0]), 1078012800);
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

  describe('#weekday', function() {
    it('Make sure that the return is right for a few dates.', function() {
      assert.equal(calendar.weekday(1970, 1, 1), 3);
      assert.equal(calendar.weekday(2004, 2, 29), 6);
    });

    it('Tests low invalid boundary case.', function() {
      assert.throws(function() {
          calendar.weekday(2000, 0, 1);
      }, calendar.IllegalMonthError);
      assert.throws(function() {
          calendar.weekday(2000, 1, 0);
      }, calendar.IllegalDayError);
    });

    it('Tests high invalid boundary case.', function() {
      assert.throws(function() {
          calendar.weekday(2000, 13, 1);

      }, calendar.IllegalMonthError);
      assert.throws(function() {
          calendar.weekday(2000, 1, 32);
      }, calendar.IllegalDayError);
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

    describe('#getfirstweekday()', function() {
      it('Make sure that the return is right for a few first days.', function() {
        var calendar_test = new calendar.Calendar();
        assert.equal(calendar_test.getfirstweekday(), 0);

        calendar_test.setfirstweekday(4);
        assert.equal(calendar_test.getfirstweekday(), 4);
      });
    });

    describe('#iterweekdays()', function() {
      it('Make sure that the return is right for a few first days.', function() {
        var results = new calendar.Calendar(3).iterweekdays();
        var expected = [ 3, 4, 5, 6, 0, 1, 2 ];

        for(var i=0; i < results.length; i++) {
          assert.equal(results[i], expected[i]);
        }
      });
    });

    describe('#itermonthdates()', function() {
      var calendar_test = new calendar.Calendar();

      it('Tests low invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.itermonthdates(2000, 0);
        }, calendar.IllegalMonthError);
      });

      it('Tests high invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.itermonthdates(2000, 13);
        }, calendar.IllegalMonthError);
      });
    });

    describe('#itermonthdays()', function() {
      var calendar_test = new calendar.Calendar();

      it('Tests low invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.itermonthdays(2000, 0);
        }, calendar.IllegalMonthError);
      });

      it('Tests high invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.itermonthdays(2000, 13);
        }, calendar.IllegalMonthError);
      });
    });

    describe('#itermonthdays2()', function() {
      var calendar_test = new calendar.Calendar();

      it('Tests low invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.itermonthdays2(2000, 0);
        }, calendar.IllegalMonthError);
      });

      it('Tests high invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.itermonthdays2(2000, 13);
        }, calendar.IllegalMonthError);
      });
    });

    describe('#monthdatescalendar()', function() {
      var calendar_test = new calendar.Calendar();

      it('Tests low invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.monthdatescalendar(2000, 0);
        }, calendar.IllegalMonthError);
      });

      it('Tests high invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.monthdatescalendar(2000, 13);
        }, calendar.IllegalMonthError);
      });
    });

    describe('#monthdayscalendar()', function() {
      var calendar_test = new calendar.Calendar();

      it('Tests low invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.monthdayscalendar(2000, 0);
        }, calendar.IllegalMonthError);
      });

      it('Tests high invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.monthdayscalendar(2000, 13);
        }, calendar.IllegalMonthError);
      });
    });

    describe('#monthdays2calendar()', function() {
      var calendar_test = new calendar.Calendar();

      it('Tests low invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.monthdays2calendar(2000, 0);
        }, calendar.IllegalMonthError);
      });

      it('Tests high invalid boundary case.', function() {
        assert.throws(function() {
            calendar_test.monthdays2calendar(2000, 13);
        }, calendar.IllegalMonthError);
      });
    });

    describe('#yeardatescalendar()', function() {
      it('No-parameter calendar should equal MONDAY-based calendar.', function() {
        compare_year_equality(calendar_nul.yeardatescalendar(1969), calendar_mon.yeardatescalendar(1969), compare_day_dates);
        compare_year_equality(calendar_nul.yeardatescalendar(2004), calendar_mon.yeardatescalendar(2004), compare_day_dates);
        compare_year_equality(calendar_nul.yeardatescalendar(2039), calendar_mon.yeardatescalendar(2039), compare_day_dates);
      });

      it('1969y tests should be entirely equal.', function() {
        compare_year_equality(calendar_mon.yeardatescalendar(1969), expected_yeardatescalendar["1969"]["MON"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_tue.yeardatescalendar(1969), expected_yeardatescalendar["1969"]["TUE"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_wed.yeardatescalendar(1969), expected_yeardatescalendar["1969"]["WED"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_thu.yeardatescalendar(1969), expected_yeardatescalendar["1969"]["THU"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_fri.yeardatescalendar(1969), expected_yeardatescalendar["1969"]["FRI"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_sat.yeardatescalendar(1969), expected_yeardatescalendar["1969"]["SAT"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_sun.yeardatescalendar(1969), expected_yeardatescalendar["1969"]["SUN"], compare_day_yeardatescalendar);
      });

      it('2004y tests should be entirely equal.', function() {
        compare_year_equality(calendar_mon.yeardatescalendar(2004), expected_yeardatescalendar["2004"]["MON"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_tue.yeardatescalendar(2004), expected_yeardatescalendar["2004"]["TUE"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_wed.yeardatescalendar(2004), expected_yeardatescalendar["2004"]["WED"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_thu.yeardatescalendar(2004), expected_yeardatescalendar["2004"]["THU"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_fri.yeardatescalendar(2004), expected_yeardatescalendar["2004"]["FRI"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_sat.yeardatescalendar(2004), expected_yeardatescalendar["2004"]["SAT"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_sun.yeardatescalendar(2004), expected_yeardatescalendar["2004"]["SUN"], compare_day_yeardatescalendar);
      });

      it('2039y tests should be entirely equal.', function() {
        compare_year_equality(calendar_mon.yeardatescalendar(2039), expected_yeardatescalendar["2039"]["MON"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_tue.yeardatescalendar(2039), expected_yeardatescalendar["2039"]["TUE"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_wed.yeardatescalendar(2039), expected_yeardatescalendar["2039"]["WED"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_thu.yeardatescalendar(2039), expected_yeardatescalendar["2039"]["THU"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_fri.yeardatescalendar(2039), expected_yeardatescalendar["2039"]["FRI"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_sat.yeardatescalendar(2039), expected_yeardatescalendar["2039"]["SAT"], compare_day_yeardatescalendar);
        compare_year_equality(calendar_sun.yeardatescalendar(2039), expected_yeardatescalendar["2039"]["SUN"], compare_day_yeardatescalendar);
      });
    });

    describe('#yeardayscalendar()', function() {
      it('No-parameter calendar should equal MONDAY-based calendar.', function() {
        compare_year_equality(calendar_nul.yeardayscalendar(1969), calendar_mon.yeardayscalendar(1969), compare_day_yeardayscalendar);
        compare_year_equality(calendar_nul.yeardayscalendar(2004), calendar_mon.yeardayscalendar(2004), compare_day_yeardayscalendar);
        compare_year_equality(calendar_nul.yeardayscalendar(2039), calendar_mon.yeardayscalendar(2039), compare_day_yeardayscalendar);
      });

      it('1969y tests should be entirely equal.', function() {
        compare_year_equality(calendar_mon.yeardayscalendar(1969), expected_yeardayscalendar["1969"]["MON"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_tue.yeardayscalendar(1969), expected_yeardayscalendar["1969"]["TUE"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_wed.yeardayscalendar(1969), expected_yeardayscalendar["1969"]["WED"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_thu.yeardayscalendar(1969), expected_yeardayscalendar["1969"]["THU"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_fri.yeardayscalendar(1969), expected_yeardayscalendar["1969"]["FRI"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_sat.yeardayscalendar(1969), expected_yeardayscalendar["1969"]["SAT"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_sun.yeardayscalendar(1969), expected_yeardayscalendar["1969"]["SUN"], compare_day_yeardayscalendar);
      });

      it('2004y tests should be entirely equal.', function() {
        compare_year_equality(calendar_mon.yeardayscalendar(2004), expected_yeardayscalendar["2004"]["MON"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_tue.yeardayscalendar(2004), expected_yeardayscalendar["2004"]["TUE"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_wed.yeardayscalendar(2004), expected_yeardayscalendar["2004"]["WED"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_thu.yeardayscalendar(2004), expected_yeardayscalendar["2004"]["THU"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_fri.yeardayscalendar(2004), expected_yeardayscalendar["2004"]["FRI"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_sat.yeardayscalendar(2004), expected_yeardayscalendar["2004"]["SAT"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_sun.yeardayscalendar(2004), expected_yeardayscalendar["2004"]["SUN"], compare_day_yeardayscalendar);
      });

      it('2039y tests should be entirely equal.', function() {
        compare_year_equality(calendar_mon.yeardayscalendar(2039), expected_yeardayscalendar["2039"]["MON"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_tue.yeardayscalendar(2039), expected_yeardayscalendar["2039"]["TUE"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_wed.yeardayscalendar(2039), expected_yeardayscalendar["2039"]["WED"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_thu.yeardayscalendar(2039), expected_yeardayscalendar["2039"]["THU"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_fri.yeardayscalendar(2039), expected_yeardayscalendar["2039"]["FRI"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_sat.yeardayscalendar(2039), expected_yeardayscalendar["2039"]["SAT"], compare_day_yeardayscalendar);
        compare_year_equality(calendar_sun.yeardayscalendar(2039), expected_yeardayscalendar["2039"]["SUN"], compare_day_yeardayscalendar);
      });
    })

    describe('#yeardays2calendar()', function() {
      it('No-parameter calendar should equal MONDAY-based calendar.', function() {
        compare_year_equality(calendar_nul.yeardays2calendar(1969), calendar_mon.yeardays2calendar(1969), compare_day_yeardays2calendar);
        compare_year_equality(calendar_nul.yeardays2calendar(2004), calendar_mon.yeardays2calendar(2004), compare_day_yeardays2calendar);
        compare_year_equality(calendar_nul.yeardays2calendar(2039), calendar_mon.yeardays2calendar(2039), compare_day_yeardays2calendar);
      });

      it('1969y tests should be entirely equal.', function() {
        compare_year_equality(calendar_mon.yeardays2calendar(1969), expected_yeardays2calendar["1969"]["MON"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_tue.yeardays2calendar(1969), expected_yeardays2calendar["1969"]["TUE"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_wed.yeardays2calendar(1969), expected_yeardays2calendar["1969"]["WED"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_thu.yeardays2calendar(1969), expected_yeardays2calendar["1969"]["THU"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_fri.yeardays2calendar(1969), expected_yeardays2calendar["1969"]["FRI"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_sat.yeardays2calendar(1969), expected_yeardays2calendar["1969"]["SAT"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_sun.yeardays2calendar(1969), expected_yeardays2calendar["1969"]["SUN"], compare_day_yeardays2calendar);
      });

      it('2004y tests should be entirely equal.', function() {
        compare_year_equality(calendar_mon.yeardays2calendar(2004), expected_yeardays2calendar["2004"]["MON"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_tue.yeardays2calendar(2004), expected_yeardays2calendar["2004"]["TUE"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_wed.yeardays2calendar(2004), expected_yeardays2calendar["2004"]["WED"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_thu.yeardays2calendar(2004), expected_yeardays2calendar["2004"]["THU"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_fri.yeardays2calendar(2004), expected_yeardays2calendar["2004"]["FRI"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_sat.yeardays2calendar(2004), expected_yeardays2calendar["2004"]["SAT"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_sun.yeardays2calendar(2004), expected_yeardays2calendar["2004"]["SUN"], compare_day_yeardays2calendar);
      });

      it('2039y tests should be entirely equal.', function() {
        compare_year_equality(calendar_mon.yeardays2calendar(2039), expected_yeardays2calendar["2039"]["MON"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_tue.yeardays2calendar(2039), expected_yeardays2calendar["2039"]["TUE"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_wed.yeardays2calendar(2039), expected_yeardays2calendar["2039"]["WED"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_thu.yeardays2calendar(2039), expected_yeardays2calendar["2039"]["THU"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_fri.yeardays2calendar(2039), expected_yeardays2calendar["2039"]["FRI"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_sat.yeardays2calendar(2039), expected_yeardays2calendar["2039"]["SAT"], compare_day_yeardays2calendar);
        compare_year_equality(calendar_sun.yeardays2calendar(2039), expected_yeardays2calendar["2039"]["SUN"], compare_day_yeardays2calendar);
      });
    });
  })
});
