import React, { Component } from 'react';

type FlowManagementState = {
  userFlows: []
}

type FlowManagementProps = {
  accessToken: string
}

class FlowManagement extends Component<FlowManagementProps, FlowManagementState> {
  constructor (props: any) {
    super(props)
    this.state = {
      userFlows: [],
    }
  }

  getUserFlows(): void {
    const url = `${process.env.REACT_APP_API_URL}/api/getuserflows?SessionId=dkjfbsdkjd8dnfud8hnd8nv8ev`;
    console.log('send getuserflows req with accessToken: ', this.props.accessToken, '\nAnd static SessionId');
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
    return (
      <>
        <h2>Flow Management!</h2>
        <p>User Flows: {JSON.stringify(this.state.userFlows)}</p>
      </>
    )
  }
}

export default FlowManagement;