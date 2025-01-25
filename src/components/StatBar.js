'use client';

import React from 'react';
import PropTypes from 'prop-types';

export default function StatBar({ children }) {
  return (
    <div className="stat-bar">
      <div className="stat-bar-interior-wrapper">{children}</div>
    </div>
  );
}

StatBar.propTypes = {
  children: PropTypes.node,
};

StatBar.Section = function Section({ title = '', divider = true, children }) {
  return (
    <div className="stat-bar-section">
      {title !== '' && <p className="stat-bar-section-title">{title}</p>}
      <div className="stat-bar-section-content">
        {children}
        <div className="stat-bar-vertical-divider" />
      </div>
      {divider && <hr className="stat-bar-section-divider" />}
    </div>
  );
};

StatBar.Section.propTypes = {
  title: PropTypes.string,
  divider: PropTypes.bool,
  children: PropTypes.node,
};

StatBar.Column = function Column({ children }) {
  return <div className="stat-bar-column">{children}</div>;
};

StatBar.Column.propTypes = {
  children: PropTypes.node,
};

StatBar.Ticker = function Ticker({ teamStats, lastPlay }) {
  return (
    <div>
      <div className="stat-bar-column ticker">
        {teamStats
          .filter((player) => player.playerId === lastPlay.passerId)
          .map((player) => (
            <StatBar.Passer key={player.playerId} player={player} />
          ))}
      </div>
      <div className="stat-bar-column ticker">
        {teamStats
          .filter((player) => player.playerId === lastPlay.receiverId)
          .map((player) => (
            <StatBar.Receiver key={player.playerId} player={player} />
          ))}
      </div>
      <div className="stat-bar-column ticker">
        {teamStats
          .filter((player) => player.playerId === lastPlay.rusherId)
          .map((player) => (
            <StatBar.Rusher key={player.playerId} player={player} />
          ))}
      </div>
      <div className="stat-bar-column ticker">
        {teamStats
          .filter((player) => player.playerId === lastPlay.kickerId)
          .map((player) => {
            if (lastPlay.punt) {
              return <StatBar.Punter key={player.playerId} player={player} />;
            }
            return <StatBar.Kicker key={player.playerId} player={player} />;
          })}
      </div>
      <div className="stat-bar-column ticker">
        {teamStats
          .filter((player) => player.playerId === lastPlay.kickReturnerId)
          .map((player) => (
            <StatBar.Returner key={player.playerId} player={player} />
          ))}
      </div>
      <div className="stat-bar-column ticker">
        {teamStats
          .filter((player) => lastPlay.tacklerIds.includes(player.playerId) || lastPlay.interceptedById === player.playerId)
          .map((player) => (
            <StatBar.Defender key={player.playerId} player={player} />
          ))}
      </div>
      <div className="stat-bar-column ticker">
        {teamStats
          .filter((player) => lastPlay.fumbles.some((f) => [f.fumbleCommittedById, f.fumbleForcedById, f.fumbleRecoveredById].includes(player.playerId)))
          .map((player) => (
            <StatBar.Fumble key={player.playerId} player={player} />
          ))}
      </div>
      <div className="stat-bar-column ticker">
        {teamStats
          .filter((player) => player.playerId === lastPlay.extraPointKickerId)
          .map((player) => (
            <StatBar.Kicker key={player.playerId} player={player} />
          ))}
      </div>
    </div>
  );
};

StatBar.Ticker.propTypes = {
  teamStats: PropTypes.arrayOf(
    PropTypes.shape({
      playerId: PropTypes.number,
    }),
  ).isRequired,
  lastPlay: PropTypes.shape({
    passerId: PropTypes.number,
    rusherId: PropTypes.number,
    receiverId: PropTypes.number,
    kickerId: PropTypes.number,
    punt: PropTypes.bool,
    kickReturnerId: PropTypes.number,
    tacklerIds: PropTypes.arrayOf(PropTypes.number),
    interceptedById: PropTypes.number,
    extraPointKickerId: PropTypes.number,
    fumbles: PropTypes.arrayOf(
      PropTypes.shape({
        fumbleCommittedById: PropTypes.number,
        fumbleForcedById: PropTypes.number,
        fumbleRecoveredById: PropTypes.number,
      }),
    ),
  }).isRequired,
};

