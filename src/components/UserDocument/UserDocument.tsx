import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

// import './FlowManagementTable.css';

type FlowManagementPropsTypes = {
  auth: any
}

type FlowManagementStateTypes = {
  userDocument: any
}

class UserDocument extends Component<FlowManagementPropsTypes, FlowManagementStateTypes> {
  constructor(props: any) {
    super(props);
    this.state = {
      userDocument: {}
    }
  }

  accessToken(): string {
    return this.props.auth.getAccessToken()
      .then((token: string) => token)
  }

  async componentDidMount() {
    const accessToken = 'Barear ' + await this.accessToken();
    fetch(`${process.env.REACT_APP_API_URL}/api/usergetdocument?SessionId=dslf546khds$GgGfhsdfdfsd`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        authorization: accessToken
      }
    })
    .then(res => res.json())
    .then((documentData) => {
      console.log('usergetdocument Success Data: ', documentData);
      this.setState({ userDocument: documentData })
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <h3>User Document:</h3>
        {JSON.stringify(this.state.userDocument)}
      </div>
    )
  }
};

export default withAuth(UserDocument);