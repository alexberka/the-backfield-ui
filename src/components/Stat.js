import React from 'react';
import PropTypes from 'prop-types';

export default function Stat({ stat, denominator = null, units, last = false }) {
  return (
    <span className={`sbli-stat ${last ? 'last' : ''}`}>
      {stat}
      {denominator != null && (
        <>
          <span className="sbli-ratio-slash">/</span>
          {denominator}
        </>
      )}
      <span className="sbli-units">{units.toUpperCase()}</span>
    </span>
  );
}

Stat.propTypes = {
  stat: PropTypes.number.isRequired,
  denominator: PropTypes.number,
  units: PropTypes.string.isRequired,
  last: PropTypes.bool,
};
