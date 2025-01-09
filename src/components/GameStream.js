import React from 'react';
import PropTypes from 'prop-types';

export default function GameStream({ gameStream }) {
  return (
    <div>
      <div className="gamestream-status-box">
        <h3 className="gssb-down">{gameStream.nextPlay.down}</h3>
        <div />
      </div>
      <div className="gamestream-field">
        <div className="gsf-to-gain" style={{ left: 300 - 1 + gameStream.nextPlay.toGain * 5 }} />
        <div className="gsf-drive" />
        <div className="gsf-yardline" />
        <div className="gsf-yardline" />
        <div className="gsf-yardline" />
        <div className="gsf-yardline" />
        <div className="gsf-yardline" />
        <div className="gsf-yardline" />
        <div className="gsf-yardline" />
        <div className="gsf-yardline" />
        <div className="gsf-yardline" />
        <div className="gsf-yardline" />
        <div className="gsf-yardline" />
        <div className="gsf-yardline" />
      </div>
    </div>
  );
}

GameStream.propTypes = {
  gameStream: PropTypes.shape({
    homeTeamScore: PropTypes.number,
    awayTeamScore: PropTypes.number,
    driveNumberOfPlays: PropTypes.number,
    currentPlay: PropTypes.shape({
      fieldPositionStart: PropTypes.number,
      fieldPositionEnd: PropTypes.number,
      down: PropTypes.number,
      toGain: PropTypes.number,
      clockStart: PropTypes.number,
      clockEnd: PropTypes.number,
      gamePeriod: PropTypes.number,
      notes: PropTypes.string,
      pass: PropTypes.shape({
        passer: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
          teamId: PropTypes.number,
        }),
        receiver: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
          teamId: PropTypes.number,
        }),
        completion: PropTypes.bool,
      }),
      rush: PropTypes.shape({
        rusher: PropTypes.shape({
          firstName: PropTypes.string,
          lastName: PropTypes.string,
          teamId: PropTypes.number,
        }),
      }),
    }),
    nextPlay: PropTypes.shape({
      fieldPositionStart: PropTypes.number,
      down: PropTypes.number,
      toGain: PropTypes.number,
      clockStart: PropTypes.number,
      gamePeriod: PropTypes.number,
    }),
  }).isRequired,
};
