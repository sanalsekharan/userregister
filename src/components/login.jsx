import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { setAccessToken } from '../authService';
let serverIp = 'http://127.0.0.1:3030';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            passwordError: false
        };
    }
    componentDidMount() {
        axios
            .post(serverIp + '/api/users/checkLogin')
            .then(
                function (response) {
                    console.log(response);
                    if (response.data.login) {
                        axios
                            .post(serverIp + '/api/users/getUserData')
                            .then(
                                function (response) {
                                    console.log(response);
                                }.bind(this)
                            );
                    }
                    this.props.dispatch({ type: 'Sign IN', data: response.data.login });
                }.bind(this)
            );
    }
    email(el) {
        this.setState({ email: el.target.value });
    }
    password(el) {
        this.setState({ password: el.target.value });
    }
    login() {
        console.log(this.state);
        axios
            .post(serverIp + '/api/users/loginUser', this.state)
            .then(
                function (response) {
                    console.log(response);
                    if (response.data.mailSend) {
                        alert(response.data.message)
                        this.setState({
                            email: '',
                            password: '',
                            passwordError: false,
                        });
                        // this.props.switch("login")
                    } else {
                        alert(response.data.message)
                        this.setState({ passwordError: true });
                    }
                }.bind(this)
            );
    }
    render() {
        let { email, password } = this.state;
        // console.log(this.props.login)
        return (
            <div>
                <div id="login">
                    <input onChange={(el) => this.email(el)}
                        value={email}
                        type="email" id="email"
                        placeholder="Email" />
                    <input
                        onChange={(el) => this.password(el)}
                        value={password}
                        type="password" id="password" placeholder="Password" />
                    <button onClick={() => this.login()} id="send">Send</button>
                </div>

            </div>

        )
    }
}
function mapStateToProps(state) {
    return {
        login: state.reducer.login,
    };
}
export default connect(mapStateToProps)(Login);
