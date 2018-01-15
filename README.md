# Network and Cryptographic programming
Dr. Manshaei
Web Programming Homework

#1. Preliminaries:
Both Client and Server have a pair of asymmetric keys, so they should be able to carry out
asymmetric cryptographic functions. These two entities should communicate over a socket
connection (not web service).
#2. The Overall Scenario:

1. The client sends a register request to the server and server must reply this request. At
the end of registration process, server should have access to the client’s username,
password and public key. Moreover, client needs to know the server's public key.
2. The client sends its username and password along (inside) a request for hashing a
value (user input) to the server. The value should be sent encrypted in a way that only
the server can decrypt.
3. Server computes the hash of that value and then sends the result to the client. The
result should be sent encrypted in a way that only the client can decrypt.
4. After a successful cycle, client will send a "Thank You" message to the server as a
sign of connection termination.
#3. Non-functional Requirements:
You are free to choose any programming language but we recommend Java. You should use
SHA256 as Hash algorithm and RSA (key length=1024), as asymmetric cryptographic
algorithm.
## Installation

```bash
git clone https://github.com/mohsen158/Cryptography.git
cd Cryptography
npm install
npm start
cd server
node server.js
```

[ES6]: http://exploringjs.com/
[React]: https://facebook.github.io/react/
[Electron]: http://electron.atom.io/
[Babel]: http://babeljs.io

