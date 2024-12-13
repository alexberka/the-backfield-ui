import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

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

export default getGameStream;
