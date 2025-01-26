import React from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from './ModalWrapper';
import Stat from '../Stat';

export default function FullStatsModal({ player, onClose }) {
  return (
    <ModalWrapper onHide={onClose}>
      <div className="full-stats-modal std-mod">
        <div className="fs-mod-header">
          <h3 className="fs-mod-header-player">
            {player.playerInfo.firstName} {player.playerInfo.lastName}
            {player.playerInfo.jerseyNumber >= 0 && <span className="fs-mod-header-number"> #{player.playerInfo.jerseyNumber}</span>}
          </h3>
          {player.playerInfo.team != null && <div>{player.playerInfo.team.locationName}</div>}
        </div>
        <div className="fs-mod-stat-container">
          <div className="fs-mod-stat-container-header">Full Stats - This Game</div>
          <div className="fs-mod-divider" />
          {player.passAttempts > 0 && (
            <>
              <div className="fs-mod-stat-line">
                <Stat stat={player.passCompletions} denominator={player.passAttempts} units="pass" />
                <Stat stat={player.passYards} units="yds" />
                <Stat stat={player.passTouchdowns} units="td" />
                <Stat stat={player.interceptionsThrown} units="int" />
              </div>
              <div className="fs-mod-divider" />
            </>
          )}
          {(player.receivingTargets > 0 || player.receivingYards !== 0) && (
            <>
              <div className="fs-mod-stat-line">
                <Stat stat={player.receptions} denominator={player.receivingTargets} units="rec" />
                <Stat stat={player.receivingYards} units="yds" />
                <Stat stat={player.receivingTouchdowns} units="td" />
              </div>
              <div className="fs-mod-divider" />
            </>
          )}
          {(player.rushAttempts !== 0 || player.rushYards !== 0) && (
            <>
              <div className="fs-mod-stat-line">
                <Stat stat={player.rushAttempts} units="rush" />
                <Stat stat={player.rushYards} units="yds" />
                <Stat stat={player.rushTouchdowns} units="td" />
              </div>
              <div className="fs-mod-divider" />
            </>
          )}
          {(player.kickoffs !== 0 || player.fieldGoalAttempts !== 0 || player.extraPointAttempts !== 0) && (
            <>
              <div className="fs-mod-stat-line">
                <Stat stat={player.kickoffs} units="kickoff" />
                <Stat stat={player.fieldGoalsMade} denominator={player.fieldGoalAttempts} units="fg" />
                <Stat stat={player.extraPointsMade} denominator={player.extraPointAttempts} units="xp" last />
              </div>
              <div className="fs-mod-divider" />
            </>
          )}
          {player.punts !== 0 && (
            <>
              <div className="fs-mod-stat-line">
                <Stat stat={player.punts} units="punt" />
                <Stat stat={player.puntYards} units="yds" />
                <Stat stat={player.averagePuntYards} units="avg" last />
              </div>
              <div className="fs-mod-divider" />
            </>
          )}
          {(player.kickoffReturns !== 0 || player.kickoffReturnYards !== 0) && (
            <>
              <div className="fs-mod-stat-line">
                <Stat stat={player.kickoffReturns} units="kick ret" />
                <Stat stat={player.kickoffReturnYards} units="yds" />
                <Stat stat={player.kickoffReturnTouchdowns} units="td" />
              </div>
              <div className="fs-mod-divider" />
            </>
          )}
          {(player.puntReturns !== 0 || player.puntReturnYards !== 0) && (
            <>
              <div className="fs-mod-stat-line">
                <Stat stat={player.puntReturns} units="punt ret" />
                <Stat stat={player.puntReturnYards} units="yds" />
                <Stat stat={player.puntReturnTouchdowns} units="td" />
              </div>
              <div className="fs-mod-divider" />
            </>
          )}
          {(player.tackles !== 0 || player.sacks !== 0 || player.interceptionsReceived !== 0 || player.interceptionReturnTouchdowns !== 0 || player.fumbleReturnTouchdowns !== 0) && (
            <>
              <div className="fs-mod-stat-line">
                <Stat stat={player.tackles} units="tckl" />
                <Stat stat={player.sacks} units="sack" />
                <Stat stat={player.interceptionsReceived} units="int" />
                <Stat stat={player.interceptionReturnTouchdowns + player.fumbleReturnTouchdowns} units="td" last />
              </div>
              <div className="fs-mod-divider" />
            </>
          )}
          {(player.fumblesCommitted !== 0 || player.fumblesForced !== 0 || player.fumblesRecovered !== 0) && (
            <>
              <div className="fs-mod-stat-line">
                <Stat stat={player.fumblesCommitted} units="fum" />
                <Stat stat={player.fumblesForced} units="ff" />
                <Stat stat={player.fumblesRecovered} units="fr" last />
              </div>
              <div className="fs-mod-divider" />
            </>
          )}
        </div>
        {/* To satisfy FocusTrap component in wrapper, accessibility, though clicking anywhere will close */}
        <button type="button" className="button button-red" onClick={onClose}>
          Close
        </button>
      </div>
    </ModalWrapper>
  );
}

FullStatsModal.propTypes = {
  player: PropTypes.shape,
  onClose: PropTypes.func.isRequired,
};
