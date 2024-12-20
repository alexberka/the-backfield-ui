import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function PlayerMultiSelect({ name, players, onChange, value }) {
  const onAdd = (e) => {
    onChange({ target: { name, value: [...value, Number(e.target.value)] } });
  };

  const onRemove = (removeId) => {
    onChange({ target: { name, value: value.filter((id) => id !== removeId) } });
  };

  useEffect(() => {
    onChange({ target: { name, value: [] } });
  }, [players]);

  return (
    <div>
      <select className="player-select" name={name} onChange={onAdd}>
        <option value="null">Add Player</option>
        {players
          .filter((player) => !value.includes(player.id))
          .sort((a, b) => a.lastName.localeCompare(b.lastName))
          .map((player) => (
            <option key={player.id} value={player.id}>
              {player.lastName}, {player.firstName[0]}. #{player.jerseyNumber}
            </option>
          ))}
      </select>
      {value.map((pd) => {
        const index = players.findIndex((p) => p.id === pd);
        return (
          index >= 0 && (
            <div key={pd}>
              <p>
                {players[index].lastName}, {players[index].firstName[0]}. #{players[index].jerseyNumber}
              </p>
              <button type="button" onClick={() => onRemove(players[index].id)}>
                X
              </button>
            </div>
          )
        );
      })}
    </div>
  );
}

PlayerMultiSelect.propTypes = {
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
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
};
