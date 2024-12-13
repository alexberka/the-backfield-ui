import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const getUserByUID = (uid) =>
  new Promise((resolve, reject) => {
    fetch(`${dbUrl}/users/${uid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then(resolve)
      .catch(reject);
  });

const createUser = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${dbUrl}/users`, {
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

export { getUserByUID, createUser };
