import React, { Component } from 'react';
import axios from 'axios';
let serverIp = 'http://127.0.0.1:3030';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            password: '',
            conformPassword: '',
            email: '',
            userError: false,
            message: ''
        };
        // this.switch = this.switch.bind(this)
    }
    fName(el) {
        this.setState({ firstname: el.target.value });
    }
    lName(el) {
        this.setState({ lastname: el.target.value });
    }
    email(el) {
        this.setState({ email: el.target.value });
    }
    password(el) {
        this.setState({ password: el.target.value });
    }
    conPassword(el) {
        this.setState({ conformPassword: el.target.value });
    }
    signUp() {
        console.log(this.state);
        axios
            .post(serverIp + '/api/users/register', this.state)
            .then(
                function (response) {
                    console.log(response);
                    if (response.data.success) {
                        this.setState({
                            firstname: '',
                            lastname: '',
                            email: '',
                            conformPassword: '',
                            password: '',
                            userError: false,
                        });
                        this.props.switch("login")
                    } else {
                        alert(response.data.message)
                        this.setState({ userError: true });
                    }
                }.bind(this)
            );
    }
    render() {
        let { firstname, lastname, password, conformPassword, email } = this.state
        return (
            <div>
                <div id="signup">
                    <input onChange={(el) => this.fName(el)}
                        type="text"
                        value={firstname}
                        id="first"
                        placeholder="First Name" />
                    <input onChange={(el) => this.lName(el)}
                        type="text"
                        value={lastname}
                        id="last"
                        placeholder="Last Name" />
                    <input onChange={(el) => this.email(el)}
                        type="email"
                        value={email}
                        id="email"
                        placeholder="Email" />
                    <input onChange={(el) => this.password(el)}
                        type="password"
                        value={password}
                        id="password"
                        placeholder="Password" />
                    <input onChange={(el) => this.conPassword(el)}
                        type="password"
                        value={conformPassword}
                        id="confirm"
                        placeholder="Confirm Password" />
                    <button onClick={() => this.signUp()} id="send">Send</button>
                </div>
            </div>

        )
    }
}

export default Signup