StatBar.Passer = function Passer({ player }) {
  return (
    <>
      <StatBar.PlayerName playerInfo={player.playerInfo} />
      <span className="sbli-stat">
        {player.passCompletions}
        <span className="sbli-ratio-slash">/</span>
        {player.passAttempts}
        <span className="sbli-units">PASS</span>
      </span>
      <span className="sbli-stat">
        {player.passYards}
        <span className="sbli-units">YDS</span>
      </span>
      <span className="sbli-stat">
        {player.passTouchdowns}
        <span className="sbli-units">TD</span>
      </span>
      <span className="sbli-stat last">
        {player.interceptionsThrown}
        <span className="sbli-units">INT</span>
      </span>
      <div className="sbli-hr" />
    </>
  );
};

StatBar.Passer.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape,
    passAttempts: PropTypes.number,
    passCompletions: PropTypes.number,
    passYards: PropTypes.number,
    passTouchdowns: PropTypes.number,
    interceptionsThrown: PropTypes.number,
  }).isRequired,
};

StatBar.Receiver = function Receiver({ player }) {
  return (
    <>
      <StatBar.PlayerName playerInfo={player.playerInfo} />
      <span className="sbli-stat">
        {player.receptions}
        <span className="sbli-ratio-slash">/</span>
        {player.receivingTargets}
        <span className="sbli-units">REC</span>
      </span>
      <span className="sbli-stat">
        {player.receivingYards}
        <span className="sbli-units">YDS</span>
      </span>
      <span className="sbli-stat last">
        {player.receivingTouchdowns}
        <span className="sbli-units">TD</span>
      </span>
      <div className="sbli-hr" />
    </>
  );
};

StatBar.Receiver.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape,
    receptions: PropTypes.number,
    receivingTargets: PropTypes.number,
    receivingYards: PropTypes.number,
    receivingTouchdowns: PropTypes.number,
  }).isRequired,
};

StatBar.Rusher = function Rusher({ player }) {
  return (
    <>
      <StatBar.PlayerName playerInfo={player.playerInfo} />
      <span className="sbli-stat">
        {player.rushAttempts}
        <span className="sbli-units">RUSH</span>
      </span>
      <span className="sbli-stat">
        {player.rushYards}
        <span className="sbli-units">YDS</span>
      </span>
      <span className="sbli-stat last">
        {player.rushTouchdowns}
        <span className="sbli-units">TD</span>
      </span>
      <div className="sbli-hr" />
    </>
  );
};

StatBar.Rusher.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape,
    rushAttempts: PropTypes.number,
    rushYards: PropTypes.number,
    rushTouchdowns: PropTypes.number,
  }).isRequired,
};

StatBar.Defender = function Defender({ player }) {
  return (
    <>
      <StatBar.PlayerName playerInfo={player.playerInfo} />
      <span className="sbli-stat">
        {player.tackles}
        <span className="sbli-units">TCKL</span>
      </span>
      <span className="sbli-stat">
        {player.sacks}
        <span className="sbli-units">SACK</span>
      </span>
      <span className="sbli-stat">
        {player.interceptionsReceived}
        <span className="sbli-units">INT</span>
      </span>
      <span className="sbli-stat last">
        {player.interceptionReturnTouchdowns + player.fumbleReturnTouchdowns}
        <span className="sbli-units">TD</span>
      </span>
      <div className="sbli-hr" />
    </>
  );
};

StatBar.Defender.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape,
    tackles: PropTypes.number,
    sacks: PropTypes.number,
    interceptionsReceived: PropTypes.number,
    interceptionReturnTouchdowns: PropTypes.number,
    fumbleReturnTouchdowns: PropTypes.number,
  }).isRequired,
};

