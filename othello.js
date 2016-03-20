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
      board = gameBoard(8, player);

  $('#app').append($(board).on('click', 'td', function () {
    var node = this,
        oponentNodes;

    if (nodeHasChecker(node)) {
      return console.log('This cell is occupied.');
    }

    oponentNodes = endangeredOponentNodes(this, player);
    if (oponentNodes.length === 0) {
      return console.log('You cannot put ' + player.name + ' checker here!');
    }

    putCheckerOnNode(this, player);
    replaceOponentNodes(oponentNodes, player);

    if (boardIsFull(board)) {
      return endGame(board, player);
    }

    if (playerHasValidMoves(player.next, board)) {
      return player = player.next;
    }

    return console.log('Oponent does not have valid moves. ' + player.name + ' has one extra move.');
  }));
});

function getEmptyCells(board) {
  return $(board).find('td:not(.checker)').get();
}

function playerHasValidMoves(player, board) {
  return getEmptyCells(board).filter(function (cell) {
    return endangeredOponentNodes(cell, player).length > 0;
  }).length > 0;
}

function boardIsFull(board) {
  return getEmptyCells(board).length === 0;
}

function endGame(board, player) {
  var $board = $(board);
  console.log('Game over');
  console.log(player.name + ': ' + $board.find('.' + player.name).length);
  console.log(player.next.name + ': ' + $board.find('.' + player.next.name).length);
  $board.off('click');
}

function endangeredOponentNodes(domNode, player) {
  return [
    function (node) {return $(node).parent().prev().find(':nth-child('+ ($(node).index() + 1) +')');}, // top
    function (node) {return $(node).parent().prev().find(':nth-child('+ ($(node).index() + 2) +')');}, // top-right
    function (node) {return $(node).next();}, // right
    function (node) {return $(node).parent().next().find(':nth-child('+ ($(node).index() + 2) +')');}, // bottom-right
    function (node) {return $(node).parent().next().find(':nth-child('+ ($(node).index() + 1) +')');}, // bottom
    function (node) {return $(node).parent().next().find(':nth-child('+ ($(node).index() - 0) +')');}, // bottom-left
    function (node) {return $(node).prev();}, // left
    function (node) {return $(node).parent().prev().find(':nth-child('+ ($(node).index() - 0) +')');} // top-left
  ].map(function (dir) {
    return nodesWithCheckers(domNode, dir);
  }).filter(function (checkerNodesInDirection) {
    return checkerIsOponent(checkerNodesInDirection.head(), player) &&
      checkersContainPlayer(checkerNodesInDirection.tail(), player);
  }).reduce(function (prev, checkerNodes) {
    return prev.concat(takeOponentsUntilPlayer(checkerNodes, player));
  }, []);
}

function takeOponentsUntilPlayer(checkers, player) {
  return checkers.takeUntil(function (item) {
    return $(item).hasClass(player.name);
  });
}

function checkerIsOponent(checker, player) {
  return $(checker).hasClass(player.next.name);
}

function checkersContainPlayer(checkers, player) {
  return checkers.some(function (checker) {
    return $(checker).hasClass(player.name);
  });
}

function putCheckerOnNode(node, player) {
  var $node = $(node);
  if ($node.hasClass('checker')) {
    throw 'This field is occupied';
  } else {
    $node.addClass('checker').addClass(player.name);
  }
}

function replaceOponentNodes(nodes, player) {
  nodes.forEach(function (node) {
    $(node).removeClass(player.next.name).addClass(player.name);
  });
};

function nodeHasChecker(node) {
  return $(node).hasClass('checker');
}

function nodesWithCheckers(node, dir) {
  var nodes = [];
  var nextNode = dir(node);
  if (nodeHasChecker(nextNode)) {
    nodes.push(nextNode);
    return nodes.concat(nodesWithCheckers(nextNode, dir));
  }
  return nodes;
}

function gameBoard(size, player) {
  function checker(player) { return player.name + ' checker'; }
  return $('<table>').append(Array.range(size).map(function (y) {
    return $('<tr>').append(Array.range(size).map(function (x) {
      return $('<td>').addClass('cell').addClass(
        (x === 3 && y === 3 || x === 4 && y === 4) ?
          checker(player) : (x === 3 && y === 4 || x === 4 && y === 3) ?
          checker(player.next) : ''
      );
    }));
  }));
}
