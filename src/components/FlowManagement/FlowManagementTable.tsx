import React from 'react';
import { Link } from 'react-router-dom';

import './FlowManagementTable.css';

type FlowManagementPropsTypes = {
  tableName: string,
  documentsList: [],
  headerList: string[],
  keyValueList: string[],
  accessToken?: string
}

const FlowManagementTable: React.FC<FlowManagementPropsTypes> = ({ tableName, documentsList, headerList, keyValueList, accessToken }) => {
  
  const processExistingDocument = (documentData: any): void => {
    accessToken = 'Barear ' + accessToken;
    console.log('Send processExistingDocument with documentData: ', documentData, '\n And with accessToken: ', accessToken)
    fetch(`${process.env.REACT_APP_API_URL}/api/processexistingdocument?SessionId=dslf546khds$GgGfhsdfdfsd`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Barear ' + accessToken
      },
      body: JSON.stringify(documentData)
    })
    .then((res: any) => res.json())
    .then((data: any) => {
      console.log('processexistingdocument Success Data: ', data);
    })
    .catch(err => console.log(err))
  }
  
  return (
    <div className="tables">
      <h3>{tableName}</h3>
      <table id={tableName}>
        <thead>
          <tr>
            {headerList.map(header => <th key={header}>{header}</th>)}
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {
            documentsList ? documentsList.map((doc: any) => (
              <tr id={doc._id} key={doc._id}>
                {keyValueList.map(tdKeyValue => (
                  <td key={tdKeyValue}>
                    {eval(tdKeyValue) /** Bad eval! What's the alternative? */}
                  </td>
                ))}
                <td>
                  {accessToken ? <Link
                    to="/user-document"
                    onClick={() => processExistingDocument({
                      Owner: doc._metadata.owner,
                      DocumentInfo: {selection: {_id: doc._id}, collection: 'documents'}
                    })}
                  >
                    Go to document
                  </Link> : null}
                </td>
              </tr>
            )) : null
          }
        </tbody>
      </table>
    </div>
  )
}

export default FlowManagementTable;
