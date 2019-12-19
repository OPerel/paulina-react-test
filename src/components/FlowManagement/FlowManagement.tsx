import React, { Component } from 'react';
// import { withAuth } from '@okta/okta-react';
import { connect } from 'react-redux';

import FlowManagementTable from './FlowManagementTable';

type FlowManagementState = {
  userFlows: any
}

type FlowManagementProps = {
  // auth: any
  accessToken: string
}

const mapStateToProps = (state: any) => ({
  accessToken: state.setAccessToken.accessToken
})

class FlowManagement extends Component<FlowManagementProps, FlowManagementState> {
  constructor (props: any) {
    super(props)
    this.state = {
      userFlows: {}
    }
  }

  getUserFlows(): void {
    let { accessToken } = this.props;
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
    // setTimeout(() => this.getUserFlows(), 0)
    this.getUserFlows()
    /** 
     * hacky solution! on page refreah it needs to wait for the async call of getAccessToken in MainNav.
     * what's the proper way?
    */
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
          headerList={['Document Name', 'Document ID', 'Creator']}
          keyValueList={['doc.name', 'doc._id', 'doc._metadata.creator']}
          accessToken={this.props.accessToken}
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
};

export default connect(mapStateToProps)(FlowManagement);