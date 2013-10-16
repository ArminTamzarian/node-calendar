# node-calendar

A fairly straightforward port of the Python [calendar](http://docs.python.org/3/library/calendar.html?highlight=calendar) package with extensions where appropriate.

This module allows you to output calendars like the Unix cal program, and provides additional useful functions related to the calendar. By default, these calendars have Monday as the first day of the week, and Sunday as the last (the European convention). Use setfirstweekday() to set the first day of the week to Sunday (6) or to any other weekday. Parameters that specify dates are given as integers.

[![Build Status](https://travis-ci.org/ArminTamzarian/node-calendar.png?branch=master)](https://travis-ci.org/ArminTamzarian/node-calendar)

## Getting Started

Install it in your browser:

```html
<script src="node-calendar.js"></script>
```

Or in node.js:

```
npm install node-calendar
```

```javascript
var calendar = require('node-calendar');
```

Then construct a new Calendar object and go to town...

```javascript
var cal = new calendar.Calendar(calendar.SUNDAY);
var yearCalendar = cal.yeardayscalendar(2004);
```

## Locale

Properly implementing locale data via Node or Javascript is a very difficult task due to the fact there there is currently no standard implementation of locale information across Javascript interpreters. As a result node-calendar does not ship with locale functionality available through the browser implementation outside of the default `en_US` locale.

To enable extended locale functionality node-calendar utilizes the optional [cldr](https://github.com/papandreou/node-cldr) module. If node-calendar locates the [cldr](https://github.com/papandreou/node-cldr) module within the either the project-local or node-global module directories you can set your locale via the `calendar.setlocale()` method which will in turn populate the `calendar.month_name`, `calendar.month_abbr`, `calendar.day_name`, `calendar.day_abbr` properties. Note that this functionality is optional and without including this package the default `en_US` locale and its associated data will still be available.

To enable extended locale functionality add the following to the `dependencies` section of your project's `package.json` file:

```javascript
"cldr" : ">=1.0.2"
```

## API

### calendar.isleap(`year`)

Return true for leap years, false for non-leap years.

* `year` - (Number) Year to test.

### calendar.leapdays(`y1`, `y2`)

Return number of leap years in range [y1, y2). Assumes y1 <= y2.

* `y1` - (Number) Beginning year in the range to test.
* `y2` - (Number) Ending year in the range to test.

### calendar.monthrange(`year`, `month`)

Return starting weekday (0-6 ~ Mon-Sun) and number of days (28-31) for year, month.

* `year` - (Number) Year for which the range should be calculated.
* `month` - (Number) Month for which the range should be calculated.
 - Throws `IllegalMonthError` if the provided month is invalid.

### calendar.noconflict()

(Browsers only) Set `calendar` property back to its previous value.

Returns the node-calendar object.

### calendar.setlocale(`[locale]`)

Sets the locale for use in extracting month and weekday names.

* `locale` - (String) Locale to set on the calendar object. `Default: en_US`
 - Throws `IllegalLocaleError` if the provided locale is invalid.

### calendar.timegm(`timegmt`)

Unrelated but handy function to calculate Unix timestamp from GMT.

* `timegmt` - (Array) An array containing the elements from a [time structure](http://docs.python.org/3/library/time.html#time.struct_time) dataset. `Format: [tm_year, tm_mon, tm_mday, tm_hour, tm_min, tm_sec]`
 - Throws `IllegalMonthError` if the provided month element is invalid.
 - Throws `IllegalDayError` if the provided day element is invalid.
 - Throws `IllegalTimeError` if any of the the provided time elements are invalid.

### calendar.weekday(`year`, `month`, `day`)

Return weekday (0-6 ~ Mon-Sun) for year (1970-...), month (1-12), day (1-31).

* `year` - (Number) Year for which the weekday should be calculated.
* `month` - (Number) Month for which the weekday should be calculated.
* `day` - (Number) Day for which the weekday should be calculated.

### calendar.Calendar([`firstweekday`])

Base calendar class. This class doesn't do any formatting. It simply provides data to subclasses.

* `firstweekday` - (Number) Numerical day of the week the calendar weeks should start. (0=MON, 1=TUE, ...) `Default: 0`
 - Throws `IllegalWeekdayError` if the provided weekday is invalid.

### calendar.Calendar.getfirstweekday()

Getter for firstweekday

### calendar.Calendar.setfirstweekday(`firstweekday`)

Setter for firstweekday

* `firstweekday` - (Number) Numerical day of the week the calendar weeks should start. (0=MON, 1=TUE, ...)
 - Throws `IllegalWeekdayError` if the provided weekday is invalid.

### calendar.Calendar.iterweekdays()

Return an array for one week of weekday numbers starting with the configured first one.

### calendar.Calendar.itermonthdates(`year`, `month`)

Return an array for one month. The array will contain Date values and will always iterate through complete weeks, so it will yield dates outside the specified month.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.

### calendar.Calendar.itermonthdays(`year`, `month`)

Like itermonthdates(), but will yield day numbers. For days outside the specified month the day number is 0.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.

### calendar.Calendar.itermonthdays2(`year`, `month`)

Like itermonthdates(), but will yield [day number, weekday number] arrays. For days outside the specified month the day number is 0.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.

### calendar.Calendar.monthdatescalendar(`year`, `month`)

Return a matrix (array of array) representing a month's calendar. Each row represents a week; week entries are Date values.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.

### calendar.Calendar.monthdayscalendar(`year`, `month`)

Return a matrix representing a month's calendar. Each row represents a week; days outside this month are zero.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.

### calendar.Calendar.monthdays2calendar(`year`, `month`)

Return a matrix representing a month's calendar. Each row represents a week; week entries are [day number, weekday number] arrays. Day numbers outside this month are zero.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.

### calendar.Calendar.yeardatescalendar(`year`, [`width`])

Return the data for the specified year ready for formatting. The return value is an array of month rows. Each month row contains up to width months. Each month contains between 4 and 6 weeks and each week contains 1-7 days. Days are Date objects.

* `year` - (Number) Year for which the calendar should be generated.
* `width` - (Number) The number of months to include in each row. Default: 3

### calendar.Calendar.yeardayscalendar(`year`, [`width`])

Return the data for the specified year ready for formatting (similar to yeardatescalendar()). Entries in the week arrays are day numbers. Day numbers outside this month are zero.

* `year` - (Number) Year for which the calendar should be generated.
* `width` - (Number) The number of months to include in each row. Default: 3

### calendar.Calendar.yeardays2calendar(`year`, [`width`])

Return the data for the specified year ready for formatting (similar to yeardatescalendar()). Entries in the week arrays are [day number, weekday number] arrays. Day numbers outside this month are zero.

* `year` - (Number) Year for which the calendar should be generated.
* `width` - (Number) The number of months to include in each row. Default: 3

## Exceptions

### calendar.IllegalLocaleError([`message`])

Error indicating a nonexistent or unsupported locale specified.

* `message` - (String) Optional custom error message.

### calendar.IllegalDayError([`message`])

Error indicating a day index specified outside of the valid range.

* `message` - (String) Optional custom error message.

### calendar.IllegalMonthError([`message`])

Error indicating a month index specified outside of the expected range (1-12 ~ Jan-Dec).

* `message` - (String) Optional custom error message.

### calendar.IllegalTimeError([`message`])

Error indicating a time element is outside of the valid range.

* `message` - (String) Optional custom error message.

### calendar.IllegalWeekdayError([`message`])

Error indicating a weekday index specified outside of the expected range (0-6 ~ Mon-Sun).

* `message` - (String) Optional custom error message.

## Properties

### calendar.day_name

An array that represents the days of the week in the current locale.

### calendar.day_abbr

An array that represents the abbreviated days of the week in the current locale.

### calendar.month_name

An array that represents the months of the year in the current locale. This follows normal convention of January being month number 1, so it has a length of 13 and `month_name[0]` is the empty string.

### calendar.month_abbr

An array that represents the abbreviated months of the year in the current locale. This follows normal convention of January being month number 1, so it has a length of 13 and `month_abbr[0]` is the empty string.

## Constants

### Weekdays

```
calendar.MONDAY     = 0
calendar.TUESDAY    = 1
calendar.WEDNESDAY  = 2
calendar.THURSDAY   = 3
calendar.FRIDAY     = 4
calendar.SATURDAY   = 5
calendar.SUNDAY     = 6
```

### Months

```
calendar.JANUARY    =  1
calendar.FEBRUARY   =  2
calendar.MARCH      =  3
calendar.APRIL      =  4
calendar.MAY        =  5
calendar.JUNE       =  6
calendar.JULY       =  7
calendar.AUGUST     =  8
calendar.SEPTEMBER  =  9
calendar.OCTOBER    = 10
calendar.NOVEMBER   = 11
calendar.DECEMBER   = 12
```

## Testing

In your browser:

```
open test/test.html
```

Or in node.js:

```
npm test
```

## Release notes

### 0.1.3

* Implementation of `calendar.gmtime`
* Addition of `calendar.IllegalDayError` and `calendar.IllegalTimeError` exceptions.

### 0.1.2

* Integration with [cldr](https://github.com/papandreou/node-cldr) to enable locale-specific month and day names.
* Impletation of `calendar.month_name`, `calendar.month_abbr`, `calendar.day_name`, `calendar.day_abbr` properties.
* Addition of `calendar.setlocale` and associated `IllegalWeekdayError`.
* Reimplemented browser-based testing framework utilizing included [Mocha](http://visionmedia.github.io/mocha/) framework.
* Fixed error in name property for `calendar.IllegalWeekdayError`.

### 0.1.1

* Implementation of `calendar.isleap`, `calendar.leapdays`, `calendar.monthrange`, and `calendar.weekday` utility functions.
* Addition of `calendar.IllegalMonthError` and `calendar.IllegalWeekdayError` exceptions.
* Moved `Calendar` to `calendar.Calendar` to more closely match Python package scheme.
* Refactored testing to [Mocha](http://visionmedia.github.io/mocha/) and removed browser-based testing framework.
* Numerous unit tests added.

### 0.1.0

* Initial Release

## License

(The MIT License)

Copyright (c) 2013 Armin Tamzarian

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
