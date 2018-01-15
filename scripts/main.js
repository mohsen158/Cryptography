import React from 'react';
import {render} from 'react-dom';
var forge = require('node-forge');
// import '../semantic/dist/semantic.min.css';
//import '../css/semantic.min.css';
import RaisedButton from 'material-ui/RaisedButton';
import nl2br from 'react-newline-to-break';
var redis = require('redis');
var rsa = forge.pki.rsa;
var UTIL = forge.util;
var pki = forge.pki;
var redisClient = redis.createClient()
var skey = forge.random.getBytesSync(16);
var iv = forge.random.getBytesSync(8);
var server_public_key = '';

var md = forge.md.sha256.create();
md.update('The quick brown fox jumps over the lazy dog');
console.log(md.digest().toHex());


redisClient.on('connect', function () {
    console.log('connected');
});


import {Button, Form, Segment, Input, TextArea, Message, Icon, Header, Grid, Image, Modal} from 'semantic-ui-react'

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8891');

// function App() {
//     return (
//
//         <Modal trigger={<Button>Show Modal</Button>}>
//             <Modal.Header>Select a Photo</Modal.Header>
//             <Modal.Content image>
//                 <Image wrapped size='medium' src='/assets/images/avatar/large/rachel.png'/>
//                 <Modal.Description>
//                     <Header>Default Profile Image</Header>
//                     <p>We ve found the following gravatar image associated with your e-mail address.</p>
//                     <p>Is it okay to use this photo?</p>
//                 </Modal.Description>
//             </Modal.Content>
//         </Modal>
//
//     );
// }


class App extends React.Component {


    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.clearResponse = this.clearResponse.bind(this);
        this.setRespons = this.setRespons.bind(this);
        this.showError = this.showError.bind(this);
        this.hideError = this.hideError.bind(this);
        this.register = this.register.bind(this);
        this.auth = this.auth.bind(this);


        this.state = {
            isToggleOn: true,
            modalOpen: false,
            disablelogin: false,
            error: '',
            response: 'start app',
            userRegister: '',
            userPasswordRegister: '',
            pemPublicKeyClient: '',
            pemPrivateKeyClient: '',
            loginUsername: '',
            message: '',
            loginPass: '',
            userAuth: ''
        };

        socket.emit('register-handshake', 'hi ');
        socket.on('getSKey', function (msg) {

            var nonce = msg.nonce
            server_public_key = pki.publicKeyFromPem(msg.key);

            socket.emit('setSKey', server_public_key.encrypt(JSON.stringify({
                'skey': skey,
                'iv': iv,
                'nonce': nonce
            })))
        })

        var that = this;
        socket.on('response', function (data) {
            var cipher = forge.rc2.createDecryptionCipher(skey);
            cipher.start(iv);
            cipher.update(forge.util.createBuffer(data));
            cipher.finish();
            that.setState({response: that.state.response + '\n' + cipher.output.data})
            var res = cipher.output.data;

            if (res == 'register is ok') {
                var md = forge.md.sha256.create();
                md.update(that.state.userPasswordRegister);
                var hashpass = md.digest().toHex();
                console.log('hashpassregister:', hashpass)
                redisClient.hmset(that.state.userRegister, 'pass', hashpass, 'pemPublicKeyClient', that.state.pemPublicKeyClient, 'pemPrivateKeyClient', that.state.pemPrivateKeyClient)
            }
            console.log(cipher.output.data)
        })

        setInterval(() => {

            if (!redisClient.ready) {
                // this.setState({ modalOpen: this.state.modalOpen ? false : true })
                this.showError('Redis client does not ready!!!!!!')
            }
            else if (!socket.connected) {
                this.showError('Server doesnot connected!!!!!!')
            }
            else {
                this.hideError()
            }

        }, 100)


