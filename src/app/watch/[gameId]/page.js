'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getGameStream } from '../../../api/gameData';
import GameStream from '../../../components/GameStream';

export default function WatchGameStream({ params }) {
  const { gameId } = params;
  const [gameStream, setGameStream] = useState({});

  const updateGameStream = () => {
    getGameStream(gameId).then(setGameStream);
  };

  useEffect(() => {
    updateGameStream();
  }, [updateGameStream]);

  if (!gameStream.nextPlay) {
    return <div>Loading...</div>;
  }

  return <GameStream gameStream={gameStream} />;
}

WatchGameStream.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
