import React from 'react';
import { signIn } from '../utils/auth';

function Signin() {
  return (
    <div className="welcome-box">
      <div className="welcome-logo">
        <span className="welcome-the">THE</span>
        <span className="welcome-backfield">BACKFIELD</span>
      </div>
      <div className="welcome-buttons">
        <button className="button" type="button" onClick={signIn}>
          SIGN IN
        </button>
      </div>
    </div>
  );
}

export default Signin;
