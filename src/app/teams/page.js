'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserTeams } from '../../api/teamData';
import { useAuth } from '../../utils/context/authContext';

export default function ViewAllTeams() {
  const [teams, setTeams] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getUserTeams(user.sessionKey).then(setTeams);
  }, [user]);

  return (
    <div className="list-container">
      {teams
        ?.sort((a, b) => a.locationName.localeCompare(b.locationName))
        .map((team) => (
          <Link key={team.id} href={`/teams/${team.id}`} className="list-item">
            <hr style={{ color: team.colorPrimaryHex }} />
            <p>
              {team.locationName} <span style={{ color: 'greenyellow' }}>{team.nickname}</span>
            </p>
            <hr style={{ color: team.colorSecondaryHex }} />
          </Link>
        ))}
    </div>
  );
}
