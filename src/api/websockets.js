import { HubConnectionBuilder } from '@microsoft/signalr';
import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const connectToGamestream = (gameId) => {
  const connection = new HubConnectionBuilder().withUrl(`${dbUrl}/watch?gameId=${gameId}`).withAutomaticReconnect().build();

  let response = 2;
  connection.start();
  connection.on('SayHello', (data) => {
    response = data;
    console.warn(data, 'sockets');
  });
  return response;
};

export default connectToGamestream;
