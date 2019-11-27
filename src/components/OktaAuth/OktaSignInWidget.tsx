import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
// import '@okta/okta-signin-widget/dist/css/okta-theme.css';

type SignInPropsTypes = {
  baseUrl: string,
  onSuccess: (res: any) => void,
  onError: (err: Error) => void;
}

class OktaSignInWidget extends Component<SignInPropsTypes, {}> {
  widget: any;

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.widget = new OktaSignIn({
      baseUrl: this.props.baseUrl,
      authParams: { pkce: true },
      features: { registration: true }
    });
    this.widget.renderEl({el}, this.props.onSuccess, this.props.onError);
  }

  componentWillUnmount() {
    this.widget.remove();
  }

  render() {
    return <div />;
  }
};

export default OktaSignInWidget;