'use client';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FullStatsModal from './modals/FullStatsModal';
import Stat from './Stat';

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

StatBar.PlayerName = function PlayerName({ player, onClick = null }) {
  const handleClick = () => {
    if (onClick !== null) {
      onClick();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onClick !== null) {
      onClick();
    }
  };

  return (
    <div role="button" className="sbli-player-name" onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={0}>
      {player.playerInfo.firstName[0]}. {player.playerInfo.lastName}
      {player.playerInfo.jerseyNumber >= 0 && <span className="sbli-player-number">#{player.playerInfo.jerseyNumber}</span>}
    </div>
  );
};

StatBar.PlayerName.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      jerseyNumber: PropTypes.number,
    }).isRequired,
  }),
  onClick: PropTypes.func,
};

StatBar.PlayerDivider = function PlayerDivider() {
  return <div className="sbli-hr" />;
};

StatBar.Passer = function Passer({ player }) {
  const [viewPlayerStats, setViewPlayerStats] = useState(false);

  return (
    <>
      {viewPlayerStats && <FullStatsModal player={player} onClose={() => setViewPlayerStats(false)} />}
      <StatBar.PlayerName player={player} onClick={() => setViewPlayerStats(true)} />
      <Stat stat={player.passCompletions} denominator={player.passAttempts} units="pass" />
      <Stat stat={player.passYards} units="yds" />
      <Stat stat={player.passTouchdowns} units="td" />
      <Stat stat={player.interceptionsThrown} units="int" last />
      <StatBar.PlayerDivider />
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
  const [viewPlayerStats, setViewPlayerStats] = useState(false);

  return (
    <>
      {viewPlayerStats && <FullStatsModal player={player} onClose={() => setViewPlayerStats(false)} />}
      <StatBar.PlayerName player={player} onClick={() => setViewPlayerStats(true)} />
      <Stat stat={player.receptions} denominator={player.receivingTargets} units="rec" />
      <Stat stat={player.receivingYards} units="yds" />
      <Stat stat={player.receivingTouchdowns} units="td" last />
      <StatBar.PlayerDivider />
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
  const [viewPlayerStats, setViewPlayerStats] = useState(false);

  return (
    <>
      {viewPlayerStats && <FullStatsModal player={player} onClose={() => setViewPlayerStats(false)} />}
      <StatBar.PlayerName player={player} onClick={() => setViewPlayerStats(true)} />
      <Stat stat={player.rushAttempts} units="rush" />
      <Stat stat={player.rushYards} units="yds" />
      <Stat stat={player.rushTouchdowns} units="td" last />
      <StatBar.PlayerDivider />
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
  const [viewPlayerStats, setViewPlayerStats] = useState(false);

  return (
    <>
      {viewPlayerStats && <FullStatsModal player={player} onClose={() => setViewPlayerStats(false)} />}
      <StatBar.PlayerName player={player} onClick={() => setViewPlayerStats(true)} />
      <Stat stat={player.tackles} units="tckl" />
      <Stat stat={player.sacks} units="sack" />
      <Stat stat={player.interceptionsReceived} units="int" />
      <Stat stat={player.interceptionReturnTouchdowns + player.fumbleReturnTouchdowns} units="td" last />
      <StatBar.PlayerDivider />
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
  const [viewPlayerStats, setViewPlayerStats] = useState(false);

  return (
    <>
      {viewPlayerStats && <FullStatsModal player={player} onClose={() => setViewPlayerStats(false)} />}
      <StatBar.PlayerName player={player} onClick={() => setViewPlayerStats(true)} />
      <Stat stat={player.kickoffs} units="kickoff" />
      <Stat stat={player.fieldGoalsMade} denominator={player.fieldGoalAttempts} units="fg" />
      <Stat stat={player.extraPointsMade} denominator={player.extraPointAttempts} units="xp" last />
      <StatBar.PlayerDivider />
    </>
  );
};

StatBar.Kicker.propTypes = {
  player: PropTypes.shape({
    playerInfo: PropTypes.shape,
    kickoffs: PropTypes.number,
    fieldGoalAttempts: PropTypes.number,
    fieldGoalsMade: PropTypes.number,
    extraPointAttempts: PropTypes.number,
    extraPointsMade: PropTypes.number,
  }).isRequired,
};

StatBar.Punter = function Punter({ player }) {
  const [viewPlayerStats, setViewPlayerStats] = useState(false);

  return (
    <>
      {viewPlayerStats && <FullStatsModal player={player} onClose={() => setViewPlayerStats(false)} />}
      <StatBar.PlayerName player={player} onClick={() => setViewPlayerStats(true)} />
      <Stat stat={player.punts} units="punt" />
      <Stat stat={player.puntYards} units="yds" />
      <Stat stat={player.averagePuntYards} units="avg" last />
      <StatBar.PlayerDivider />
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
  const [viewPlayerStats, setViewPlayerStats] = useState(false);

  return (
    <>
      {viewPlayerStats && <FullStatsModal player={player} onClose={() => setViewPlayerStats(false)} />}
      <StatBar.PlayerName player={player} onClick={() => setViewPlayerStats(true)} />
      <Stat stat={player.puntReturns} units="punt ret" />
      <Stat stat={player.puntReturnYards} units="yds" />
      <Stat stat={player.kickoffReturns} units="kick ret" />
      <Stat stat={player.kickoffReturnYards} units="yds" last />
      <StatBar.PlayerDivider />
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
  const [viewPlayerStats, setViewPlayerStats] = useState(false);

  return (
    <>
      {viewPlayerStats && <FullStatsModal player={player} onClose={() => setViewPlayerStats(false)} />}
      <StatBar.PlayerName player={player} onClick={() => setViewPlayerStats(true)} />
      <Stat stat={player.fumblesCommitted} units="fum" />
      <Stat stat={player.fumblesForced} units="ff" />
      <Stat stat={player.fumblesRecovered} units="fr" last />
      <StatBar.PlayerDivider />
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
