"use strict";
var net = require("net");
var ip = require("ip");
;
var server = net.createServer();
var client = [];
server.on('connection', function (socket) {
    function notify(name, text) {
        client.forEach(function (element) {
            if (element !== socket) {
                element.write('[' + name + '] ' + text + '\n');
            }
        });
    }
    client.push(socket);
    console.log('connected :' + socket.remoteAddress);
    socket.write("Hi what's your name? \n");
    var name = '';
    socket.on('data', function (data) {
        var message = data.toString();
        if (message.length === 0) {
            socket.write('(type a message and press enter)\n');
            return;
        }
        if (!name) {
            name = data.toString().substr(0, 10);
            socket.write('Hello ' + name + '!\n');
            socket.write('Welcome to the chat room, ' + name + '!\n');
            socket.write('There are ' + client.length + ' people here.\n');
            socket.write("Type messages, or type 'exit' at any time to leave.\n");
        }
        else {
            if ('exit' === message) {
                socket.end();
            }
            else {
                notify(name, message);
            }
        }
    });
    socket.on('close', function () {
        console.log("disconnecting");
        socket.end();
    });
});
server.on('listening', function () {
    var addr = server.address();
    console.log('server listening on port %d', addr.port);
});
server.listen({
    host: ip.address(),
    port: 3000
});
