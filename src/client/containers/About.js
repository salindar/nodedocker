import React from 'react';
import { Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {setAuthenticated } from '../actions/fileActions';
import { connect } from 'react-redux';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      inputErrorUsername: '',
      inputErrorPassword: '',
      validationError: ''
    }
  }

  validateInputs() {
    let validated = true;
    if (!this.state.username) {
      validated = false;
      this.setState({ inputErrorUsername: "Please enter username." });
    } else if (this.state.username) {
      this.setState({ inputErrorUsername: '' });
    } else if (!this.state.password) {
      validated = false;
      this.setState({ inputErrorPassword: "Please enter password." });
    } else if (this.state.password) {
      this.setState({ inputErrorPassword: '' });
    }
    return validated;
  }

  handleClick(event) {
    if (this.validateInputs()) {
      // this.props.history.push(`/`)
      const data = new FormData();
      data.append('username', this.state.username);
      data.append('password', this.state.password);

      fetch('/api/login', {
        method: 'POST',
        body: data,
      }).then((response) => {
        if (response.status === 401) {
          this.setState({ validationError: "Username or Password Incorrect." });
          this.props.setAuthenticated(false);
        } else if (response.status === 200) {
          this.props.setAuthenticated(true);
          this.props.history.push(`/`);
        }

      });
    }
  }
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
            <AppBar
              title="Sysco Source File Upload Login"
            />

            <TextField
              hintText="Enter your Username"
              floatingLabelText="Username"
              errorText={this.state.inputErrorUsername}
              onChange={(event, newValue) => this.setState({ username: newValue })}
            />
            <br />
            <TextField
              type="password"
              hintText="Enter your Password"
              floatingLabelText="Password"
              errorText={this.state.inputErrorPassword || this.state.validationError}
              onChange={(event, newValue) => this.setState({ password: newValue })}
            />
            <br />
            <RaisedButton label="Login" primary={true} style={style} onClick={(event) => this.handleClick(event)} />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
const mapDispatchToProps = {
  setAuthenticated
};
export default connect(state => state, mapDispatchToProps)(About);
const style = {
  margin: 15,
};
