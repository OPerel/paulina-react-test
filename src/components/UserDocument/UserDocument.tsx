import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import UserDocumentTable from './UserDocumentTable/UserDocumentTable';

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

  async getUserCurrentContext() {
    const accessToken = 'Barear ' + await this.accessToken();
    console.log('Send get-user-current-context requset with accessToken: ', accessToken);
    fetch(`${process.env.REACT_APP_API_URL}/api/get-user-current-context?SessionId=dslf546khds$GgGfhsdfdfsd`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        authorization: accessToken
      }
    })
    .then(res => res.json())
    .then((documentData) => {
      console.log('get-user-current-context Success Data: ', documentData);
      this.setState({ userDocument: documentData })
    })
    .catch(err => console.log(err));
  }

  componentDidMount() {
    this.getUserCurrentContext();
  }

  render() {
    return (
      <div>
        <h3>User Document:</h3>
        {/* <pre style={{ textAlign: 'left' }}>{JSON.stringify(this.state.userDocument, null, 2)}</pre> */}
        <UserDocumentTable userDocument={this.state.userDocument} />
      </div>
    )
  }
};

export default withAuth(UserDocument);