import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { Link } from 'react-router-dom';

type MainNavPropsTypes = {
  auth: any
  getAccessToken: (token: string) => string
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

  checkAuthentication (): void {
    this.props.auth.isAuthenticated()
    .then((isAuthenticated: boolean) => {
      if (isAuthenticated !== this.state.isAuthenticated) {
        this.setState({ isAuthenticated })
        if (isAuthenticated) {
          this.props.auth.getUser()
            .then((user: any) => this.setState({ userEmail: user.email }));
        }
      }
    });
  }

  componentDidMount(): void {
    this.checkAuthentication();
    this.props.auth.getAccessToken()
      .then((res: string) => this.props.getAccessToken(res));
  }

  componentDidUpdate(): void {
    this.checkAuthentication();
    
  }

  render () {
    const isAuthenticated = this.state.isAuthenticated;
    const loc = window.location.href;
    const loggedInTo = loc !== 'http://localhost:3000/flow-management' ? '/flow-management' : '/';
    return (
      <nav style={{ padding: '20px' }}>
        {
          isAuthenticated ? 
          <>  
            <span style={{ marginRight: '30px' }}>{this.state.userEmail}</span>
            <Link to={loggedInTo} style={{ marginRight: '30px' }}>{loggedInTo === '/' ? 'Home' : 'Flow Management'}</Link>
            <button onClick={this.logout}>Log Out</button>
          </> : (
            loc !== 'http://localhost:3000/login' ?
            <button onClick={this.login}>Log In</button> :
            <Link to="/">Home</Link>
          )
        }
      </nav>
    ) 
  }
})
