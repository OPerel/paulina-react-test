import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { Link, NavLink } from 'react-router-dom';

type MainNavPropsTypes = {
  auth: any
}

type MainNavStateTypes = {
  isAuthenticated: boolean | null,
  userEmail: string
}

export default withAuth(class MainNavigation extends Component<MainNavPropsTypes, MainNavStateTypes> {
  constructor(props: any) {
    super(props);
    this.state = {
      isAuthenticated: null,
      userEmail: ''
    }
  }

  login = () => {
    this.props.auth.login('/flow-management');
  }

  logout = () => {
    this.props.auth.logout('/login');
  }

  checkAuthentication(): void {
    this.props.auth.isAuthenticated()
      .then((isAuthenticated: boolean) => {
        if (isAuthenticated !== this.state.isAuthenticated) {
          this.setState({ isAuthenticated }, () => this.getUser())
        }
    });
  }

  getUser(): void {
    if (this.state.isAuthenticated) {
      this.props.auth.getUser()
      .then((user: any) => {
        this.setState({ userEmail: user.email });
      })
    }
  }

  componentDidMount() {
    this.checkAuthentication();
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  render () {
    const { isAuthenticated } = this.state;
    const loc = window.location.href;
    return (
      <nav style={{ padding: '20px' }}>
        {
          isAuthenticated ? 
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>  
            <span id="email">{this.state.userEmail}</span>
            <NavLink exact to="/" activeStyle={{ display: 'none' }}>Home</NavLink>
            <NavLink to="/flow-management" activeStyle={{ display: 'none' }}>Flow Management</NavLink>
            <button id="logout" onClick={this.logout}>Log Out</button>
          </div> : (
            loc !== 'http://localhost:3000/login' ?
            <button id="login" onClick={this.login}>Log In</button> :
            <Link id="home-link" to="/">Home</Link>
          )
        }
      </nav>
    ) 
  }
})
