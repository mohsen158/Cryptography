import React from 'react';
import {render} from 'react-dom';
// import '../semantic/dist/semantic.min.css';
//import '../css/semantic.min.css';
import RaisedButton from 'material-ui/RaisedButton';
import nl2br from 'react-newline-to-break';
var redis = require('redis');
var redisClient = redis.createClient()
redisClient.on('connect', function () {
    console.log('connected');
});


import {Button, Form, Segment, Input, TextArea, Message,Icon, Header, Grid, Image, Modal} from 'semantic-ui-react'

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

        // setInterval(() => {
        //     this.setState({ modalOpen: this.state.modalOpen ? false : true })
        // }, 2000)
        super(props);
        this.state = {
            isToggleOn: true,
            modalOpen: false,
            disablelogin: false,
            error:'',
            response: 'start app'
        };

        // This binding is necessary to make `this` work in the callback
        this.login = this.login.bind(this);
        this.clearResponse = this.clearResponse.bind(this);
        this.setRespons = this.setRespons.bind(this);
        this.showError = this.showError.bind(this);
        this.hideError = this.hideError.bind(this);

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

    setRespons(res) {

        //    text=this.state.response;
        this.setState({response: this.state.response + '\n' + res})
    }

    register() {

    }
    showError(error)
    {
        this.setState({ modalOpen: false })
        this.setState({error:error})
        this.setState({modalOpen:true})

    }
  hideError()
  {
      this.setState({ modalOpen: false })
  }

    login() {
        this.setRespons('sdfsdf')
        redisClient.hset('usernaem', 'publicKey', 131232)
        socket.emit('login', 'sdfsafsdf')
        console.log("sfsdfd")
        this.setState({disablelogin: true})
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
                    trigger={<Button onClick={this.handleOpen}>Show Modal</Button>}
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
                        <Grid.Column width={8}>
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
                                                />
                                                <Form.Input
                                                    disabled={this.state.disablelogin}
                                                    fluid
                                                    icon='lock'
                                                    iconPosition='left'
                                                    placeholder='Password'
                                                    type='password'
                                                />
                                                <Form.Input
                                                    disabled={this.state.disablelogin}
                                                    fluid
                                                    icon='lock'
                                                    iconPosition='left'
                                                    placeholder='value'
                                                    type='text'
                                                />

                                                <Button onClick={this.login} color='teal' fluid
                                                        size='large'>Login</Button>
                                            </Segment>
                                        </Form>

                                    </Grid.Column>
                                </Grid>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={8}>
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
                                    />
                                    <Form.Input
                                        disabled={this.state.disablelogin}
                                        fluid
                                        icon='lock'
                                        iconPosition='left'
                                        placeholder='Password'
                                        type='password'
                                    />
                                    {/*<TextArea label={{icon: 'asterisk'}}*/}

                                    {/*placeholder='Tell us more' style={{minHeight: 80}}/>*/}


                                    <Button onClick={this.login} color='teal' style={{marginTop: 20}} fluid
                                            size='large'>Register</Button>

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
                            <Message info scrolling>

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
