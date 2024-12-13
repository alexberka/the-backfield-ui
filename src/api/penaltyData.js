import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const getAllPenalties = (sessionKey) =>
  new Promise((resolve, reject) => {
    fetch(`${dbUrl}/penalties?sessionKey=${sessionKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) => resolve(data ? Object.values(data) : []))
      .catch(reject);
  });

export default getAllPenalties;
