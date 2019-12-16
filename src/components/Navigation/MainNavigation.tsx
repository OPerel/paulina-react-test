import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import { getIsAuthenticated, getUserEmail } from './actions';

type MainNavPropsTypes = {
  auth: any,
  onCheckAuthentication: (isAuthenticated: boolean) => void,
  isAuthenticated: boolean,
  onGetUserEmail: (userEmail: string) => void,
  userEmail: string
}

const mapStateToProps = (state: any) => {
  return {
    isAuthenticated: state.setIsAuthenticated.isAuthenticated,
    userEmail: state.setUserEmail.userEmail
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onCheckAuthentication: (isAuthenticated: boolean) => dispatch(getIsAuthenticated(isAuthenticated)),
    onGetUserEmail: (userEmail: string) => dispatch(getUserEmail(userEmail))
  }
}

class MainNavigation extends Component<MainNavPropsTypes, {}> {
  logout = () => {
    this.props.auth.logout('/login');
  }

  checkAuthentication(): void {
    this.props.auth.isAuthenticated()
      .then((isAuthenticated: boolean) => {
        if (isAuthenticated !== this.props.isAuthenticated) {
          console.log('User is authenticated!')
          this.props.onCheckAuthentication(isAuthenticated);
          this.getUser();
        }
      });
  }

  // getAccessToken = (): void => {
  //   this.props.auth.getAccessToken()
  //     .then((accessToken: string) => {
  //       this.props.onGetUserEmail(accessToken)
  //     });
  // }

  getUser(): void {
    if (this.props.isAuthenticated) {
      this.props.auth.getUser()
        .then((user: any) => {
          console.log('Got user email: ', user.email)
          this.props.onGetUserEmail(user.email);
        })
        .catch((err: Error) => console.log(err))
    }
  }

  componentDidMount() {
    this.checkAuthentication();
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  render () {
    const { isAuthenticated } = this.props;
    const loc = window.location.href;
    return (
      <nav style={{ padding: '20px' }}>
        {
          isAuthenticated ? 
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>  
            <span id="email">{this.props.userEmail}</span>
            <NavLink exact to="/" activeStyle={{ display: 'none' }}>Home</NavLink>
            <NavLink to="/flow-management" activeStyle={{ display: 'none' }}>Flow Management</NavLink>
            <button id="logout" onClick={this.logout}>Log Out</button>
          </div> : (
            loc !== 'http://localhost:3000/login' ?
            <Link id="login" to="/login">Log In</Link> :
            <Link id="home-link" to="/">Home</Link>
          )
        }
      </nav>
    ) 
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(MainNavigation));
