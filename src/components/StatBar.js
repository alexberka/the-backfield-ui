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
      <div className="stat-bar-section-content">{children}</div>
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
    <>
      {teamStats
        .filter((player) => player.playerId === lastPlay.passerId)
        .map((player) => (
          <StatBar.Passer key={player.playerId} player={player} />
        ))}
      {teamStats
        .filter((player) => player.playerId === lastPlay.receiverId)
        .map((player) => (
          <StatBar.Receiver key={player.playerId} player={player} />
        ))}
      {teamStats
        .filter((player) => player.playerId === lastPlay.rusherId)
        .map((player) => (
          <StatBar.Rusher key={player.playerId} player={player} />
        ))}
      {teamStats
        .filter((player) => player.playerId === lastPlay.kickerId)
        .map((player) => {
          if (lastPlay.punt) {
            return <StatBar.Punter key={player.playerId} player={player} />;
          }
          return <StatBar.Kicker key={player.playerId} player={player} />;
        })}
      {teamStats
        .filter((player) => player.playerId === lastPlay.kickReturnerId)
        .map((player) => (
          <StatBar.Returner key={player.playerId} player={player} />
        ))}
      {teamStats
        .filter((player) => lastPlay.tacklerIds.includes(player.playerId) || lastPlay.interceptedById === player.playerId)
        .map((player) => (
          <StatBar.Defender key={player.playerId} player={player} />
        ))}
      {teamStats
        .filter((player) => player.playerId === lastPlay.extraPointKickerId)
        .map((player) => (
          <StatBar.Kicker key={player.playerId} player={player} />
        ))}
    </>
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
  }).isRequired,
};

StatBar.Passer = function Passer({ player }) {
  return (
    <div className="sb-header-item">
      <span className="sbhi-player-name">
        {player.playerInfo.firstName[0]}. {player.playerInfo.lastName}
      </span>
      <span className="sbhi-stat wide">
        {player.passCompletions}
        <span style={{ color: 'greenyellow' }}>/</span>
        {player.passAttempts}
        <span className="sbhi-units">PASS</span>
      </span>
      <span className="sbhi-stat">
        {player.passYards}
        <span className="sbhi-units">YDS</span>
      </span>
      <span className="sbhi-stat thin">
        {player.passTouchdowns}
        <span className="sbhi-units">TD</span>
      </span>
      <span className="sbhi-stat thin">
        {player.interceptionsThrown}
        <span className="sbhi-units">INT</span>
      </span>
    </div>
  );
};

StatBar.Passer.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    passAttempts: PropTypes.number,
    passCompletions: PropTypes.number,
    passYards: PropTypes.number,
    passTouchdowns: PropTypes.number,
    interceptionsThrown: PropTypes.number,
  }).isRequired,
};

StatBar.Receiver = function Receiver({ player }) {
  return (
    <div className="sb-header-item">
      <span className="sbhi-player-name">
        {player.playerInfo.firstName[0]}. {player.playerInfo.lastName}
      </span>
      <span className="sbhi-stat wide">
        {player.receptions}
        <span style={{ color: 'greenyellow' }}>/</span>
        {player.receivingTargets}
        <span className="sbhi-units">REC</span>
      </span>
      <span className="sbhi-stat">
        {player.receivingYards}
        <span className="sbhi-units">YDS</span>
      </span>
      <span className="sbhi-stat thin">
        {player.receivingTouchdowns}
        <span className="sbhi-units">TD</span>
      </span>
    </div>
  );
};

StatBar.Receiver.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    receptions: PropTypes.number,
    receivingTargets: PropTypes.number,
    receivingYards: PropTypes.number,
    receivingTouchdowns: PropTypes.number,
  }).isRequired,
};

StatBar.Rusher = function Rusher({ player }) {
  return (
    <div className="sb-header-item">
      <span className="sbhi-player-name">
        {player.playerInfo.firstName[0]}. {player.playerInfo.lastName}
      </span>
      <span className="sbhi-stat">
        {player.rushAttempts}
        <span className="sbhi-units">RUSH</span>
      </span>
      <span className="sbhi-stat">
        {player.rushYards}
        <span className="sbhi-units">YDS</span>
      </span>
      <span className="sbhi-stat thin">
        {player.rushTouchdowns}
        <span className="sbhi-units">TD</span>
      </span>
    </div>
  );
};

