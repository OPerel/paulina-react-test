import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { Link } from 'react-router-dom';

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
    const goTo = loc !== 'http://localhost:3000/' ? '/' : '/flow-management';
    return (
      <nav style={{ padding: '20px' }}>
        {
          isAuthenticated ? 
          <>  
            <span style={{ marginRight: '30px' }}>{this.state.userEmail}</span>
            <Link to={goTo} style={{ marginRight: '30px' }}>{goTo === '/' ? 'Home' : 'Flow Management'}</Link>
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
