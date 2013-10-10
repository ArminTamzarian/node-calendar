# node-calendar

A fairly straightforward port of the Python [calendar.Calendar](http://docs.python.org/2/library/calendar.html) class.

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
