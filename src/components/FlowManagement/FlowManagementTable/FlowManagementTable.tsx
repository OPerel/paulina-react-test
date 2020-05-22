import React from 'react';
import { Link } from 'react-router-dom';

import './FlowManagementTable.css';

type Props = {
  tableName: string,
  documentsList: [],
  headerList: string[],
  keyValueList: string[],
  accessToken?: string
}

const FlowManagementTable: React.FC<Props> = ({ tableName, documentsList, headerList, keyValueList, accessToken }) => {
  
  const processExistingDocument = (documentData: any): void => {
    accessToken = 'Barear ' + accessToken;
    console.log('Send process-existing-document with documentData: ', documentData, '\n And with accessToken: ', accessToken)
    fetch(`${process.env.REACT_APP_API_URL}/api/process-existing-document?SessionId=dslf546khds$GgGfhsdfdfsd`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(documentData)
    })
    .then((res: any) => res.json())
    .then((data: any) => {
      console.log('process-existing-document Success Data: ', data);
    })
    .catch(err => console.warn('process-existing-document error: ', err))
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
            documentsList && documentsList.map((doc: any) => {
              const owner = doc._metadata?.owner;
              const data = {
                Owner: owner,
                DocumentInfo: {selection: {_id: doc._id}, collection: 'documents'}
              };
              return (
                <tr id={doc._id} key={doc._id}>
                  {keyValueList.map((tdKeyValue) => (
                      <td key={tdKeyValue}>
                        {typeof eval(tdKeyValue) === 'string' ? eval(tdKeyValue) : JSON.stringify(eval(tdKeyValue)) /** Bad eval! What's the alternative? */}
                      </td>
                  ))}
                  <td>
                    {accessToken ?
                      <Link
                        to="/user-document"
                        onClick={() => processExistingDocument(data)}
                      >Go to document</Link>
                    : null}
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default FlowManagementTable;
