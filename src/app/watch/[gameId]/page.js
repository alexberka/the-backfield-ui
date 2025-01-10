'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getGameStream } from '../../../api/gameData';
import GameStream from '../../../components/GameStream';
import Loading from '../../../components/Loading';

export default function WatchGameStream({ params }) {
  const { gameId } = params;
  const [gameStream, setGameStream] = useState({});

  const updateGameStream = () => {
    getGameStream(gameId).then(setGameStream);
  };

  useEffect(() => {
    updateGameStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!gameStream.nextPlay) {
    return <Loading />;
  }

  return <GameStream gameStream={gameStream} />;
}

WatchGameStream.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
