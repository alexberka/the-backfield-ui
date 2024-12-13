import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const createPlay = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${dbUrl}/plays`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((resp) => resp.json())
      .then(resolve)
      .catch(reject);
  });

const deletePlay = (playId, sessionKey) =>
  new Promise((resolve, reject) => {
    fetch(`${dbUrl}/plays/${playId}?sessionKey=${sessionKey}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => {
        if (resp.ok) {
          resolve(resp);
        } else {
          resolve(resp.json());
        }
      })
      .catch(reject);
  });

export default { createPlay, deletePlay };
