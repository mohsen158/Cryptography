var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var forge = require('node-forge');//for cryptoghraphy
var fs = require("fs");
var redis = require('redis');
var redisClient = redis.createClient()
var rsa = forge.pki.rsa;
var pki = forge.pki;
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
var keypair = rsa.generateKeyPair({bits: 1024, e: 0x10001});
var pem_private = pki.privateKeyToPem(keypair.privateKey);
var pem_public = pki.publicKeyToPem(keypair.publicKey);
redisClient.set('serverPemPrivate', pem_private, redis.print)
redisClient.set('serverpemPublic', pem_public, redis.print)
// console.log(pem)
// var md = forge.md.sha1.create();
// md.update('sign this', 'utf8');
// var signature = keypair.privateKey.sign(md);
// var verified = keypair.publicKey.decrypt( signature);
// var visitorsData = {};


// var decrypted = keypair.privateKey.decrypt(en);
// console.log(decrypted)
var userinfo = {};

io.on('connection', function (socket) {
    var skey = '';
    var iv = '';
    console.log('socket connected')
    var nonce = Math.random();
    socket.on('login', (data) => {
        console.log('data: ', data);

    });
    socket.on('setSKey', (data) => {

        var decrypted = keypair.privateKey.decrypt(data);
        var decryptedJson = JSON.parse(decrypted)
        if (decryptedJson.nonce == nonce) {
            skey = decryptedJson.skey
            iv = decryptedJson.iv
            console.log('hahaahhahahahahah')
        }
        else {
            console.log('TRUDY IS HEAR')
        }

    })


    socket.on('register', (data) => {
console.log(data)

        encrypted = forge.util.hexToBytes(data);
      var cipher = forge.rc2.createDecryptionCipher(skey);
       cipher.start(iv);
    cipher.update(forge.util.createBuffer(encrypted));
       cipher.finish();
// // outputs decrypted hex
      console.log(cipher.output.data);


    })
    socket.on('register-handshake', (data) => {


        // var en = keypair.publicKey.encrypt('dfsdfsdf')
        //  var decrypted = keypair.privateKey.decrypt(en);

        console.log(data)
        socket.emit('getSKey', {'nonce': nonce, 'key': pem_public})
    })
    socket.on('publicKeySent', (data) => {
        //  console.log(data)
        var decrypted = keypair.privateKey.decrypt(data);
        console.log(decrypted)
    })
    socket.on('disconnect', function () {


        console.log('socket HAS DISCONNECTED')


        // delete visitorsData[socket.id];
    });

});