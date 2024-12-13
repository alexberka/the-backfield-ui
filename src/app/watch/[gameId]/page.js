import React from 'react';
import PropTypes from 'prop-types';

export default function WatchGameStream({ params }) {
  const { gameId } = params;

  return <div>Public Game Stream {gameId}</div>;
}

WatchGameStream.propTypes = {
  params: PropTypes.objectOf({}).isRequired,
};
