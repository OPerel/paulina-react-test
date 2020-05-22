import React, { useState, useEffect } from 'react';
import { withAuth } from '@okta/okta-react';

import FlowManagementTable from './FlowManagementTable/FlowManagementTable';

type FlowManagementProps = {
  auth: any
}

const FlowManagement: React.FC<FlowManagementProps> = ({ auth }) => {

  const [accessToken, setAccessToken] = useState<string>('');
  const [userFlows, setUserFlows] = useState<any>({});

  useEffect(() => {
    const getUserFlows = async (): Promise<void> => {
      let accessToken = await auth.getAccessToken();
      setAccessToken(accessToken);
      if (localStorage.getItem('Registration') === 'true') {
        accessToken = `Registration Barear ${accessToken}`
        localStorage.setItem('Registration', 'false');
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
        setUserFlows(userFlows);
      })
      .catch(err => {
        console.warn(err);
      });
    }

    getUserFlows();
  }, []);

  const {
    publishedDocumentsList,
    pDocumentsList,
    InProgressFlows,
    OutsourceJobs
  } = userFlows;

  return (
    <>
      <h2>Flow Management!</h2>
      <FlowManagementTable
        tableName="Published Documents"
        documentsList={publishedDocumentsList}
        headerList={['Document Name', 'Owner', 'Element Path']}
        keyValueList={['doc.name', 'doc._metadata.owner.name', 'doc._metadata.owner.ElementPath']}
        accessToken={accessToken}
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
};

export default withAuth(FlowManagement);