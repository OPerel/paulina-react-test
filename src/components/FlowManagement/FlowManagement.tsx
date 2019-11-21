import React, { Component } from 'react';

type FlowManagementState = {
  userFlows: []
}

type FlowManagementProps = {}

class FlowManagement extends Component<FlowManagementProps, FlowManagementState> {
  state: FlowManagementState = {
    userFlows: []
  }

  getUserFlows(): void {
    fetch(`${process.env.REACT_APP_API_URL}/api/getuserflows`, {
      method: 'get',
      headers: {},
    })
    .then(res => res.json())
    .then(res => this.setState({ userFlows: res }));
  }

  componentDidMount() {
    this.getUserFlows();
  }

  render() {
    return (
      <>
        <h2>Flow Management!</h2>
        <p>User Flows: {JSON.stringify(this.state.userFlows)}</p>
      </>
    )
  }
}

export default FlowManagement;