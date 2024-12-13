import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const getSingleTeam = (teamId, sessionKey) =>
  new Promise((resolve, reject) => {
    fetch(`${dbUrl}/teams/${teamId}?sessionKey=${sessionKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then(resolve)
      .catch(reject);
  });

export default getSingleTeam;
