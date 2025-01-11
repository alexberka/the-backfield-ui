'use client';

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { getGameStream } from '../../../api/gameData';
import GameStream from '../../../components/GameStream';
import Loading from '../../../components/Loading';
import { clientCredentials } from '../../../utils/client';

export default function WatchGameStream({ params }) {
  const { gameId } = params;
  const [connection, setConnection] = useState(null);
  const connected = useRef(false);
  const [gameStream, setGameStream] = useState({});

  const updateGameStream = () => {
    getGameStream(gameId).then(setGameStream);
  };

  useEffect(() => {
    updateGameStream();
    // Only connect once
    if (!connected.current) {
      const newConnection = new HubConnectionBuilder().withUrl(`${clientCredentials.databaseURL}/watch?gameId=${gameId}`).withAutomaticReconnect().build();
      newConnection.start();
      newConnection.on('SayHello', () => setConnection(newConnection.connectionId));
      newConnection.on('UpdateGameStream', (data) => setGameStream(data));
      newConnection.onreconnecting(() => setConnection(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!gameStream.nextPlay) {
    return <Loading />;
  }

  return (
    <>
      {connection == null && <p>Attempting to establish connection...</p>}
      <GameStream gameStream={gameStream} />;
    </>
  );
}

WatchGameStream.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
