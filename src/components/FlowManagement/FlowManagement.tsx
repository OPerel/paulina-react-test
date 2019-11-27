import React, { Component } from 'react';
import { withAuth } from '@okta/okta-react';

import FlowManagementTable from './FlowManagementTable';

type FlowManagementState = {
  userFlows: any
}

type FlowManagementProps = {
  auth: any
}

export default withAuth(class FlowManagement extends Component<FlowManagementProps, FlowManagementState> {
  constructor (props: any) {
    super(props)
    this.state = {
      userFlows: {},
    }
  }

  getUserFlows(): void {
    this.props.auth.getAccessToken().then((accessToken: string) => {
      if (localStorage.Registration === 'true') {
        accessToken = `Registration Barear ${accessToken}` 
        localStorage.Registration = false;
      } else {
        accessToken = `Barear ${accessToken}`  
      }
      
      const url = `${process.env.REACT_APP_API_URL}/api/getuserflows?SessionId=${accessToken}`;
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
    })
  }

  componentDidMount() {
    this.getUserFlows();
  }

  render() {
    const {
      publishedDocumentsList,
      pDocumentsList,
      InProgressFlows,
      OutsourceJobs
    } = this.state.userFlows;

    // console.log('flowManagement accessToken render: ', accessToken)
    return (
      <>
        <h2>Flow Management!</h2>
        <FlowManagementTable
          tableName="Published Documents"
          documentsList={publishedDocumentsList}
          headerList={['Document Name', 'Document ID', 'Creator']}
          keyValueList={['doc.name', 'doc._id', 'doc._metadata.creator']}
        />

        <FlowManagementTable
          tableName="Progress Documents"
          documentsList={pDocumentsList}
          headerList={['Document Name', 'Document ID', 'Creator']}
          keyValueList={['doc.name', 'doc._id', 'doc._metadata.creator']}
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
});

// export default FlowManagement;