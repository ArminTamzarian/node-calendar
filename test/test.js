if (!this.calendar) {
  // node.js
  calendar = require('../node-calendar');
}

function _log(msg, type) {
  type = type || 'log';

  if (typeof(document) != 'undefined') {
    document.write('<div class="' + type + '">' + msg.replace(/\n/g, '<br />') + '</div>');
  }
  if (typeof(console) != 'undefined') {
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
