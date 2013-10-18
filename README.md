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

## Additional Notes

### Locale

Properly implementing locale data via Node or Javascript is a very difficult task due to the fact there there is currently no standard implementation of locale information across Javascript interpreters. As a result node-calendar does not ship with locale functionality available through the browser implementation outside of the default `en_US` locale.

To enable extended locale functionality node-calendar utilizes the optional [cldr](https://github.com/papandreou/node-cldr) module. If node-calendar locates the [cldr](https://github.com/papandreou/node-cldr) module within the either the project-local or node-global module directories you can set your locale via the `calendar.setlocale()` method which will in turn populate the `calendar.month_name`, `calendar.month_abbr`, `calendar.day_name`, `calendar.day_abbr` properties. Note that this functionality is optional and without including this package the default `en_US` locale and its associated data will still be available.

To enable extended locale functionality add the following to the `dependencies` section of your project's `package.json` file:

```javascript
"cldr" : ">=1.0.2"
```

### Epoch

Although not explicitly stated all functions are compatible with dates and times ocurring after the [Unix epoch](http://en.wikipedia.org/wiki/Unix_time) (00:00:00 UTC, Thursday, 1 January 1970). Due to certain interpretations of [section 15.9](http://es5.github.io/#x15.9) of the official EMCAScript specification by disparate developers of Javascript interpreters date and time functionality before the Unix epoch is indeterminate at best.

For the time being all testing for node-calendar delegates to the data returned by that of the Python class resulting in full compliance for both [NodeJS](http://nodejs.org/) and related [V8](https://code.google.com/p/v8/) browser interpreters. However, note that although all tested browsers appear to be fully unit test compliant for dates after the Unix epoch proper functionality before this date can not be guaranteed. To verify functionality in your browser of choice see [Testing](#testing) to execute the node-calendar unit tests.

## API

### calendar.isleap(`year`)

Return true for leap years, false for non-leap years.

* `year` - (Number) Year to test.

Example:
```javascript
calendar.isleap(2001); // -> false
calendar.isleap(2000); // -> true
```

### calendar.leapdays(`y1`, `y2`)

Return number of leap years in range [y1, y2). Assumes y1 <= y2.

* `y1` - (Number) Beginning year in the range to test.
* `y2` - (Number) Ending year in the range to test.

Example:
```javascript
calendar.leapdays(1990, 2050); // -> 15
calendar.leapdays(2000, 2005); // -> 2
```

### calendar.monthrange(`year`, `month`)

Return starting weekday (0-6 ~ Mon-Sun) and number of days (28-31) for year, month.

* `year` - (Number) Year for which the range should be calculated.
* `month` - (Number) Month for which the range should be calculated.
 - Throws `IllegalMonthError` if the provided month is invalid.

Example:
```javascript
calendar.monthrange(1980, 9);  // -> [ 0, 30 ]
calendar.monthrange(2004, 2);  // -> [ 6, 29 ]
calendar.monthrange(2038, 12); // -> [ 2, 31 ]
calendar.monthrange(2013, 13); // -> Throws IllegalMonthError
```

### calendar.noconflict()

(Browsers only) Set `calendar` property back to its previous value.

Returns the node-calendar object.

### calendar.setlocale(`[locale]`)

Sets the locale for use in extracting month and weekday names.

* `locale` - (String) Locale to set on the calendar object. `Default: en_US`
 - Throws `IllegalLocaleError` if the provided locale is invalid.

Example:
```javascript
calendar.setlocale();
calendar.day_name; // -> [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]

calendar.setlocale('fr_FR');
calendar.day_name; // -> [ 'dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi' ]

calendar.setlocale('xx_XX'); // -> Throws IllegalLocaleError
```

### calendar.timegm(`timegmt`)

Unrelated but handy function to calculate Unix timestamp from GMT.

* `timegmt` - (Array) An array containing the elements from a [time structure](http://docs.python.org/3/library/time.html#time.struct_time) dataset. `Format: [tm_year, tm_mon, tm_mday, tm_hour, tm_min, tm_sec]`
 - Throws `IllegalMonthError` if the provided month element is invalid.
 - Throws `IllegalDayError` if the provided day element is invalid.
 - Throws `IllegalTimeError` if any of the the provided time elements are invalid.

Example:
```javascript
calendar.timegm([1970, 1, 1, 0, 0, 0]); // -> 0
calendar.timegm([2001, 1, 2, 3, 4, 5]); // -> 978404645

calendar.timegm([2001, 13, 1, 0, 0, 0]); // Throws IllegalMonthError
calendar.timegm([2001, 2, 29, 0, 0, 0]); // Throws IllegalDayError
calendar.timegm([2001, 1, 1, 24, 0, 0]); // Throws IllegalTimeError
```

### calendar.weekday(`year`, `month`, `day`)

Return weekday (0-6 ~ Mon-Sun) for year (1970-...), month (1-12), day (1-31).

* `year` - (Number) Year for which the weekday should be calculated.
* `month` - (Number) Month for which the weekday should be calculated.
* `day` - (Number) Day for which the weekday should be calculated.
 - Throws `IllegalMonthError` if the provided month element is invalid.
 - Throws `IllegalDayError` if the provided day element is invalid.

Example:
```javascript
calendar.weekday(1970, 1, 1);  // -> 3
calendar.weekday(2004, 2, 29), // -> 6

calendar.weekday(2001, 0, 1);  // -> Throws IllegalMonthError
calendar.weekday(2001, 2, 29); // -> Throws IllegalDayError
```

### calendar.Calendar([`firstweekday`])

Base calendar class. This class doesn't do any formatting. It simply provides data to subclasses.

* `firstweekday` - (Number) Numerical day of the week the calendar weeks should start. (0=MON, 1=TUE, ...) `Default: 0`
 - Throws `IllegalWeekdayError` if the provided weekday is invalid.

Example:
```javascript
var cal = calendar.Calendar();
cal.getfirstweekday(); // -> 0

var cal = calendar.Calendar(-1); // -> Throws IllegalWeekdayError
```

### calendar.Calendar.getfirstweekday()

Getter for firstweekday.

Example:
```javascript
var cal = calendar.Calendar(6);
cal.getfirstweekday(); // -> 6
```

### calendar.Calendar.setfirstweekday(`firstweekday`)

Setter for firstweekday.

* `firstweekday` - (Number) Numerical day of the week the calendar weeks should start. (0=MON, 1=TUE, ...)
 - Throws `IllegalWeekdayError` if the provided weekday is invalid.

Example:
```javascript
var cal = calendar.Calendar(6);
cal.getfirstweekday();  // -> 6

cal.setfirstweekday(3);
cal.getfirstweekday();  // -> 3

cal.setfirstweekday(7); // -> Throws IllegalWeekdayError
```

### calendar.Calendar.iterweekdays()

Return an array for one week of weekday numbers starting with the configured first one.

Example:
```javascript
new calendar.Calendar(3).iterweekdays();
// -> [ 3, 4, 5, 6, 0, 1, 2 ]
```

### calendar.Calendar.itermonthdates(`year`, `month`)

Return an array for one month. The array will contain Date values and will always iterate through complete weeks, so it will yield dates outside the specified month.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.
 - Throws `IllegalMonthError` if the provided month is invalid.

Example:
```javascript
new calendar.Calendar(3).itermonthdates(2004, 2);
// -> [ Thu Jan 29 2004 00:00:00 GMT-0600 (CST),
//      Fri Jan 30 2004 00:00:00 GMT-0600 (CST),
//      Sat Jan 31 2004 00:00:00 GMT-0600 (CST),
//      Sun Feb 01 2004 00:00:00 GMT-0600 (CST),
//      Mon Feb 02 2004 00:00:00 GMT-0600 (CST),
//      ...
//      Sun Feb 29 2004 00:00:00 GMT-0600 (CST),
//      Mon Mar 01 2004 00:00:00 GMT-0600 (CST),
//      Tue Mar 02 2004 00:00:00 GMT-0600 (CST),
//      Wed Mar 03 2004 00:00:00 GMT-0600 (CST) ]

new calendar.Calendar(3).itermonthdates(2004, 13);
// -> Throws IllegalMonthError
```

### calendar.Calendar.itermonthdays(`year`, `month`)

Like itermonthdates(), but will yield day numbers. For days outside the specified month the day number is 0.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.
 - Throws `IllegalMonthError` if the provided month is invalid.

Example:
```javascript
new calendar.Calendar(3).itermonthdays(2004, 2);
// -> [ 0, 0, 0, 1, 2, 3, 4, 5, 6, ... 27, 28, 29, 0, 0, 0 ]

new calendar.Calendar(3).itermonthdays(2004, 13);
// -> Throws IllegalMonthError
```

### calendar.Calendar.itermonthdays2(`year`, `month`)

Like itermonthdates(), but will yield [day number, weekday number] arrays. For days outside the specified month the day number is 0.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.
 - Throws `IllegalMonthError` if the provided month is invalid.

Example:
```javascript
new calendar.Calendar(1).itermonthdays2(2012, 5);
// -> [ [ 1,  1 ],
//      [ 2,  2 ],
//      [ 3,  3 ],
//      ...
//      [ 31, 3 ],
//      [ 0,  4 ],
//      [ 0,  5 ],
//      [ 0,  6 ],
//      [ 0,  0 ] ]

new calendar.Calendar(1).itermonthdays2(2012, 13);
// -> Throws IllegalMonthError
```

### calendar.Calendar.monthdatescalendar(`year`, `month`)

Return a matrix (array of array) representing a month's calendar. Each row represents a week; week entries are Date values.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.
 - Throws `IllegalMonthError` if the provided month is invalid.

Example:
```javascript
new calendar.Calendar(1).monthdatescalendar(2013, 5);
// -> [ [ Tue Apr 30 2013 00:00:00 GMT-0500 (CDT),
//        Wed May 01 2013 00:00:00 GMT-0500 (CDT),
//        Thu May 02 2013 00:00:00 GMT-0500 (CDT),
//        Fri May 03 2013 00:00:00 GMT-0500 (CDT),
//        Sat May 04 2013 00:00:00 GMT-0500 (CDT),
//        Sun May 05 2013 00:00:00 GMT-0500 (CDT),
//        Mon May 06 2013 00:00:00 GMT-0500 (CDT) ],
//      [ Tue May 07 2013 00:00:00 GMT-0500 (CDT),
//        Wed May 08 2013 00:00:00 GMT-0500 (CDT),
//        ...
//        Fri May 31 2013 00:00:00 GMT-0500 (CDT),
//        Sat Jun 01 2013 00:00:00 GMT-0500 (CDT),
//        Sun Jun 02 2013 00:00:00 GMT-0500 (CDT),
//        Mon Jun 03 2013 00:00:00 GMT-0500 (CDT) ] ]

new calendar.Calendar(1).monthdatescalendar(2013, 0);
// -> Throws IllegalMonthError
```

### calendar.Calendar.monthdayscalendar(`year`, `month`)

Return a matrix representing a month's calendar. Each row represents a week; days outside this month are zero.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.
 - Throws `IllegalMonthError` if the provided month is invalid.

Example:
```javascript
new calendar.Calendar(1).monthdayscalendar(2013, 5);
// -> [ [  0,  1,  2,  3,  4,  5,  6 ],
//      [  7,  8,  9, 10, 11, 12, 13 ],
//      [ 14, 15, 16, 17, 18, 19, 20 ],
//      [ 21, 22, 23, 24, 25, 26, 27 ],
//      [ 28, 29, 30, 31,  0,  0,  0 ] ]

new calendar.Calendar(1).monthdayscalendar(2013, 13);
// -> Throws IllegalMonthError
```

### calendar.Calendar.monthdays2calendar(`year`, `month`)

Return a matrix representing a month's calendar. Each row represents a week; week entries are [day number, weekday number] arrays. Day numbers outside this month are zero.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.
 - Throws `IllegalMonthError` if the provided month is invalid.

Example:
```javascript
new calendar.Calendar(1).monthdays2calendar(2013, 5);
// -> [ [ [  0, 1 ], [  1, 2 ], [  2, 3 ], [  3, 4 ], [  4, 5 ], [  5, 6 ], [  6, 0 ] ],
//      [ [  7, 1 ], [  8, 2 ], [  9, 3 ], [ 10, 4 ], [ 11, 5 ], [ 12, 6 ], [ 13, 0 ] ],
//      [ [ 14, 1 ], [ 15, 2 ], [ 16, 3 ], [ 17, 4 ], [ 18, 5 ], [ 19, 6 ], [ 20, 0 ] ],
//      [ [ 21, 1 ], [ 22, 2 ], [ 23, 3 ], [ 24, 4 ], [ 25, 5 ], [ 26, 6 ], [ 27, 0 ] ],
//      [ [ 28, 1 ], [ 29, 2 ], [ 30, 3 ], [ 31, 4 ], [  0, 5 ], [  0, 6 ], [  0, 0 ] ] ]

new calendar.Calendar(1).monthdays2calendar(2013, 13);
// -> Throws IllegalMonthError
```

### calendar.Calendar.yeardatescalendar(`year`, [`width`])

Return the data for the specified year ready for formatting. The return value is an array of month rows. Each month row contains up to width months. Each month contains between 4 and 6 weeks and each week contains 1-7 days. Days are Date objects.

* `year` - (Number) Year for which the calendar should be generated.
* `width` - (Number) The number of months to include in each row. Default: 3

Example:
```javascript
new calendar.Calendar(1).yeardatescalendar(2018, 6);
// -> [ [ [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ] ],
//      [ [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ] ] ]
```

### calendar.Calendar.yeardayscalendar(`year`, [`width`])

Return the data for the specified year ready for formatting (similar to yeardatescalendar()). Entries in the week arrays are day numbers. Day numbers outside this month are zero.

* `year` - (Number) Year for which the calendar should be generated.
* `width` - (Number) The number of months to include in each row. Default: 3

Example:
```javascript
new calendar.Calendar(1).yeardayscalendar(2018, 6);
// -> [ [ [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ] ],
//      [ [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ] ] ]
```

### calendar.Calendar.yeardays2calendar(`year`, [`width`])

Return the data for the specified year ready for formatting (similar to yeardatescalendar()). Entries in the week arrays are [day number, weekday number] arrays. Day numbers outside this month are zero.

* `year` - (Number) Year for which the calendar should be generated.
* `width` - (Number) The number of months to include in each row. Default: 3

Example:
```javascript
new calendar.Calendar(1).yeardays2calendar(2018, 6);
// -> [ [ [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ] ],
//      [ [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ],
//        [ [Object], [Object], [Object], [Object], [Object] ] ] ]
```

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

### 0.1.4

* Extended error checking.
* Massively updated unit testing.
* Updated API documentation to include examples.
* Noted inherent errors for some Javascript interpreters for dates before the Unix epoch.

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
