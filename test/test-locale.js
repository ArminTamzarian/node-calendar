if(!this.calendar) {
  assert          = require("assert");
  calendar        = require('../node-calendar');
  expected_locale = require("./data/expected_locale");
}

function compare_locale_equality(day_name, day_abbr, month_name, month_abbr, results) {
  for(var day_full_i=0; day_full_i < day_name.length; day_full_i++) {
    assert.ok(results["day"]["full"].indexOf(day_name[day_full_i]) > -1);
  }

  for(var day_abbr_i=0; day_abbr_i < day_abbr.length; day_abbr_i++) {
    assert.ok(results["day"]["abbr"].indexOf(day_abbr[day_abbr_i]) > -1);
  }

  for(var month_full_i=0; month_full_i < month_name.length; month_full_i++) {
    assert.ok(results["month"]["full"].indexOf(month_name[month_full_i]) > -1);
  }

  for(var month_abbr_i=0; month_abbr_i < month_abbr.length; month_abbr_i++) {
    assert.ok(results["month"]["abbr"].indexOf(month_abbr[month_abbr_i]) > -1);
  }
}

describe('node-calendar locale tests.', function() {
  describe('#setlocale', function() {
    try {
      var cldr = require("cldr");

      it('Tests invalid locale.', function() {
        assert.throws(function() {
            calendar.setlocale("xx-XX");
          }, calendar.IllegalLocaleError);
      });

      it('Tests locale integration with installed cldr module.', function() {
        compare_locale_equality(calendar.day_name, calendar.day_abbr, calendar.month_name, calendar.month_abbr, expected_locale["default"]);
      });

      it('Tests setlocale "en_US".', function() {
        calendar.setlocale('en_US');
        compare_locale_equality(calendar.day_name, calendar.day_abbr, calendar.month_name, calendar.month_abbr, expected_locale["default"]);
      });

      it('Tests setlocale "fr_FR".', function() {
        calendar.setlocale('fr_FR');
        compare_locale_equality(calendar.day_name, calendar.day_abbr, calendar.month_name, calendar.month_abbr, expected_locale["fr_FR"]);
      });

      it('Tests setlocale "es_ES".', function() {
        calendar.setlocale('es_ES');
        compare_locale_equality(calendar.day_name, calendar.day_abbr, calendar.month_name, calendar.month_abbr, expected_locale["es_ES"]);
      });
    }
    catch(err) {
      it('Tests invalid locale.', function() {
        assert.throws(function() {
            calendar.setlocale("xx-XX");
          }, calendar.IllegalLocaleError);
      });

      it('Tests unsupported locale.', function() {
        assert.throws(function() {
            calendar.setlocale("fr_FR");
          }, calendar.IllegalLocaleError);
      });

      it('Tests locale integration without installed cldr module.', function() {
        compare_locale_equality(calendar.day_name, calendar.day_abbr, calendar.month_name, calendar.month_abbr, expected_locale["default"]);
      });
    }
  });
});
