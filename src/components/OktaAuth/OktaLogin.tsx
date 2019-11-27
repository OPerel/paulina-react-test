import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import OktaSignInWidget from './OktaSignInWidget';
import { withAuth } from '@okta/okta-react';

type OktaLoginPropsTypes = {
  auth: any,
  baseUrl: string
}

type OktaLoginStateTypes = {
  authenticated: null | boolean
}

export default withAuth(class OktaLogin extends Component<OktaLoginPropsTypes, OktaLoginStateTypes> {
  constructor(props: any) {
    super(props);
    this.state = {
      authenticated: null
    };
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  onSuccess = (res: any) => {
    if (res.activationToken) {
      localStorage.Registration = true;
    }
    if (res.status === 'SUCCESS') {
      console.log('login res: ', res);
      return this.props.auth.redirect({
        sessionToken: res.session.token
      });
   } else {
    // The user can be in another authentication state that requires further action.
    // For more information about these states, see:
    //   https://github.com/okta/okta-signin-widget#rendereloptions-success-error
    }
  }

  onError = (err: Error) => {
    console.log('error logging in', err);
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  render() {
    if (this.state.authenticated === null) return null;
    return this.state.authenticated ?
      <Redirect to={{ pathname: '/flow-management' }} /> :
      <OktaSignInWidget
        baseUrl={this.props.baseUrl}
        onSuccess={this.onSuccess}
        onError={this.onError}
      />;
  }
});
