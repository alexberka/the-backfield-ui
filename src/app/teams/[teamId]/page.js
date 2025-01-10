'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getSingleTeam } from '../../../api/teamData';
import { useAuth } from '../../../utils/context/authContext';
import Loading from '../../../components/Loading';

export default function ViewTeamInfo({ params }) {
  const [team, setTeam] = useState({});
  const { teamId } = params;
  const { user } = useAuth();

  useEffect(() => {
    getSingleTeam(teamId, user.sessionKey).then(setTeam);
  }, [teamId, user]);

  if (!team.id) {
    return <Loading />;
  }

  return (
    <>
      <div className="info-box">
        <div className="ib-left">
          <h1 className="header-top-line">{team.locationName}</h1>
          <h1 className="header-bottom-line">{team.nickname}</h1>
          <hr className="primary-color-bar" style={{ color: team.colorPrimaryHex }} />
          <hr className="secondary-color-bar" style={{ color: team.colorSecondaryHex }} />
        </div>
        <div className="ib-right">
          <p className="ib-right-text">{team.homeField}</p>
          <p className="ib-right-text">{team.homeLocation}</p>
        </div>
      </div>
      <div className="list-container">
        <div className="list-header">
          <p className="list-header-text">Roster</p>
          <hr style={{ color: team.colorPrimaryHex }} />
          <hr style={{ color: team.colorSecondaryHex }} />
        </div>
        {team.players
          ?.sort((a, b) => a.firstName.localeCompare(b.firstName))
          ?.sort((a, b) => a.lastName.localeCompare(b.lastName))
          .map((player) => (
            <div key={player.id} className="list-item">
              <p className="player-position">
                {player.positions.map((pos, index) => {
                  if (index < 3) {
                    let readout = '';
                    if (index > 0) {
                      readout = ', ';
                    }
                    readout += pos.abbreviation;
                    return readout;
                  }
                  return '';
                })}
              </p>
              <p className="player-number">{player.jerseyNumber}</p>
              <p>
                {player.firstName} <span style={{ color: 'greenyellow' }}>{player.lastName}</span>
              </p>
              <hr style={{ color: team.colorPrimaryHex }} />
              <hr style={{ color: team.colorSecondaryHex }} />
            </div>
          ))}
      </div>
    </>
  );
}

ViewTeamInfo.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
