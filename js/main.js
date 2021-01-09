var board;
var game;

var diceOp = 'P';
var outputObj = {
    1: 'P',
    2: 'R',
    3: 'N',
    4: 'B',
    5: 'Q', 
    6: 'K'
}

//P2P Logic
// peerID = document.querySelector("#peerid")
// remoteId = document.querySelector("#fpeerid")


// var conn = null

// var peer = null

// function join() {
//     peer = new Peer('', {
//         host: 'mg-peer-server.herokuapp.com',
//         port: 443,
//         path: "/"
//     });
//     console.log("Loading..")
//     peer.on('open', function (id) {
//         peerID.value = id
//         console.log('My peer ID is: ' + id);
//     });

//     peer.on('close', function () {
//         peer = new Peer();
//     });

//     peer.on('connection', function (c) {
//         conn = c
//         console.log("New connection : ")
//         console.log(conn)
//         remoteId.value = c.peer
//         conn.on('open', function () {
//             // Receive messages - receiver side
//             conn.on('data', function (data) {
//                 console.log('Received', data);
//                     game.move(data);
//         board.position(game.fen());
//             });
//         });
//     });

//     peer.on('disconnected', function () {
//         console.log("disconnected")
//         conn = null
//     })
// }

// function connect() {
//     console.log("connecting to " + remoteId.value)
//     conn = peer.connect(remoteId.value);

//     conn.on('open', function () {
//         console.log("connected")
//         // Receive messages - sender side
//         conn.on('data', function (data) {
//             console.log('Received', data);
//                 game.move(data);
//     board.position(game.fen());
//         });
//     });

// }

// function sendMessage(move) {
//     console.log("sending message")
//     // send message at sender or receiver side
//     if (conn && conn.open) {
//         conn.send(move);
//     }
// }

// //Chess Logic

var $status = $('#status')
// var $fen = $('#fen')
// var $pgn = $('#pgn')

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  console.log(piece)
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target, piece) {
  // see if the move is legal
  console.log(piece)
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  console.log(game.turn())

  if (game.turn() === 'w' && piece != 'b'+diceOp ) {
    console.log('wrong move for black');
    game.undo();
  }
  else if(game.turn() === 'b' && piece != 'w'+diceOp){
    console.log('wrong move for white');
    game.undo();
  }
  
  if (move === null) return 'snapback';

  updateStatus();  

}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  console.log('last turn: ' + game.turn())
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
//   $fen.html(game.fen())
//   $pgn.html(game.pgn())
}
        

var initGame = function() {
    var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    
    board = new ChessBoard('gameBoard', cfg);
    game = new Chess();
    updateStatus()
};

window.onload = function () {initGame();};
// var handleMove = function(source, target ) {
    //     var move = game.move({from: source, to: target});
    
    //     if (move === null)  return 'snapback';
    //     else sendMessage(move);
    // };
    
    