import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import { getIsAuthenticated, getUserEmail, getAccessToken } from './actions';
import { NavState } from './reducers';
import { IsAuthenticated, UserEmail, AccessToken } from './types';

type MainNavPropsTypes = {
  auth: any,
  onCheckAuthentication: (isAuthenticated: boolean) => void,
  onGetUserEmail: (userEmail: string) => void,
  // onGetAccessToken: (accessToken: string) => void,
  dispatch: any,
  isAuthenticated: IsAuthenticated,
  userEmail: UserEmail,
  accessToken: AccessToken
}

const mapStateToProps = (state: NavState) => {
  return {
    isAuthenticated: state.setIsAuthenticated.isAuthenticated,
    userEmail: state.setUserEmail.userEmail
  }
}

// const mapDispatchToProps = (dispatch: any) => {
//   return {
//     onCheckAuthentication: (isAuthenticated: IsAuthenticated) => dispatch(getIsAuthenticated(isAuthenticated)),
//     // onGetAccessToken: (accessToken: AccessToken) => dispatch(getAccessToken(accessToken)),
//     // onGetUserEmail: (userEmail: UserEmail) => dispatch(getUserEmail(userEmail))
//   }
// }

class MainNavigation extends Component<MainNavPropsTypes, {}> {
  logout = () => {
    this.props.auth.logout('/login');
  }

  checkAuthentication(): void {
    this.props.auth.isAuthenticated()
      .then((isAuthenticated: boolean) => {
        if (isAuthenticated !== this.props.isAuthenticated) {
          console.log('User is authenticated!')
          this.props.dispatch(getIsAuthenticated(isAuthenticated));
          this.getAccessToken();
        }
      });
  }
  
  getAccessToken = () => {
    console.log('getAccessToken is running!')
    this.props.dispatch({ type: 'REQUEST_PENDING' });
    this.props.auth.getAccessToken()
      // .then((response: any) => response.json())
      .then((data: string) => {
        this.props.dispatch(getAccessToken(data))
        this.getUser();
      })
      .catch((err: Error) => this.props.dispatch({ type: 'REQUEST_FAILED', payload: err }));
  }

  // getAccessToken = (): void => {
    // this.props.auth.getAccessToken()
    //   .then((accessToken: string) => {
    //     console.log('Got accessToken: ', accessToken);
    //     this.props.dispatch(getAccessToken(accessToken));
    //     this.getUser();
    //   })
    //   .catch((err: Error) => console.log(err));
  // }

  getUser(): void {
    this.props.auth.getUser()
      .then((user: any) => {
        console.log('Got user email: ', user.email)
        this.props.dispatch(getUserEmail(user.email));
      })
      .catch((err: Error) => console.log(err));
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

export default connect(mapStateToProps)(withAuth(MainNavigation));
