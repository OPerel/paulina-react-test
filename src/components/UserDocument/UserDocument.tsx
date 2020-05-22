import React, { useState, useEffect } from 'react';
import { withAuth } from '@okta/okta-react';

type Props = {
  auth: any
}

const UserDocument: React.FC<Props> = ({ auth }) => {

  const [userDocument, setUserDocument] = useState<any>({});

  const getAccessToken = async (): Promise<string> => {
    return auth.getAccessToken()
      .then((token: string) => token)
  }

  useEffect(() => {
    const getUserCurrentContext = async (): Promise<void> => {
      const accessToken = 'Barear ' + await getAccessToken();
      console.log('Send get-user-current-context requset with accessToken: ', accessToken);
      fetch(`${process.env.REACT_APP_API_URL}/api/get-user-current-context?SessionId=dslf546khds$GgGfhsdfdfsd`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          authorization: accessToken
        }
      })
      .then(res => res.json())
      .then((documentData) => {
        console.log('get-user-current-context Success Data: ', documentData);
        setUserDocument(documentData);
      })
      .catch(err => console.log(err));
    }

    getUserCurrentContext();
  }, [])

  return (
    <div>
      <h3>User Document:</h3>
      <pre style={{ textAlign: 'left' }}>{JSON.stringify(userDocument, null, 2)}</pre>
    </div>
  )
};

export default withAuth(UserDocument);