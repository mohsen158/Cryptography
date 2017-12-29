var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var forge = require('node-forge');//for cryptoghraphy
var fs = require("fs");
var rsa = forge.pki.rsa;
server.listen(8891);
console.log("Server Start");


function write(value) {
    /*
     console.log(value)
     var data = fs.readFileSync("\Users\Administrator\Desktop.html"); //read existing contents into data
     var fd = fs.openSync("\Users\Administrator\Desktop.html", 'w+');
     var buffer = new Buffer(value);
     fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
     fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data
     // or fs.appendFile(fd, data);
     fs.close(fd);
     */

    fs.appendFile("D:\server\log.html", '\r\n' + value, function (err) {

        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });

}

var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});
// var md = forge.md.sha1.create();
// md.update('sign this', 'utf8');
// var signature = keypair.privateKey.sign(md);
// var verified = keypair.publicKey.decrypt( signature);
// var visitorsData = {};

var en= keypair.publicKey.encrypt('dfsdfsdf')

var decrypted = keypair.privateKey.decrypt(en);
console.log(decrypted)
var userinfo = {};

io.on('connection', function (socket) {
console.log('socket connected')
    socket.on('login', (data) => {
        console.log('data: ', data);

    });

    socket.on('disconnect', function () {


        console.log('socket HAS DISCONNECTED')


        delete visitorsData[socket.id];
    });

});