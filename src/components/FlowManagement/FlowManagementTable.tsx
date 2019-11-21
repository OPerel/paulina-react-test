import React from 'react';

import './FlowManagementTable.css';

type FlowManagementPropsTypes = {
  tableName: string,
  documentList: []
}

const FlowManagementTable: React.FC<FlowManagementPropsTypes> = ({ tableName, documentList }) => {
  return (
    <div style={{ margin: '0 2%', textAlign: 'left' }}>
      <h3>{tableName}</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Doc ID</th>
          </tr>
        </thead>
        <tbody>
          {
            documentList ? documentList.map((doc: any) => (
              <tr id={doc._id} key={doc._id}>
                <td>{doc.name}</td>
                <td>{doc._id}</td>
              </tr>
            )) : null
          }
        </tbody>
      </table>
    </div>
  )
}

export default FlowManagementTable;