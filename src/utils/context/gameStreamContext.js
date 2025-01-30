// Context API Docs: https://beta.reactjs.org/learn/passing-data-deeply-with-context

'use client';

import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import Loading from '../../components/Loading';

const GameStreamContext = createContext();

GameStreamContext.displayName = 'GameStreamContext'; // Context object accepts a displayName string property. React DevTools uses this string to determine what to display for the context. https://reactjs.org/docs/context.html#contextdisplayname

function GameStreamProvider({ gameStream, children }) {
  if (gameStream === undefined) {
    return <Loading />;
  }

  return <GameStreamContext.Provider value={gameStream}>{children}</GameStreamContext.Provider>;
}

const useGameStream = () => {
  const context = useContext(GameStreamContext);

  if (context === undefined) {
    throw new Error('useGameStream must be used within a GameStreamProvider');
  }
  return context;
};

export { GameStreamProvider, useGameStream };

GameStreamProvider.propTypes = {
  children: PropTypes.node,
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
