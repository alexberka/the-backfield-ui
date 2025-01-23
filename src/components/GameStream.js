import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PlaySegment from './PlaySegment';
import StatBar from './StatBar';
import GameStreamField from './GameStreamField';
import { GameStreamProvider } from '../utils/context/gameStreamContext.js';

export default function GameStream({ gameStream }) {
  const [expandedStats, setExpandedStats] = useState(false);

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
        <div className={`game-stream-drive-info ${expandedStats && 'gsdi-upper'}`} style={gameStream.nextPlay.teamId === gameStream.awayTeam.id ? { right: 0 } : { left: 0 }}>
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
      <GameStreamProvider gameStream={gameStream}>
        <GameStreamField drive slim={expandedStats} toGain ballOn />
        {gameStream.lastPlay !== null && (
          <div className="gs-last-play">
            <div className="gs-last-play-header">
              <p className="gs-last-play-text">Last Play:</p>
              {gameStream.lastPlay.down > 0 && (
                <>
                  <p className="gs-last-play-down">
                    {gameStream.lastPlay.down === 1 && '1st '}
                    {gameStream.lastPlay.down === 2 && '2nd '}
                    {gameStream.lastPlay.down === 3 && '3rd '}
                    {gameStream.lastPlay.down === 4 && '4th '}& {Math.abs(gameStream.lastPlay.toGain) === 50 ? 'Goal' : (gameStream.lastPlay.toGain - gameStream.lastPlay.fieldPositionStart) * (gameStream.lastPlay.teamId === gameStream.awayTeam.id ? -1 : 1)}
                  </p>
                  <p className="gs-last-play-field-position">on {fieldPositionToString(gameStream.lastPlay.fieldPositionStart)}</p>
                </>
              )}
            </div>
            <div className="play-segments-container">
              {gameStream.lastPlay.playSegments.map((ps) => (
                <PlaySegment key={ps.index} playSegment={ps} />
              ))}
            </div>
          </div>
        )}
      </GameStreamProvider>
      <StatBar homeTeamStats={gameStream.homeTeamPlayerStats} awayTeamStats={gameStream.awayTeamPlayerStats} lastPlay={gameStream.lastPlay}>
        {expandedStats && (
          <>
            <div className="sbtn-container sbtn-home">
              <div className="primary-color-bar" style={{ borderColor: gameStream.homeTeam.colorPrimaryHex }} />
              <div className="secondary-color-bar" style={{ borderColor: gameStream.homeTeam.colorSecondaryHex }} />
              <span className="stat-bar-team-name">
                {gameStream.homeTeam.locationName} <span className="sbtn-nick">{gameStream.homeTeam.nickname}</span>
              </span>
            </div>
            <div className="sbtn-container sbtn-away">
              <div className="primary-color-bar" style={{ borderColor: gameStream.awayTeam.colorPrimaryHex }} />
              <div className="secondary-color-bar" style={{ borderColor: gameStream.awayTeam.colorSecondaryHex }} />
              <span className="stat-bar-team-name">
                {gameStream.awayTeam.locationName} <span className="sbtn-nick">{gameStream.awayTeam.nickname}</span>
              </span>
            </div>
          </>
        )}
        <StatBar.Section title={expandedStats && 'Last Play'}>
          <StatBar.Column>
            <StatBar.Ticker teamStats={gameStream.homeTeamPlayerStats} lastPlay={gameStream.lastPlay} />
          </StatBar.Column>
          <StatBar.Column>
            <StatBar.Ticker teamStats={gameStream.awayTeamPlayerStats} lastPlay={gameStream.lastPlay} />
          </StatBar.Column>
        </StatBar.Section>
        <button type="button" className="sb-expand" onClick={() => setExpandedStats((prev) => !prev)}>
          {expandedStats ? 'Collapse Stats' : 'Expand Stats'}
        </button>
        {expandedStats && (
          <>
            <StatBar.Section title="Passing">
              <StatBar.Column>
                {gameStream.homeTeamPlayerStats
                  .filter((player) => player.passAttempts !== 0)
                  .sort((a, b) => b.passYards - a.passYards)
                  .map((player) => (
                    <StatBar.Passer player={player} key={player.id} />
                  ))}
              </StatBar.Column>
              <StatBar.Column>
                {gameStream.awayTeamPlayerStats
                  .filter((player) => player.passAttempts !== 0)
                  .sort((a, b) => b.passYards - a.passYards)
                  .map((player) => (
                    <StatBar.Passer player={player} key={player.id} />
                  ))}
              </StatBar.Column>
            </StatBar.Section>
            <StatBar.Section title="Receiving">
              <StatBar.Column>
                {gameStream.homeTeamPlayerStats
                  .filter((player) => player.receivingTargets !== 0 || player.receivingYards !== 0)
                  .sort((a, b) => b.receptions - a.receptions)
                  .sort((a, b) => b.receivingYards - a.receivingYards)
                  .map((player) => (
                    <StatBar.Receiver player={player} key={player.id} />
                  ))}
              </StatBar.Column>
              <StatBar.Column>
                {gameStream.awayTeamPlayerStats
                  .filter((player) => player.receivingTargets !== 0 || player.receivingYards !== 0)
                  .sort((a, b) => b.receptions - a.receptions)
                  .sort((a, b) => b.receivingYards - a.receivingYards)
                  .map((player) => (
                    <StatBar.Receiver player={player} key={player.id} />
                  ))}
              </StatBar.Column>
            </StatBar.Section>
            <StatBar.Section title="Rushing">
              <StatBar.Column>
                {gameStream.homeTeamPlayerStats
                  .filter((player) => player.rushAttempts !== 0 || player.rushYards !== 0)
                  .sort((a, b) => b.rushYards - a.rushYards)
                  .map((player) => (
                    <StatBar.Rusher player={player} key={player.id} />
                  ))}
              </StatBar.Column>
              <StatBar.Column>
                {gameStream.awayTeamPlayerStats
                  .filter((player) => player.rushAttempts !== 0 || player.rushYards !== 0)
                  .sort((a, b) => b.rushYards - a.rushYards)
                  .map((player) => (
                    <StatBar.Rusher player={player} key={player.id} />
                  ))}
              </StatBar.Column>
            </StatBar.Section>
            <StatBar.Section title="Kicking">
              <StatBar.Column>
                {gameStream.homeTeamPlayerStats
                  .filter((player) => player.fieldGoalAttempts !== 0 || player.extraPointAttempts !== 0)
                  .sort((a, b) => b.fieldGoalAttempts - a.fieldGoalAttempts)
                  .map((player) => (
                    <StatBar.Kicker player={player} key={player.id} />
                  ))}
              </StatBar.Column>
              <StatBar.Column>
                {gameStream.awayTeamPlayerStats
                  .filter((player) => player.fieldGoalAttempts !== 0 || player.extraPointAttempts !== 0)
                  .sort((a, b) => b.fieldGoalAttempts - a.fieldGoalAttempts)
                  .map((player) => (
                    <StatBar.Kicker player={player} key={player.id} />
                  ))}
              </StatBar.Column>
            </StatBar.Section>
            <StatBar.Section title="Punting">
              <StatBar.Column>
                {gameStream.homeTeamPlayerStats
                  .filter((player) => player.punts !== 0)
                  .sort((a, b) => b.punts - a.punts)
                  .map((player) => (
                    <StatBar.Punter player={player} key={player.id} />
                  ))}
              </StatBar.Column>
              <StatBar.Column>
                {gameStream.awayTeamPlayerStats
                  .filter((player) => player.punts !== 0)
                  .sort((a, b) => b.punts - a.punts)
                  .map((player) => (
                    <StatBar.Punter player={player} key={player.id} />
                  ))}
              </StatBar.Column>
            </StatBar.Section>
            <StatBar.Section title="Returns">
              <StatBar.Column>
                {gameStream.homeTeamPlayerStats
                  .filter((player) => player.kickoffReturns !== 0 || player.puntReturns !== 0)
                  .sort((a, b) => b.puntReturnYards - a.puntReturnYards)
                  .sort((a, b) => b.kickoffReturnYards - a.kickoffReturnYards)
                  .map((player) => (
                    <StatBar.Returner player={player} key={player.id} />
                  ))}
              </StatBar.Column>
              <StatBar.Column>
                {gameStream.awayTeamPlayerStats
                  .filter((player) => player.kickoffReturns !== 0 || player.puntReturns !== 0)
                  .sort((a, b) => b.puntReturns - a.puntReturns)
                  .sort((a, b) => b.kickoffReturns - a.kickoffReturns)
                  .map((player) => (
                    <StatBar.Returner player={player} key={player.id} />
                  ))}
              </StatBar.Column>
            </StatBar.Section>
            <StatBar.Section title="Defense" divider={false}>
              <StatBar.Column>
                {gameStream.homeTeamPlayerStats
                  .filter((player) => player.tackles !== 0 || player.sacks !== 0 || player.interceptionsReceived !== 0 || player.fumbleReturnTouchdowns !== 0)
                  .sort((a, b) => b.interceptionsReceived - a.interceptionsReceived)
                  .sort((a, b) => b.sacks - a.sacks)
                  .sort((a, b) => b.tackles - a.tackles)
                  .map((player) => (
                    <StatBar.Defender player={player} key={player.id} />
                  ))}
              </StatBar.Column>
              <StatBar.Column>
                {gameStream.awayTeamPlayerStats
                  .filter((player) => player.tackles !== 0 || player.sacks !== 0 || player.interceptionsReceived !== 0 || player.fumbleReturnTouchdowns !== 0)
                  .sort((a, b) => b.interceptionsReceived - a.interceptionsReceived)
                  .sort((a, b) => b.sacks - a.sacks)
                  .sort((a, b) => b.tackles - a.tackles)
                  .map((player) => (
                    <StatBar.Defender player={player} key={player.id} />
                  ))}
              </StatBar.Column>
            </StatBar.Section>
            <button type="button" className="sb-expand" onClick={() => setExpandedStats(false)}>
              Collapse Stats
            </button>
          </>
        )}
      </StatBar>
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
    homeTeamPlayerStats: PropTypes.shape,
    homeTeamScore: PropTypes.number,
    awayTeam: PropTypes.shape({
      id: PropTypes.number,
      locationName: PropTypes.string,
      nickname: PropTypes.string,
      colorPrimaryHex: PropTypes.string,
      colorSecondaryHex: PropTypes.string,
    }),
    awayTeamPlayerStats: PropTypes.shape,
    awayTeamScore: PropTypes.number,
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