        // This binding is necessary to make `this` work in the callback

    }

    //
    // handleClick() {
    //     console.log(document.getElementById('username').textContent)
    //     this.setState(prevState => ({
    //         isToggleOn: !prevState.isToggleOn
    //     }));
    // }

    clearResponse() {

        this.setState({response: 'response in empty'})
    }

    auth() {
        var that = this;
        redisClient.hgetall(this.state.userAuth, function (err, obj) {
            if (obj == null) {
                that.setRespons('this user doesnot have any publickey')
            } else {
                var pem_privateKey = obj.pemPrivateKeyClient;
                var privateKey = pki.privateKeyFromPem(pem_privateKey)
                var md = forge.md.sha1.create();


                var md = forge.md.sha1.create();
                md.update(that.state.userAuth, 'utf8');
                var signature = privateKey.sign(md);
                // var verified = publicKey.verify(md.digest().bytes(), signature);

                var data = {
                    'username': that.state.userAuth,
                    'sign': signature
                }


                var cipher = forge.rc2.createEncryptionCipher(skey);
                cipher.start(iv);
                cipher.update(forge.util.createBuffer(JSON.stringify(data)));
                cipher.finish();
                var encrypted = cipher.output;
                socket.emit('auth', encrypted)


            }
        })
    }

    setRespons(res) {

        //    text=this.state.response;
        this.setState({response: this.state.response + '\n' + res})
    }

    register() {


        var that = this;

        var keypair = rsa.generateKeyPair({bits: 1024, e: 0x10001});
        var pem_private = pki.privateKeyToPem(keypair.privateKey);
        var pem_public = pki.publicKeyToPem(keypair.publicKey);
        that.setState({pemPublicKeyClient: pem_public})
        that.setState({pemPrivateKeyClient: pem_private})
        var md = forge.md.sha256.create();
        md.update(that.state.userPasswordRegister);
        var hashpass = md.digest().toHex();


        var cipher = forge.rc2.createEncryptionCipher(skey);
        cipher.start(iv);
        cipher.update(forge.util.createBuffer(JSON.stringify({
            'username': that.state.userRegister,
            'pass': hashpass,
            'publickey': pem_public,

        })));
        cipher.finish();
        var encrypted = cipher.output;
// outputs encrypted hex
        console.log(encrypted.toHex());

        socket.emit('register', encrypted.toHex())
        //console.log(encrypted)


        // outputs encrypted hex
        // console.log(encrypted.toHex());
        // var encrypted2 = forge.util.hexToBytes(encrypted.toHex());
        // var cipher = forge.rc2.createDecryptionCipher(skey);
        // cipher.start(iv);
        // cipher.update(forge.util.createBuffer(encrypted2));
        // cipher.finish();
        // console.log(cipher)
// // outputs decrypted hex
//         console.log(cipher);

        // console.log(JSON.stringify(publicKey.encrypt({
        //     'username': that.state.userRegister,
        //     'pass': hashpass,
        //     'publickey': pem_public,
        //
        // })))


//         socket.emit('register',)
//         socket.on('getPublickey', function (msg) {
//             var nonce = msg.nonce
//             var publicKey = pki.publicKeyFromPem(msg.key);
//
//
//             redisClient.hset(that.state.userRegister, 'pass', hashpass)
//             var keypair = rsa.generateKeyPair({bits: 1024, e: 0x10001});
//             var pem_private = pki.privateKeyToPem(keypair.privateKey);
//             var pem_public = pki.publicKeyToPem(keypair.publicKey);
//
//
// // outputs encrypted hex
//             console.log(encrypted.toHex());
//             var cipher = forge.rc2.createDecryptionCipher(skey);
//             cipher.start(iv);
//             cipher.update(encrypted);
//             cipher.finish();
// // outputs decrypted hex
//             console.log(cipher);
//
//
//             socket.emit('publicKeySent', publicKey.encrypt(JSON.stringify({
//                 'skey': skey,
//                 'nonce': nonce
//             })))
        // console.log(JSON.stringify(publicKey.encrypt({
        //     'username': that.state.userRegister,
        //     'pass': hashpass,
        //     'publickey': pem_public,
        //     'nonce': nonce
        // })))

        // })


        //console.log(this.state)
    }

    showError(error) {
        this.setState({modalOpen: false})
        this.setState({error: error})
        this.setState({modalOpen: true})

    }

    hideError() {
        this.setState({modalOpen: false})
    }

    login() {
        var that = this;
        var md = forge.md.sha256.create();
        md.update(that.state.loginPass);
        var hashpass = md.digest().toHex();

        // redisClient.hgetall(this.state.loginUsername, function (err, obj) {
        // if (obj == null) {
        //     that.setRespons('this user not exist!!!!!')
        // } else if (obj.pass != hashpass) {
        //     that.setRespons('pasword is not correct!!!!!')
        // }
        // else {
        //     var md = forge.md.sha256.create();
        //     md.update(that.state.message);
        //     var hashmessage = md.digest().toHex();
        //     var pem_privateKey = obj.pemPrivateKeyClient;
        //     var privateKey = pki.privateKeyFromPem(pem_privateKey)
        //     var pem_publicKey = obj.pemPrivateKeyClient;
        //     var publicKey = pki.privateKeyFromPem(pem_publicKey)
        //     //var sign=privateKey.sign(md)
        //     var encoded = pki.rsa.encrypt(hashmessage, publicKey, true) ;
        //     var decoded = pki.rsa.decrypt( encoded , privateKey, false, false);
        //
        var md = forge.md.sha256.create();
        md.update(that.state.message);
        var messagehash = md.digest().toHex();
        var data = {
            'username': that.state.loginUsername,
            'pass': hashpass,
            'message': that.state.message,
            'messagehash': messagehash
        }

        console.log(skey)
        console.log(iv)
        var cipher = forge.rc2.createEncryptionCipher(skey);
        cipher.start(iv);
        cipher.update(forge.util.createBuffer(JSON.stringify(data)));
        cipher.finish();
        var encrypted = cipher.output;
        socket.emit('login', encrypted)


        // var cipher = forge.rc2.createEncryptionCipher(skey);
        // cipher.start(iv);
        // cipher.update(forge.util.createBuffer(data));
        // cipher.finish();
        // var encrypted = cipher.output;
        // socket.emit('login', encrypted.toHex())
        //


        //
        //
        // var sillyString = decoded.slice(64);
        // console.log('hash',hashmessage)
        //
        // console.log( sillyString)

        //     }
        // });
        //  console.log(redisClient.hget(this.state.loginUsername, 'pemPrivateKeyClient').)
        // md.update(that.state.message);
        // var hashmessage = md.digest().toHex();
        //

        // var pem_private = redisClient.hget(this.state.loginUsername,'pemPrivateKeyClient')
        // var pem_public = pki.privateKeyFromPem();
        //
        // this.setRespons('sdfsdf')
        // redisClient.hset('usernaem', 'publicKey', 131232)
        // socket.emit('login', 'sdfsafsdf')
        // console.log("sfsdfd")
        // this.setState({disablelogin: true})
    }

    render() {


        return (
            // <Button inverted color='teal' onClick={this.handleClick}>
            //     {this.state.isToggleOn ? 'ON' : 'OFF'}
            // </Button>
            // <div>
            //     <form className="ui large form">
            //         <div className="ui stacked segment">
            //             <div className="field">
            //                 <div className="ui fluid left icon input"><input type="text"
            //                                                              placeholder="E-mail address"></input><i
            //                     aria-hidden="true" className="user icon"></i></div>
            //             </div>
            //             <div className="field">
            //                 <div className="ui fluid left icon input"><input type="password" placeholder="Password"></input><i
            //                     aria-hidden="true" className="lock icon"></i></div>
            //             </div>
            //             <button className="ui teal large fluid button" role="button">Login</button>
            //         </div>
            //     </form>
            // </div>
            <div>
                <Modal

                    open={this.state.modalOpen}

                    closeOnEscape={false}
                    closeOnRootNodeClick={false}
                    basic
                    size='small'
                >
                    <Header icon='browser' content='Error'/>
                    <Modal.Content>
                        <h3>{this.state.error}</h3>
                    </Modal.Content>
                    <Modal.Actions>

                    </Modal.Actions>
                </Modal>
                <Grid celled='internally'>
                    <Grid.Row>
                        <Grid.Column width={6}>
                            <div className='login-form'>

                                <Grid
                                    textAlign='center'
                                    style={{height: '100%'}}
                                    verticalAlign='middle'
                                >
                                    <Grid.Column>
                                        <Header as='h2' color='teal' textAlign='center'>
                                            Log-in and send value
                                        </Header>
                                        <Form >
                                            <Segment stacked>
                                                <Form.Input
                                                    fluid
                                                    icon='user'
                                                    iconPosition='left'
                                                    placeholder='Username'
                                                    onChange={(text) => this.setState({loginUsername: text.target.value})}
                                                />
                                                <Form.Input
                                                    disabled={this.state.disablelogin}
                                                    fluid
                                                    icon='lock'
                                                    iconPosition='left'
                                                    placeholder='Password'
                                                    type='password'
                                                    onChange={(text) => this.setState({loginPass: text.target.value})}
                                                />
                                                <Form.Input
                                                    disabled={this.state.disablelogin}
                                                    fluid
                                                    icon='flag'
                                                    iconPosition='left'
                                                    placeholder='value'
                                                    type='text'
                                                    onChange={(text) => this.setState({message: text.target.value})}
                                                />

                                                <Button onClick={this.login} color='teal' fluid
                                                        size='large'>Login</Button>
                                            </Segment>
                                        </Form>

                                    </Grid.Column>
                                </Grid>
                            </div>
                        </Grid.Column>

                        <Grid.Column width={5}>
                            <Header as='h2' color='teal' textAlign='center'>
                                Registeration
                            </Header>

                            <Form >
                                <Segment style={{marginTop: 50}} stacked>
                                    <Form.Input
                                        fluid
                                        icon='user'
                                        iconPosition='left'
                                        placeholder='Username'
                                        onChange={(text) => this.setState({userRegister: text.target.value})}

                                    />
                                    <Form.Input
                                        disabled={this.state.disablelogin}
                                        fluid
                                        icon='lock'
                                        iconPosition='left'
                                        placeholder='Password'

                                        onChange={(text) => this.setState({userPasswordRegister: text.target.value})}
                                        type='password'
                                    />
                                    {/*<TextArea label={{icon: 'asterisk'}}*/}

                                    {/*placeholder='Tell us more' style={{minHeight: 80}}/>*/}


                                    <Button onClick={this.register} color='teal' style={{marginTop: 20}} fluid
                                            size='large'>Register</Button>

                                </Segment>

                            </Form>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <Header as='h2' color='teal' textAlign='center'>
                                Auth without pass
                            </Header>

                            <Form >
                                <Segment style={{marginTop: 20}} stacked>
                                    <Form.Input
                                        fluid
                                        icon='user'
                                        iconPosition='left'
                                        placeholder='Username'
                                        onChange={(text) => this.setState({userAuth: text.target.value})}

                                    />
                                    {/*<TextArea label={{icon: 'asterisk'}}*/}

                                    {/*placeholder='Tell us more' style={{minHeight: 80}}/>*/}


                                    <Button onClick={this.auth} color='teal' style={{marginTop: 20}} fluid
                                            size='large'>Login</Button>

                                </Segment>

                            </Form>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column  >
                            <Header as='h2' color='green' textAlign='center'>
                                Response Events
                            </Header>
                            {/*<Segment raised>*/}

                            {/*<div>*/}
                            {/**/}
                            {/*</div>*/}
                            {/*</Segment>*/}
                            <Message style={{overflow: 'scroll', height: '200px'}} info scrolling>

                                {nl2br(this.state.response)}
                            </Message>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>

        );
    }
}


render(
    <App/>
    , document.getElementById('app'))
// //render(
// < app / >  , document.querySelector('#app')
// )
// ;
