/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlayForm from '../../../../components/forms/PlayForm';
import getGameStream from '../../../../api/gameData';

export default function ManageGameStream({ params }) {
  const { gameId } = params;
  const [gameStream, setGameStream] = useState({});

  const updateGameStream = () => {
    getGameStream(gameId).then(setGameStream);
  };

  useEffect(() => {
    updateGameStream();
  }, []);

  return <PlayForm gameId={parseInt(gameId, 10)} onUpdate={updateGameStream} playEdit={gameStream?.nextPlay} homeTeam={gameStream?.homeTeam} awayTeam={gameStream?.awayTeam} />;
}

ManageGameStream.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
