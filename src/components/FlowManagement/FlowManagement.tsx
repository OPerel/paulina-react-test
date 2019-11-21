import React, { Component } from 'react';

import FlowManagementTable from './FlowManagementTable';

type FlowManagementState = {
  userFlows: any
}

type FlowManagementProps = {
  accessToken: string
}

class FlowManagement extends Component<FlowManagementProps, FlowManagementState> {
  constructor (props: any) {
    super(props)
    this.state = {
      userFlows: {},
    }
  }

  getUserFlows(): void {
    const url = `${process.env.REACT_APP_API_URL}/api/getuserflows?SessionId=dkjfbsdkjd8dnfud8hnd8nv8ev`;
    console.log('send getuserflows req with accessToken: ' + this.props.accessToken + '\nAnd static SessionId');
    fetch(url, {
      method: 'get',
      headers: {
        authorization: `Barear ${this.props.accessToken}`
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
    this.getUserFlows();
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
          documentList={publishedDocumentsList}
        />

        <FlowManagementTable
          tableName="Progress Documents"
          documentList={pDocumentsList}
        />

        <FlowManagementTable
          tableName="In Progress Flows"
          documentList={InProgressFlows}
        />

        <FlowManagementTable
          tableName="Outsource Jobs"
          documentList={OutsourceJobs}
        />
      </>
    )
  }
}

export default FlowManagement;