StatBar.Kicker = function Kicker({ player }) {
  return (
    <>
      <StatBar.PlayerName playerInfo={player.playerInfo} />
      <span className="sbli-stat">
        {player.fieldGoalsMade}
        <span className="sbli-ratio-slash">/</span>
        {player.fieldGoalAttempts}
        <span className="sbli-units">FG</span>
      </span>
      <span className="sbli-stat last">
        {player.extraPointsMade}
        <span className="sbli-ratio-slash">/</span>
        {player.extraPointAttempts}
        <span className="sbli-units">XP</span>
      </span>
      <div className="sbli-hr" />
    </>
  );
};

StatBar.Kicker.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape,
    fieldGoalAttempts: PropTypes.number,
    fieldGoalsMade: PropTypes.number,
    extraPointAttempts: PropTypes.number,
    extraPointsMade: PropTypes.number,
  }).isRequired,
};

StatBar.Punter = function Punter({ player }) {
  return (
    <>
      <StatBar.PlayerName playerInfo={player.playerInfo} />
      <span className="sbli-stat">
        {player.punts}
        <span className="sbli-units">PUNT</span>
      </span>
      <span className="sbli-stat">
        {player.puntYards}
        <span className="sbli-units">YDS</span>
      </span>
      <span className="sbli-stat last">
        {player.averagePuntYards.toFixed(1)}
        <span className="sbli-units">AVG</span>
      </span>
      <div className="sbli-hr" />
    </>
  );
};

StatBar.Punter.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape,
    punts: PropTypes.number,
    puntYards: PropTypes.number,
    averagePuntYards: PropTypes.number,
  }).isRequired,
};

StatBar.Returner = function Returner({ player }) {
  return (
    <>
      <StatBar.PlayerName playerInfo={player.playerInfo} />
      <span className="sbli-stat">
        {player.puntReturns}
        <span className="sbli-units">PUNT RET</span>
      </span>
      <span className="sbli-stat">
        {player.puntReturnYards}
        <span className="sbli-units">YDS</span>
      </span>
      <span className="sbli-stat">
        {player.kickoffReturns}
        <span className="sbli-units">KICK RET</span>
      </span>
      <span className="sbli-stat last">
        {player.kickoffReturnYards}
        <span className="sbli-units">YDS</span>
      </span>
      <div className="sbli-hr" />
    </>
  );
};

StatBar.Returner.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape,
    kickoffReturns: PropTypes.number,
    kickoffReturnYards: PropTypes.number,
    puntReturns: PropTypes.number,
    puntReturnYards: PropTypes.number,
  }).isRequired,
};

StatBar.Fumble = function Fumble({ player }) {
  return (
    <>
      <StatBar.PlayerName playerInfo={player.playerInfo} />
      <span className="sbli-stat">
        {player.fumblesCommitted}
        <span className="sbli-units">FUM</span>
      </span>
      <span className="sbli-stat">
        {player.fumblesForced}
        <span className="sbli-units">FF</span>
      </span>
      <span className="sbli-stat last">
        {player.fumblesRecovered}
        <span className="sbli-units">FR</span>
      </span>
      <div className="sbli-hr" />
    </>
  );
};

StatBar.Fumble.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape,
    fumblesCommitted: PropTypes.number,
    fumblesForced: PropTypes.number,
    fumblesRecovered: PropTypes.number,
  }).isRequired,
};

StatBar.PlayerName = function PlayerName({ playerInfo }) {
  return (
    <span className="sbli-player-name">
      {playerInfo.firstName[0]}. {playerInfo.lastName}
      {playerInfo.jerseyNumber >= 0 && <span className="sbli-player-number">#{playerInfo.jerseyNumber}</span>}
    </span>
  );
};

StatBar.PlayerName.propTypes = {
  playerInfo: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    jerseyNumber: PropTypes.number,
  }).isRequired,
};
