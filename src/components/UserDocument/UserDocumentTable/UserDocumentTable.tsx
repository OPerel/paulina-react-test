import React, { useEffect, useRef } from 'react';

import 'henriettastencilcomponents';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'user-document-table': any
    }
  }
}

const UserDocumentTable: React.FC<{ userDocument: any }> = ({ userDocument }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    (elementRef.current as any)!.userDocument = userDocument;
  }, [userDocument]);

  return (
    <user-document-table userDocument={userDocument} ref={elementRef}></user-document-table>
  );
};

export default UserDocumentTable;