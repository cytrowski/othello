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

Array.range = function (n) {
  var result = [];
  for (var i = 0; i < n; i++) {
    result.push(i);
  }
  return result;
};

var players = {
  white: {
    name: 'white'
  },
  black: {
    name: 'black'
  }
};

players.white.next = players.black;
players.black.next = players.white;

$(function () {
  var player = players.white,
      $board = createBoard(8, player);

  $('#app')
    .append($board)
    .on('click', 'td', function () {
      try {
        putChecker(this, player, false);
        player = player.next;
      } catch (e) {
        console.log(e);
      }

      if ($board.find('td:not(.checker)').length === 0) {
        console.log('Game over');
        console.log(player.name + ': ' + $board.find('.' + player.name).length);
        console.log(player.next.name + ': ' + $board.find('.' + player.next.name).length);
        $board.off('click');
        return;
      }

      if (
        $('#app')
          .find('td:not(.checker)')
          .get()
          .filter(function (node) {
            return putChecker(node, player, true);
          }).length === 0
      ) {
        // if no places for current player to play then switch player
        player = player.next;
      };
    });
});

function putChecker(domNode, player, checkOnly) {
  var directions = [
    {
      name: 'top',
      next: function (node) {
        return $(node)
          .parent()
          .prev()
          .find(':eq('+ $(node).index() +')');
      }
    },

    {
      name: 'top-right',
      next: function (node) {
        return $(node)
          .parent()
          .prev()
          .find(':eq('+ ($(node).index() + 1) +')');
      }
    },

    {
      name: 'right',
      next: function (node) {
        return $(node)
          .next();
      }
    },

    {
      name: 'bottom-right',
      next: function (node) {
        return $(node)
          .parent()
          .next()
          .find(':eq('+ ($(node).index() + 1) +')');
      }
    },

    {
      name: 'bottom',
      next: function (node) {
        return $(node)
          .parent()
          .next()
          .find(':eq('+ $(node).index() +')');
      }
    },

    {
      name: 'bottom-left',
      next: function (node) {
        return $(node)
          .parent()
          .next()
          .find(':eq('+ ($(node).index() - 1) +')');
      }
    },

    {
      name: 'left',
      next: function (node) {
        return $(node)
          .prev();
      }
    },

    {
      name: 'top-left',
      next: function (node) {
        return $(node)
          .parent()
          .prev()
          .find(':eq('+ ($(node).index() - 1) +')');
      }
    }
  ];

  if ($(this).hasClass('checker')) {
    throw 'This field is occupied';
  }

  var oponentNodes = directions.map(function (dir) {
    return getCheckerNodes(domNode, dir);
  }).filter(function (checkerNodesInDirection) {
    // pass only directions which starts with oponent node
    return checkerNodesInDirection.length > 0 &&
      checkerNodesInDirection[0].hasClass(player.next.name) &&
      checkerNodesInDirection.slice(1).some(function (item) {
        return $(item).hasClass(player.name);
      });
  }).reduce(function (prev, curr) {
    return prev.concat(curr.takeUntil(function (item) {
      return $(item).hasClass(player.name);
    }));
  }, []);

  if (checkOnly) {
    return oponentNodes.length > 0;
  }

  if (oponentNodes.length === 0) {
    throw 'You cannot put a ' + player.name + ' checker here!';
  }

  oponentNodes.concat(domNode).forEach(function (node) {
    $(node)
      .removeClass(player.next.name)
      .addClass(player.name)
      .addClass('checker');
  });
}

function getCheckerNodes(node, dir) {
  var checkerNodes = [];
  var $nextNode = dir.next(node);
  if ($nextNode.hasClass('checker')) {
    checkerNodes.push($nextNode);
    return checkerNodes.concat(getCheckerNodes($nextNode, dir));
  }
  return checkerNodes;
}

function createBoard(size, player) {
  return $('<table>').append(Array.range(size).map(function (y) {
    return $('<tr>').append(Array.range(size).map(function (x) {
      var $cell = $('<td>');
      $cell.addClass('cell');
      if (x === 3 && y === 3 || x === 4 && y === 4) {
        $cell.addClass(player.name).addClass('checker');
      }
      if (x === 4 && y === 3 || x === 3 && y === 4) {
        $cell.addClass(player.next.name).addClass('checker');
      }
      return $cell;
    }));
  }));
}


