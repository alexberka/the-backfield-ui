/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlayForm from '../../../../components/forms/PlayForm';
import { getGameStream } from '../../../../api/gameData';
import GameStream from '../../../../components/GameStream';
import Loading from '../../../../components/Loading';
import { useAuth } from '../../../../utils/context/authContext';
import { deletePlay } from '../../../../api/playData';
import DeletePlayModal from '../../../../components/modals/DeletePlayModal';

export default function ManageGameStream({ params }) {
  const { gameId } = params;
  const [gameStream, setGameStream] = useState({});
  const [formStatus, setFormStatus] = useState('');
  const [checkDelete, setCheckDelete] = useState(false);
  const { user } = useAuth();

  const updateGameStream = () => {
    getGameStream(gameId).then(setGameStream);
  };

  const hideForm = (method = '') => {
    if (method === 'submit') {
      updateGameStream();
    }
    setFormStatus('');
  };

  const handlePlayDelete = () => {
    deletePlay(gameStream.lastPlay.id, user.sessionKey).then(() => {
      updateGameStream();
    });
  };

  const hideModal = (confirmDelete) => {
    if (confirmDelete === 'confirm') {
      handlePlayDelete();
    }
    setCheckDelete(false);
  };

  useEffect(() => {
    updateGameStream();
  }, []);

  if (!gameStream.nextPlay) {
    return <Loading />;
  }

  return (
    <>
      {gameStream.homeTeamScore !== undefined && <GameStream gameStream={gameStream} />}
      {formStatus === '' && (
        <div className="playform">
          <div className="pf-buttons">
            <button className="button" type="button" onClick={() => setFormStatus('new')}>
              Next Play
            </button>
            <button className="button" type="button" onClick={() => setFormStatus('edit')}>
              Edit Last Play
            </button>
            <button className="button button-red" type="button" onClick={() => setCheckDelete(true)} disabled={!gameStream.lastPlay.id > 0}>
              Delete Last Play
            </button>
            {checkDelete && <DeletePlayModal onClose={hideModal} />}
          </div>
        </div>
      )}
      <PlayForm key={0} gameId={parseInt(gameId, 10)} onUpdate={hideForm} playEdit={gameStream?.nextPlay} homeTeam={gameStream?.homeTeam} awayTeam={gameStream?.awayTeam} visible={formStatus === 'new'} />
      <PlayForm key={gameStream?.lastPlay.id} gameId={parseInt(gameId, 10)} onUpdate={hideForm} playEdit={gameStream?.lastPlay} homeTeam={gameStream?.homeTeam} awayTeam={gameStream?.awayTeam} visible={formStatus === 'edit'} />
    </>
  );
}

ManageGameStream.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
