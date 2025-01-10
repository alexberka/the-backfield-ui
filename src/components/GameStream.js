import React from 'react';
import PropTypes from 'prop-types';
import PlaySegment from './PlaySegment';

export default function GameStream({ gameStream }) {
  const fieldPositionToString = (fpAsInt) => {
    if (fpAsInt == null) {
      return '';
    }
    let asText = '';

    if (fpAsInt > 0) {
      asText += `${gameStream.awayTeam.locationName || gameStream.awayTeam.nickname} `;
    } else if (fpAsInt < 0) {
      asText += `${gameStream.homeTeam.locationName || gameStream.homeTeam.nickname} `;
    }
    const fieldNumber = 50 - Math.abs(fpAsInt);
    if (fieldNumber <= 0) {
      asText += 'Endzone';
    } else {
      asText += `${fieldNumber}`;
    }

    return asText;
  };

  const driveFillColor = (edge) => {
    let color = '';
    const defaultPrimary = '#a1a1a1';
    const defaultSecondary = '#d1d1d1';
    switch (edge) {
      case 'top':
        color = gameStream.nextPlay.teamId === gameStream.homeTeam.id ? gameStream.homeTeam.colorPrimaryHex : gameStream.awayTeam.colorPrimaryHex;
        if (color === '') {
          color = defaultPrimary;
        }
        break;
      case 'left':
        if (gameStream.nextPlay.teamId === gameStream.homeTeam.id) {
          color = gameStream.homeTeam.colorSecondaryHex !== '' ? gameStream.homeTeam.colorSecondaryHex : defaultSecondary;
        } else {
          color = gameStream.awayTeam.colorPrimaryHex !== '' ? gameStream.awayTeam.colorPrimaryHex : defaultPrimary;
        }
        break;
      case 'right':
        if (gameStream.nextPlay.teamId === gameStream.homeTeam.id) {
          color = gameStream.homeTeam.colorPrimaryHex !== '' ? gameStream.homeTeam.colorPrimaryHex : defaultPrimary;
        } else {
          color = gameStream.awayTeam.colorSecondaryHex !== '' ? gameStream.awayTeam.colorSecondaryHex : defaultSecondary;
        }
        break;
      case 'bottom':
        color = gameStream.nextPlay.teamId === gameStream.homeTeam.id ? gameStream.homeTeam.colorSecondaryHex : gameStream.awayTeam.colorSecondaryHex;
        if (color === '') {
          color = defaultSecondary;
        }
        break;
      default:
        break;
    }
    return color !== '' ? color : '#a1a1a1';
  };

  return (
    <div className="game-stream">
      <div className="game-stream-status">
        <div className="gs-status-home-name">
          <h1 className="name-loc">{gameStream.homeTeam.locationName}</h1>
          <h1 className="name-nick">{gameStream.homeTeam.nickname}</h1>
          <hr className="primary-color-bar" style={{ color: gameStream.homeTeam.colorPrimaryHex }} />
          <hr className="secondary-color-bar" style={{ color: gameStream.homeTeam.colorSecondaryHex }} />
          <div className="gs-status-home-score">{gameStream.homeTeamScore}</div>
        </div>
        <div className="gs-status-home-poss">{gameStream.nextPlay.teamId === gameStream.homeTeam.id && <h2>●</h2>}</div>
        <div className="gs-status-info">
          <p className="gssi-clock">
            Q{gameStream.nextPlay.gamePeriod}
            &emsp;
            {Math.floor(gameStream.nextPlay.clockStart / 60)}:{(gameStream.nextPlay.clockStart % 60).toString().padStart(2, '0')}
          </p>
          <p className="gssi-ball-on">Ball on</p>
          <p className="gssi-field-position">{fieldPositionToString(gameStream.nextPlay.fieldPositionStart)}</p>
          {gameStream.nextPlay.down > 0 && (
            <p className="gssi-down">
              {gameStream.nextPlay.down === 1 && '1st '}
              {gameStream.nextPlay.down === 2 && '2nd '}
              {gameStream.nextPlay.down === 3 && '3rd '}
              {gameStream.nextPlay.down === 4 && '4th '}& {Math.abs(gameStream.nextPlay.toGain) === 50 ? 'Goal' : (gameStream.nextPlay.toGain - gameStream.nextPlay.fieldPositionStart) * (gameStream.nextPlay.teamId === gameStream.awayTeam.id ? -1 : 1)}
            </p>
          )}
        </div>
        <div className="gs-status-away-poss">{gameStream.nextPlay.teamId === gameStream.awayTeam.id && <h2>●</h2>}</div>
        <div className="gs-status-away-name">
          <div className="gs-status-away-score">{gameStream.awayTeamScore}</div>
          <h1 className="name-loc">{gameStream.awayTeam.locationName}</h1>
          <h1 className="name-nick">{gameStream.awayTeam.nickname}</h1>
          <hr className="primary-color-bar" style={{ color: gameStream.awayTeam.colorPrimaryHex }} />
          <hr className="secondary-color-bar" style={{ color: gameStream.awayTeam.colorSecondaryHex }} />
        </div>
      </div>
      <div className="gs-drive-info-topline">
        <div className="game-stream-drive-info" style={gameStream.nextPlay.teamId === gameStream.awayTeam.id ? { right: 0 } : { left: 0 }}>
          <h4 className="game-stream-current-drive-header">Current Drive</h4>
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
      <div className="gamestream-field">
        <div className="gsf-to-gain" style={{ left: 300 - 1 + gameStream.nextPlay.toGain * 5 }} />
        <div
          className="gsf-drive"
          style={{
            left: 300 - 1 + (gameStream.nextPlay.teamId === gameStream.homeTeam.id ? gameStream.drivePositionStart : gameStream.drivePositionStart - gameStream.driveYards) * 5,
            width: gameStream.driveYards * 5,
            borderTop: `132px solid ${driveFillColor('top')}`,
            borderRight: `${(gameStream.driveYards / 2) * 5}px solid ${driveFillColor('right')}`,
            borderBottom: `132px solid ${driveFillColor('bottom')}`,
            borderLeft: `${(gameStream.driveYards / 2) * 5 + 1}px solid ${driveFillColor('left')}`,
          }}
        />
        <div
          className="gsf-home-team-endzone"
          style={{
            background: `linear-gradient(${gameStream.homeTeam.colorPrimaryHex} 25%, ${gameStream.homeTeam.colorSecondaryHex} 75%)`,
          }}
        >
          <p>{gameStream.homeTeam.nickname}</p>
        </div>
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
        <div
          className="gsf-away-team-endzone"
          style={{
            background: `linear-gradient(${gameStream.awayTeam.colorPrimaryHex} 25%, ${gameStream.awayTeam.colorSecondaryHex} 75%)`,
          }}
        >
          <p>{gameStream.awayTeam.nickname}</p>
        </div>
      </div>
      <div className="gs-last-play">
        <div className="gs-last-play-header">
          <p className="gs-last-play-text">Last Play:</p>
          {gameStream.lastPlay.down > 0 && (
            <p className="gs-last-play-down">
              {gameStream.lastPlay.down === 1 && '1st '}
              {gameStream.lastPlay.down === 2 && '2nd '}
              {gameStream.lastPlay.down === 3 && '3rd '}
              {gameStream.lastPlay.down === 4 && '4th '}& {Math.abs(gameStream.lastPlay.toGain) === 50 ? 'Goal' : (gameStream.lastPlay.toGain - gameStream.lastPlay.fieldPositionStart) * (gameStream.lastPlay.teamId === gameStream.awayTeam.id ? -1 : 1)}
            </p>
          )}
          <p className="gs-last-play-field-position">on {fieldPositionToString(gameStream.lastPlay.fieldPositionStart)}</p>
        </div>
        <div className="play-segments-container">
          {gameStream.lastPlay.playSegments.map((ps) => (
            <PlaySegment key={ps.index} playSegment={ps} />
          ))}
        </div>
      </div>
    </div>
  );
}

