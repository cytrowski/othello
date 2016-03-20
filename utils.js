Array.prototype.takeUntil = function (predicate) {
  var result = [];
  for (var i = 0; i < this.length; i++) {
    if (predicate(this[i]) === true) {
      break;
    }
    result.push(this[i]);
  }
  return result;
};

Array.prototype.head = function () {
  return this.slice(0, 1)[0];
};

Array.prototype.tail = function () {
  return this.slice(1);
};

Array.range = function (n) {
  var result = [];
  for (var i = 0; i < n; i++) {
    result.push(i);
  }
  return result;
};


