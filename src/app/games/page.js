'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../utils/context/authContext';
import { getUserGames } from '../../api/gameData';

export default function ViewAllGames() {
  const [games, setGames] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getUserGames(user.sessionKey).then(setGames);
  }, [user]);

  return (
    <div className="list-container">
      {games.map((game) => (
        <Link key={game.id} href={`/games/${game.id}/game-stream`} className="list-item">
          {/* <hr style={{ color: team.colorPrimaryHex }} />
          <hr style={{ color: team.colorSecondaryHex }} /> */}
          <p>
            {game.homeTeam.locationName} <span style={{ color: 'greenyellow' }}>{game.homeTeam.nickname}</span> vs {game.awayTeam.locationName} <span style={{ color: 'greenyellow' }}>{game.awayTeam.nickname}</span>
          </p>
        </Link>
      ))}
    </div>
  );
}