GameStream.propTypes = {
  gameStream: PropTypes.shape({
    homeTeam: PropTypes.shape({
      id: PropTypes.number,
      locationName: PropTypes.string,
      nickname: PropTypes.string,
      homeField: PropTypes.string,
      homeLocation: PropTypes.string,
      colorPrimaryHex: PropTypes.string,
      colorSecondaryHex: PropTypes.string,
    }),
    homeTeamScore: PropTypes.number,
    awayTeamScore: PropTypes.number,
    awayTeam: PropTypes.shape({
      id: PropTypes.number,
      locationName: PropTypes.string,
      nickname: PropTypes.string,
      colorPrimaryHex: PropTypes.string,
      colorSecondaryHex: PropTypes.string,
    }),
    drivePlays: PropTypes.number,
    drivePositionStart: PropTypes.number,
    driveYards: PropTypes.number,
    driveTime: PropTypes.number,
    lastPlay: PropTypes.shape({
      teamId: PropTypes.number,
      fieldPositionStart: PropTypes.number,
      fieldPositionEnd: PropTypes.number,
      down: PropTypes.number,
      toGain: PropTypes.number,
      clockStart: PropTypes.number,
      clockEnd: PropTypes.number,
      gamePeriod: PropTypes.number,
      notes: PropTypes.string,
      playSegments: PropTypes.arrayOf(
        PropTypes.shape({
          index: PropTypes.number,
          fieldStart: PropTypes.number,
          fieldEnd: PropTypes.number,
          teamId: PropTypes.number,
          segmentText: PropTypes.string,
          lineType: PropTypes.string,
          endpointType: PropTypes.string,
        }),
      ),
    }),
    nextPlay: PropTypes.shape({
      teamId: PropTypes.number,
      fieldPositionStart: PropTypes.number,
      down: PropTypes.number,
      toGain: PropTypes.number,
      clockStart: PropTypes.number,
      gamePeriod: PropTypes.number,
    }),
  }).isRequired,
};
