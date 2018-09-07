import React, { Component } from 'react';
import './App.css';
import Signup from './components/signUp'
import Login from './components/login'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signup: false, login: true
    };
    this.switch = this.switch.bind(this)
  }

  switch(word) {
    let signup, login;
    if (word == "signup") { signup = true; login = false; }
    else { login = true; signup = false; }
    return this.setState({ login: login, signup: signup })

  }
  render() {
    return (
      <div>
        <div id="buttons">
          <p id="signupButton" onClick={() => this.switch("signup")} className={this.state.signup ? "yellow" : "blue"}>Sign Up</p>
          <p id="loginButton" onClick={() => this.switch("login")} className={this.state.login ? "yellow" : "blue"}> Login</p>
        </div>
        {this.state.signup ? <Signup switch={this.switch} /> : null}
        {this.state.login ? <Login /> : null}

      </div>

    )
  }
}



export default App;
