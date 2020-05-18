import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import FlowManagementTable from './FlowManagementTable';

type FlowManagementState = {
  userFlows: any,
  accessToken: string
}

type FlowManagementProps = {
  auth: any
}

class FlowManagement extends Component<FlowManagementProps, FlowManagementState> {
  constructor (props: any) {
    super(props)
    this.state = {
      userFlows: {},
      accessToken: ''
    }
  }

  getAccessToken = () => {
    this.props.auth.getAccessToken()
      .then((accessToken: string) => {
        this.setState({ accessToken }, this.getUserFlows)
      });
  }

  getUserFlows(): void {
    let { accessToken } = this.state;
    if (localStorage.Registration === 'true') {
      accessToken = `Registration Barear ${accessToken}` 
      localStorage.Registration = false;
    } else {
      accessToken = `Barear ${accessToken}`  
    }
    
    const url = `${process.env.REACT_APP_API_URL}/api/getuserflows?SessionId=dslf546khds$GgGfhsdfdfsd`;
    console.log('send getuserflows req with accessToken: ' + accessToken + '\nAnd static SessionId');
    fetch(url, {
      method: 'get',
      headers: {
        authorization: accessToken
      },
    })
    .then((res: any) => res.json())
    .then((userFlows: any) => {
      console.log('Got user flows: ', userFlows);
      this.setState({ userFlows })
    })
    .catch(err => {
      console.warn(err);
    });
  }

  componentDidMount() {
    this.getAccessToken();
  }

  render() {
    const {
      publishedDocumentsList,
      pDocumentsList,
      InProgressFlows,
      OutsourceJobs
    } = this.state.userFlows;

    return (
      <>
        <h2>Flow Management!</h2>
        <FlowManagementTable
          tableName="Published Documents"
          documentsList={publishedDocumentsList}
          headerList={['Document Name', 'Owner', 'Element Path']}
          keyValueList={['doc.name', 'doc._metadata.owner.name', 'doc._metadata.owner.ElementPath']}
          accessToken={this.state.accessToken}
        />

        <FlowManagementTable
          tableName="Progress Documents"
          documentsList={pDocumentsList}
          headerList={['Document Name', 'Owner', 'Element Path', 'Creator', 'Shared With', 'Descriptor']}
          keyValueList={[
            'doc.name',
            'doc._metadata.owner.name',
            'doc._metadata.owner.ElementPath',
            'doc._metadata.creator',
            'doc._metadata.sharedWith',
            'doc._metadata.descriptor.name'
          ]}
        />

        <FlowManagementTable
          tableName="In Progress Flows"
          documentsList={InProgressFlows}
          headerList={['Document Name', 'Document ID']}
          keyValueList={['doc.name', 'doc._id']}
        />

        <FlowManagementTable
          tableName="Outsource Jobs"
          documentsList={OutsourceJobs}
          headerList={['Document Name', 'Document ID']}
          keyValueList={['doc.name', 'doc._id']}
        />
      </>
    )
  }
};

export default withAuth(FlowManagement);