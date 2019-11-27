import React from 'react';

import './FlowManagementTable.css';

type FlowManagementPropsTypes = {
  tableName: string,
  documentsList: [],
  headerList: string[],
  keyValueList: string[]
}

const FlowManagementTable: React.FC<FlowManagementPropsTypes> = ({ tableName, documentsList, headerList, keyValueList }) => {
  return (
    <div className="tables">
      <h3>{tableName}</h3>
      <table>
        <thead>
          <tr>
            {headerList.map(header => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {
            documentsList ? documentsList.map((doc: any) => (
              <tr id={doc._id} key={doc._id}>
                {keyValueList.map(tdKey => <td key={tdKey}>{eval(tdKey)}</td>)}
                {/** Bad eval! What's the alternative? */} 
              </tr>
            )) : null
          }
        </tbody>
      </table>
    </div>
  )
}

export default FlowManagementTable;