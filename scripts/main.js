import React from 'react';
import {render} from 'react-dom';
// import '../semantic/dist/semantic.min.css';
//import '../css/semantic.min.css';
import RaisedButton from 'material-ui/RaisedButton';




import {Button, Form, Segment, Input, TextArea, Message, Header, Grid, Image, Modal} from 'semantic-ui-react'

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
        this.state = {
            isToggleOn: true,
            disablelogin: false
        };

        // This binding is necessary to make `this` work in the callback
        this.login = this.login.bind(this);
    }

    //
    // handleClick() {
    //     console.log(document.getElementById('username').textContent)
    //     this.setState(prevState => ({
    //         isToggleOn: !prevState.isToggleOn
    //     }));
    // }

    login() {
        socket.emit('login','sdfsafsdf')
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
                                        Log-in to your account
                                    </Header>
                                    <Form >
                                        <Segment stacked>
                                            <Form.Input
                                                fluid
                                                icon='user'
                                                iconPosition='left'
                                                placeholder='E-mail address'
                                            />
                                            <Form.Input
                                                disabled={this.state.disablelogin}
                                                fluid
                                                icon='lock'
                                                iconPosition='left'
                                                placeholder='Password'
                                                type='password'
                                            />

                                            <Button onClick={this.login} color='teal' fluid size='large'>Login</Button>
                                        </Segment>
                                    </Form>

                                </Grid.Column>
                            </Grid>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Header as='h2' color='teal' textAlign='center'>
                            Log-in to your account
                        </Header>

                        <Form>
                            <Segment stacked>
                            <TextArea label={{icon: 'asterisk'}}

                                      placeholder='Tell us more' style={{minHeight: 80}}/>


                                <Button onClick={this.login} color='teal' style={{marginTop:20}} fluid size='large'>Send</Button>

                            </Segment>

                        </Form>
                    </Grid.Column>

                </Grid.Row>

                <Grid.Row>
                    <Grid.Column  >
                        <Header as='h2' color='teal' textAlign='center'>
                            Log-in to your account
                        </Header>

                        <Form>
                            <Segment stacked>
                            <TextArea label={{icon: 'asterisk'}}

                                      placeholder='Tell us more' style={{minHeight: 80}}/>


                                <Button onClick={this.login} color='teal' style={{marginTop:20}} fluid size='large'>Send</Button>

                            </Segment>

                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>


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
