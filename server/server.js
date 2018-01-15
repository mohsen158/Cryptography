var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var forge = require('node-forge');//for cryptoghraphy
var fs = require("fs");
var redis = require('redis');
var redisClient = redis.createClient()
var rsa = forge.pki.rsa;
var pki = forge.pki;
var UTIL = forge.util;
server.listen(8891);
console.log("Server Start");

var userPublicKey = {};
var userPass = {};


redisClient.flushdb(function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
});


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

function sendResponse(socket, skey, iv, response) {

    var cipher = forge.rc2.createEncryptionCipher(skey);
    cipher.start(iv);
    cipher.update(forge.util.createBuffer(response));
    cipher.finish();
    var encrypted = cipher.output;
    socket.emit('response', encrypted)
}

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

    socket.on('auth', (data) => {

        var cipher = forge.rc2.createDecryptionCipher(skey);
        cipher.start(iv);
        cipher.update(forge.util.createBuffer(data));
        cipher.finish();
        //  that.setState({response: that.state.response + '\n' + cipher.output.data})
        //     var res = cipher.output.data;
        var logindata = JSON.parse(cipher.output.data)

        if (userPublicKey[logindata.username]) {
            var pem_public = userPublicKey[logindata.username]
            var publickey = pki.publicKeyFromPem(pem_public)

            var md = forge.md.sha1.create();
            md.update(logindata.username, 'utf8');
            var ver = publickey.verify(md.digest().getBytes(), logindata.sign);
            if (ver) {
                sendResponse(socket, skey, iv, 'Auth without pass is correct')
            }
            else {
                sendResponse(socket, skey, iv, 'Auth without pass is incorrect')
            }
        } else {
            sendResponse(socket, skey, iv, 'Auth without pass is incorrect')
        }

    })
    socket.on('login', (data) => {

        var cipher = forge.rc2.createDecryptionCipher(skey);
        cipher.start(iv);
        cipher.update(forge.util.createBuffer(data));
        cipher.finish();
        //  that.setState({response: that.state.response + '\n' + cipher.output.data})
        //     var res = cipher.output.data;
        console.log(cipher.output.data)
        var logindata = JSON.parse(cipher.output.data)
        if (userPublicKey[logindata.username]) {
            if (userPass[logindata.username] == logindata.pass) {
                sendResponse(socket, skey, iv, 'this user is login')

                var md = forge.md.sha256.create();
                md.update(logindata.message);
                var hashmessage = md.digest();
                var hashhex = hashmessage.toHex()
                if (hashhex != logindata.messagehash) {
                    sendResponse(socket, skey, iv, 'this request does not have integrity')
                } else {
                    var base64 = UTIL.encode64(hashmessage.data)
                    sendResponse(socket, skey, iv, base64)
                    console.log('base:', base64)
                }

            }
            else {
                sendResponse(socket, skey, iv, 'pass is not correct')
            }
        }
        else {
            sendResponse(socket, skey, iv, 'this user doesnot exist')
        }
//         encrypted = forge.util.hexToBytes(data);
// // // outputs decrypted hex
// //       console.log(cipher.output.data);
//         console.log(cipher.output)
//         var cipher = forge.rc2.createDecryptionCipher(skey);
//         cipher.start(iv);
//         cipher.update(forge.util.createBuffer(encrypted));
//         cipher.finish();
        // logindata = JSON.parse(cipher.output.data);
        //  console.log(logindata)
    })
    socket.on('register', (data) => {
        // console.log(data)

        encrypted = forge.util.hexToBytes(data);
        var cipher = forge.rc2.createDecryptionCipher(skey);
        cipher.start(iv);
        cipher.update(forge.util.createBuffer(encrypted));
        cipher.finish();
// // outputs decrypted hex
//       console.log(cipher.output.data);
        userdata = JSON.parse(cipher.output.data);
        // console.log(data.username)
        if (userPublicKey[userdata.username]) {
            console.log('this user already registered')//TODO send response

            sendResponse(socket, skey, iv, 'this user already registered')
        } else {

            userPublicKey[userdata.username] = userdata.publickey
            userPass[userdata.username] = userdata.pass
            //TODO send response
            sendResponse(socket, skey, iv, 'register is ok')
        }

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