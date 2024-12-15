import React from 'react';
import PropTypes from 'prop-types';

export default function PlayerSelect({ name, players, onChange, value }) {
  return (
    <select name={name} onChange={onChange} value={value}>
      <option value="null">None</option>
      {players
        .sort((a, b) => a.lastName.localeCompare(b.lastName))
        .map((player) => (
          <option key={player.id} value={player.id}>
            {player.lastName}, {player.firstName[0]}. #{player.jerseyNumber}
          </option>
        ))}
    </select>
  );
}

PlayerSelect.propTypes = {
  name: PropTypes.string,
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      jerseyNumber: PropTypes.number,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
