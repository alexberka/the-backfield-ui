'use client';

// any component that uses useAuth needs this because if a component directly imports useAuth, it needs to be a client component since useAuth uses React hooks.

import { signOut } from '@/utils/auth'; // anything in the src dir, you can use the @ instead of relative paths
import Link from 'next/link';

function Home() {
  return (
    <div className="welcome-box">
      <div className="welcome-logo">
        <span className="welcome-the">THE</span>
        <span className="welcome-backfield">BACKFIELD</span>
      </div>
      <div className="welcome-buttons">
        <Link href="/teams">
          <button className="button" type="button">
            TEAMS
          </button>
        </Link>
        <Link href="/games">
          <button className="button" type="button">
            GAMES
          </button>
        </Link>
        <button className="button button-red" type="button" onClick={signOut}>
          SIGN OUT
        </button>
      </div>
    </div>
  );
}

export default Home;
