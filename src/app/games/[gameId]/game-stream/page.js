/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlayForm from '../../../../components/forms/PlayForm';
import { getGameStream } from '../../../../api/gameData';

export default function ManageGameStream({ params }) {
  const { gameId } = params;
  const [gameStream, setGameStream] = useState({});

  const updateGameStream = () => {
    getGameStream(gameId).then(setGameStream);
  };

  useEffect(() => {
    updateGameStream();
  }, []);

  if (!gameStream.nextPlay) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {gameStream.homeTeamScore !== undefined && (
        <div className="game-stream">
          <div className="game-stream-scores">
            <h1>
              {gameStream.homeTeam.locationName}&emsp;{gameStream.homeTeamScore}
            </h1>
            {gameStream.nextPlay.teamId != null && <h2 className={`gs-has-ball-${gameStream.nextPlay.teamId === gameStream.homeTeam.id ? 'home' : 'away'}`}>●</h2>}
            <h1>
              {gameStream.awayTeamScore}&emsp;{gameStream.awayTeam.locationName}
            </h1>
          </div>
          <div className="game-stream-drive-info">
            <h4>Current Drive</h4>
            <p>
              {gameStream.drivePlays} Play{gameStream.drivePlays !== 1 && 's'}
            </p>
            <p>
              {gameStream.driveYards} Yard{gameStream.driveYards !== 1 && 's'}
            </p>
            <p>
              {Math.floor(gameStream.driveTime / 60)}:{(gameStream.driveTime % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      )}
      <PlayForm gameId={parseInt(gameId, 10)} onUpdate={updateGameStream} playEdit={gameStream?.nextPlay} homeTeam={gameStream?.homeTeam} awayTeam={gameStream?.awayTeam} />
    </>
  );
}

ManageGameStream.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
