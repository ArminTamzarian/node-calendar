# node-calendar

A fairly straightforward port of the Python [calendar.Calendar](http://docs.python.org/3/library/calendar.html?highlight=calendar#calendar.Calendar) class.

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
var Calendar = require('node-calendar');
```

Then construct a new Calendar object and go to town...

```javascript
var calendar = new Calendar(6);
var yearCalendar = calendar.yeardayscalendar(2004);
```

## API

### Calendar([`firstweekday`])

Base calendar class. This class doesn't do any formatting. It simply provides data to subclasses.

* `firstweekday` - (Number) Numerical day of the week the calendar weeks should start. (0=MON, 1=TUE, ...) Default: 0

### Calendar.getfirstweekday()

Getter for firstweekday

### Calendar.setfirstweekday(`firstweekday`)

Setter for firstweekday

* `firstweekday` - (Number) Numerical day of the week the calendar weeks should start. (0=MON, 1=TUE, ...) Default: 0

### Calendar.iterweekdays()

Return an array for one week of weekday numbers starting with the configured first one.

### Calendar.itermonthdates(`year`, `month`)

Return an array for one month. The array will contain Date values and will always iterate through complete weeks, so it will yield dates outside the specified month.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.

### Calendar.itermonthdays(`year`, `month`)

Like itermonthdates(), but will yield day numbers. For days outside the specified month the day number is 0.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.

### Calendar.itermonthdays2(`year`, `month`)

Like itermonthdates(), but will yield [day number, weekday number] arrays. For days outside the specified month the day number is 0.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.

### Calendar.monthdatescalendar(`year`, `month`)

Return a matrix (array of array) representing a month's calendar. Each row represents a week; week entries are Date values.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.

### Calendar.monthdayscalendar(`year`, `month`)

Return a matrix representing a month's calendar. Each row represents a week; days outside this month are zero.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.

### Calendar.monthdays2calendar(`year`, `month`)

Return a matrix representing a month's calendar. Each row represents a week; week entries are [day number, weekday number] arrays. Day numbers outside this month are zero.

* `year` - (Number) Year for which the calendar should be generated.
* `month` - (Number) Month for which the calendar should be generated.

### Calendar.yeardatescalendar(`year`, `width`)

Return the data for the specified year ready for formatting. The return value is an array of month rows. Each month row contains up to width months. Each month contains between 4 and 6 weeks and each week contains 1-7 days. Days are Date objects.

* `year` - (Number) Year for which the calendar should be generated.
* `width` - (Number) The number of months to include in each row. Default: 3

### Calendar.yeardayscalendar(`year`, `width`)

Return the data for the specified year ready for formatting (similar to yeardatescalendar()). Entries in the week arrays are day numbers. Day numbers outside this month are zero.

* `year` - (Number) Year for which the calendar should be generated.
* `width` - (Number) The number of months to include in each row. Default: 3

### Calendar.yeardays2calendar(`year`, `width`)

Return the data for the specified year ready for formatting (similar to yeardatescalendar()). Entries in the week arrays are [day number, weekday number] arrays. Day numbers outside this month are zero.

* `year` - (Number) Year for which the calendar should be generated.
* `width` - (Number) The number of months to include in each row. Default: 3

### Calendar.noConflict()

(Browsers only) Set `Calendar` property back to its previous value.

Returns the node-calendar object.

## Testing

In node.js

```
npm test
```

In Browser

```
open test/test.html
```

## Release notes

### 0.1.0

* Initial Release
