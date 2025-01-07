import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const getUserGames = (sessionKey) =>
  new Promise((resolve, reject) => {
    fetch(`${dbUrl}/games?sessionKey=${sessionKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then((data) => resolve(data ? Object.values(data) : []))
      .catch(reject);
  });

const getGameStream = (gameId) =>
  new Promise((resolve, reject) => {
    fetch(`${dbUrl}/games/${gameId}/game-stream`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((resp) => resp.json())
      .then(resolve)
      .catch(reject);
  });

export { getUserGames, getGameStream };