StatBar.Rusher.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    rushAttempts: PropTypes.number,
    rushYards: PropTypes.number,
    rushTouchdowns: PropTypes.number,
  }).isRequired,
};

StatBar.Defender = function Defender({ player }) {
  return (
    <div className="sb-header-item">
      <span className="sbhi-player-name">
        {player.playerInfo.firstName[0]}. {player.playerInfo.lastName}
      </span>
      <span className="sbhi-stat">
        {player.tackles}
        <span className="sbhi-units">TCKL</span>
      </span>
      <span className="sbhi-stat">
        {player.sacks}
        <span className="sbhi-units">SACK</span>
      </span>
      <span className="sbhi-stat thin">
        {player.interceptionsReceived}
        <span className="sbhi-units">INT</span>
      </span>
      <span className="sbhi-stat thin">
        {player.interceptionReturnTouchdowns + player.fumbleReturnTouchdowns}
        <span className="sbhi-units">TD</span>
      </span>
    </div>
  );
};

StatBar.Defender.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    tackles: PropTypes.number,
    sacks: PropTypes.number,
    interceptionsReceived: PropTypes.number,
    interceptionReturnTouchdowns: PropTypes.number,
    fumbleReturnTouchdowns: PropTypes.number,
  }).isRequired,
};

StatBar.Kicker = function Kicker({ player }) {
  return (
    <div className="sb-header-item">
      <span className="sbhi-player-name">
        {player.playerInfo.firstName[0]}. {player.playerInfo.lastName}
      </span>
      <span className="sbhi-stat">
        {player.fieldGoalsMade}
        <span style={{ color: 'greenyellow' }}>/</span>
        {player.fieldGoalAttempts}
        <span className="sbhi-units">FG</span>
      </span>
      <span className="sbhi-stat">
        {player.extraPointsMade}
        <span style={{ color: 'greenyellow' }}>/</span>
        {player.extraPointAttempts}
        <span className="sbhi-units">XP</span>
      </span>
    </div>
  );
};

StatBar.Kicker.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    fieldGoalAttempts: PropTypes.number,
    fieldGoalsMade: PropTypes.number,
    extraPointAttempts: PropTypes.number,
    extraPointsMade: PropTypes.number,
  }).isRequired,
};

StatBar.Punter = function Punter({ player }) {
  return (
    <div className="sb-header-item">
      <span className="sbhi-player-name">
        {player.playerInfo.firstName[0]}. {player.playerInfo.lastName}
      </span>
      <span className="sbhi-stat">
        {player.punts}
        <span className="sbhi-units">PUNT</span>
      </span>
      <span className="sbhi-stat">
        {player.puntYards}
        <span className="sbhi-units">YDS</span>
      </span>
      <span className="sbhi-stat wide">
        {player.averagePuntYards.toFixed(1)}
        <span className="sbhi-units">AVG</span>
      </span>
    </div>
  );
};

StatBar.Punter.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    punts: PropTypes.number,
    puntYards: PropTypes.number,
    averagePuntYards: PropTypes.number,
  }).isRequired,
};

StatBar.Returner = function Returner({ player }) {
  return (
    <div className="sb-header-item">
      <span className="sbhi-player-name">
        {player.playerInfo.firstName[0]}. {player.playerInfo.lastName}
      </span>
      <span className="sbhi-stat wide">
        {player.puntReturns}
        <span className="sbhi-units">PUNT RET</span>
      </span>
      <span className="sbhi-stat">
        {player.puntReturnYards}
        <span className="sbhi-units">YDS</span>
      </span>
      <span className="sbhi-stat wide">
        {player.kickoffReturns}
        <span className="sbhi-units">KICK RET</span>
      </span>
      <span className="sbhi-stat">
        {player.kickoffReturnYards}
        <span className="sbhi-units">YDS</span>
      </span>
    </div>
  );
};

StatBar.Returner.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    kickoffReturns: PropTypes.number,
    kickoffReturnYards: PropTypes.number,
    puntReturns: PropTypes.number,
    puntReturnYards: PropTypes.number,
  }).isRequired,
};
