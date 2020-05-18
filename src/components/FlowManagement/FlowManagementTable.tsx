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
  
  const processProgressContext = (documentData: any): void => {
    accessToken = 'Barear ' + accessToken;
    console.log('Send process-progress-context with documentData: ', documentData, '\n And with accessToken: ', accessToken)
    fetch(`${process.env.REACT_APP_API_URL}/api/process-progress-context?SessionId=dslf546khds$GgGfhsdfdfsd`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        authorization: accessToken
      },
      body: JSON.stringify(documentData)
    })
    .then((res: any) => res.json())
    .then((data: any) => {
      console.log('process-progress-context Success Data: ', data);
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
                {keyValueList.map((tdKeyValue) => (
                    <td key={tdKeyValue}>
                      {typeof eval(tdKeyValue) === 'string' ? eval(tdKeyValue) : JSON.stringify(eval(tdKeyValue)) /** Bad eval! What's the alternative? */}
                    </td>
                ))}
                <td>
                  {accessToken ?
                    <Link
                      to="/user-document"
                      onClick={() => processProgressContext({ _id: doc._id })}
                    >Go to document</Link>
                  : null}
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
