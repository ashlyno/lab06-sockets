import net = require('net');//import socket module
import ip = require('ip');

// define address interface
interface Address { port: number; family: string; address: string; };

// create socket server
let server:net.Server = net.createServer();
let client:net.Socket[] = [];
// when the server is connected
server.on('connection', function(socket:net.Socket){

    function notify(name, text){
        client.forEach(element => {
            if (element !== socket) {
                element.write('[' + name + '] ' + text + '\n');
            }
        });
    }

    client.push(socket);
    console.log('connected :' + socket.remoteAddress);

    socket.write("Hi what's your name? \n");
    let name: String = '';
    // when data is sent to the socket
    socket.on('data', function(data){
        let message:String = data.toString();
        if(message.length === 0){
            socket.write('(type a message and press enter)\n');
            return;
        }
        //if we haven't captured the name yet, treat this as the name
        if (!name) {
            //truncate name to 10 characters, just to be safe
            name = data.toString().substr(0, 10);

            //respond with a friendly greeting
            socket.write('Hello ' + name + '!\n');
            socket.write('Welcome to the chat room, ' + name + '!\n');
            socket.write('There are ' + client.length + ' people here.\n');
            socket.write("Type messages, or type 'exit' at any time to leave.\n");
        }
        else {
            //if message is exactly 'exit' then close the connection
            if ('exit' === message) {
                socket.end();
            }
            else {
                //broadcast the message to all other clients
                notify(name, message);
            }
        }
    });

    socket.on('close', function(){
        // handle client disconnectings
        console.log("disconnecting");
        socket.end();
    });


});

//when the server starts listening...
server.on('listening', function() {
    //output to the console the port number on which we are listening
    var addr:Address = server.address();
    console.log('server listening on port %d', addr.port);
});

//start the server
server.listen({
  host: ip.address(),
  port: 3000
});