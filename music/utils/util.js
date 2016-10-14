function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time;
  }

  
  var minute = parseInt(time / 60);
  time = time % 60;
  var second = parseInt(time);

  return ([minute, second]).map(function (n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  }).join(':');
}

module.exports = {
  formatTime: formatTime
}