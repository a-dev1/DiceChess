var board;
var game;


        peerID = document.querySelector("#peerid")
        remoteId = document.querySelector("#fpeerid")
       

        var conn = null

        var peer = null

        function join() {
            peer = new Peer('', {
                host: 'mg-peer-server.herokuapp.com',
                port: 443,
                path: "/"
            });
            console.log("Loading..")
            peer.on('open', function (id) {
                peerID.value = id
                console.log('My peer ID is: ' + id);
            });

            peer.on('close', function () {
                peer = new Peer();
            });

            peer.on('connection', function (c) {
                conn = c
                console.log("New connection : ")
                console.log(conn)
                remoteId.value = c.peer
                conn.on('open', function () {
                    // Receive messages - receiver side
                    conn.on('data', function (data) {
                        console.log('Received', data);
                          game.move(data);
                board.position(game.fen());
                    });
                });
            });

            peer.on('disconnected', function () {
                console.log("disconnected")
                conn = null
            })
        }

        function connect() {
            console.log("connecting to " + remoteId.value)
            conn = peer.connect(remoteId.value);

            conn.on('open', function () {
                console.log("connected")
                // Receive messages - sender side
                conn.on('data', function (data) {
                    console.log('Received', data);
                      game.move(data);
            board.position(game.fen());
                });
            });

        }

        function sendMessage(move) {
            console.log("sending message")
            // send message at sender or receiver side
            if (conn && conn.open) {
                conn.send(move);

            }
        }


window.onload = function () {initGame();};

var initGame = function() {
   var cfg = {
       draggable: true,
       position: 'start',
       onDrop: handleMove,
   };
   
   board = new ChessBoard('gameBoard', cfg);
   game = new Chess();
};

var handleMove = function(source, target ) {
    var move = game.move({from: source, to: target});
    
    if (move === null)  return 'snapback';
    else sendMessage(move);
};

