import React from 'react';
import PropTypes from 'prop-types';
import { useGameStream } from '../utils/context/gameStreamContext.js';

export default function GameStreamField({ children, slim = false, drive = false, toGain = false, ballOn = false }) {
  const gameStream = useGameStream();

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
    <div className={`gamestream-field ${slim && 'gsf-slim'}`}>
      {gameStream.nextPlay.down > 0 && toGain && <div className="gsf-to-gain" style={{ left: 300 + gameStream.nextPlay.toGain * 5 }} />}
      {ballOn && (
        <div
          className="gsf-ball-on"
          style={{
            left: 300 + gameStream.nextPlay.fieldPositionStart * 5,
          }}
        />
      )}
      {drive && (
        <div
          className="gsf-drive"
          style={{
            left: 300 + (gameStream.nextPlay.teamId === gameStream.homeTeam.id ? gameStream.drivePositionStart : gameStream.drivePositionStart - gameStream.driveYards) * 5,
            width: Math.max(gameStream.driveYards, 0) * 5,
            borderTop: `${slim ? 19 : 132}px solid ${driveFillColor('top')}`,
            borderRight: `${(Math.max(gameStream.driveYards, 0) / 2) * 5}px solid ${driveFillColor('right')}`,
            borderBottom: `${slim ? 19 : 132}px solid ${driveFillColor('bottom')}`,
            borderLeft: `${(Math.max(gameStream.driveYards, 0) / 2) * 5}px solid ${driveFillColor('left')}`,
          }}
        />
      )}
      <div
        className="gsf-home-team-endzone"
        style={{
          background: `linear-gradient(${gameStream.homeTeam.colorPrimaryHex} 25%, ${gameStream.homeTeam.colorSecondaryHex} 75%)`,
        }}
      >
        {!slim && <p>{gameStream.homeTeam.nickname}</p>}
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
      <div
        className="gsf-away-team-endzone"
        style={{
          background: `linear-gradient(${gameStream.awayTeam.colorPrimaryHex} 25%, ${gameStream.awayTeam.colorSecondaryHex} 75%)`,
        }}
      >
        {!slim && <p>{gameStream.awayTeam.nickname}</p>}
      </div>
      {children}
    </div>
  );
}

GameStreamField.propTypes = {
  children: PropTypes.node,
  slim: PropTypes.bool,
  drive: PropTypes.bool,
  toGain: PropTypes.bool,
  ballOn: PropTypes.bool,
};
