/* Testing methodology courtesy node-uuid: https://github.com/broofa/node-uuid */

if (!this.Calendar) {
  // node.js
  Calendar = require('../node-calendar');
}

function _log(msg, type) {
  type = type || 'log';

  if (typeof(document) !== 'undefined') {
    document.write('<div class="' + type + '">' + msg.replace(/\n/g, '<br />') + '</div>');
  }

  if (typeof(console) !== 'undefined') {
    var color = {
      log: '\033[39m',
      warn: '\033[33m',
      error: '\033[31m'
    };
    console[type](color[type] + msg + color.log);
  }
}

function log(msg) {_log(msg, 'log');}
function warn(msg) {_log(msg, 'warn');}
function error(msg) {_log(msg, 'error');}

function assert(res, msg) {
  if (!res) {
    error('FAIL: ' + msg);
  } else {
    log('Pass: ' + msg);
  }
}

var result_2004_days = [
    [[[0, 0, 0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17, 18],
      [19, 20, 21, 22, 23, 24, 25],
      [26, 27, 28, 29, 30, 31, 0]],
     [[0, 0, 0, 0, 0, 0, 1],
      [2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20, 21, 22],
      [23, 24, 25, 26, 27, 28, 29]],
     [[1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19, 20, 21],
      [22, 23, 24, 25, 26, 27, 28],
      [29, 30, 31, 0, 0, 0, 0]]],
    [[[0, 0, 0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17, 18],
      [19, 20, 21, 22, 23, 24, 25],
      [26, 27, 28, 29, 30, 0, 0]],
     [[0, 0, 0, 0, 0, 1, 2],
      [3, 4, 5, 6, 7, 8, 9],
      [10, 11, 12, 13, 14, 15, 16],
      [17, 18, 19, 20, 21, 22, 23],
      [24, 25, 26, 27, 28, 29, 30],
      [31, 0, 0, 0, 0, 0, 0]],
     [[0, 1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12, 13],
      [14, 15, 16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25, 26, 27],
      [28, 29, 30, 0, 0, 0, 0]]],
    [[[0, 0, 0, 1, 2, 3, 4],
      [5, 6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17, 18],
      [19, 20, 21, 22, 23, 24, 25],
      [26, 27, 28, 29, 30, 31, 0]],
     [[0, 0, 0, 0, 0, 0, 1],
      [2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20, 21, 22],
      [23, 24, 25, 26, 27, 28, 29],
      [30, 31, 0, 0, 0, 0, 0]],
     [[0, 0, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24, 25, 26],
      [27, 28, 29, 30, 0, 0, 0]]],
    [[[0, 0, 0, 0, 1, 2, 3],
      [4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23, 24],
      [25, 26, 27, 28, 29, 30, 31]],
     [[1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14],
      [15, 16, 17, 18, 19, 20, 21],
      [22, 23, 24, 25, 26, 27, 28],
      [29, 30, 0, 0, 0, 0, 0]],
     [[0, 0, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24, 25, 26],
      [27, 28, 29, 30, 31, 0, 0]]]
  ];

var calendar = new Calendar();

var test_results = calendar.yeardayscalendar(2004);
console.log(test_results);
for(var month_row_i = 0; month_row_i < test_results.length; month_row_i++) {
  assert(
    test_results[month_row_i].length === 3,
    'Default month row width is 3'
  );

  for(var month_i=0; month_i < test_results[month_row_i].length; month_i++) {
    assert(
      test_results[month_row_i][month_i].length === result_2004_days[month_row_i][month_i].length,
      'Length of test results month week size is that of the expected results.'
    );

    for(var week_i=0; week_i < test_results[month_row_i][month_i].length; week_i++) {
      assert(
        test_results[month_row_i][month_i][week_i].length === 7,
        'Length of all weeks should be 7.'
      );

      for(var day_i=0; day_i < test_results[month_row_i][month_i][week_i].length; day_i++) {
        assert(
          test_results[month_row_i][month_i][week_i][day_i] === result_2004_days[month_row_i][month_i][week_i][day_i],
          'Ensure value of each test result day is that of the expected results.'
        );
      }
    }
  }
}
