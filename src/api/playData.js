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
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return resp;
      })
      .then(resolve)
      .catch(reject);
  });

const updatePlay = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${dbUrl}/plays/${payload.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }
        return resp;
      })
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

export { createPlay, updatePlay, deletePlay };
