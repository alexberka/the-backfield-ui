import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function PlayerMultiSelect({ name, players, onChange, value, header = '' }) {
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
    <div className="player-multi">
      <div className="player-multi-header">
        {header !== '' && <p>{header}</p>}
        <select className="player-select" name={name} onChange={onAdd} disabled={value.length === players.length}>
          <option value="null">Select Player</option>
          {players
            .filter((player) => !value.includes(player.id))
            .sort((a, b) => a.lastName.localeCompare(b.lastName))
            .map((player) => (
              <option key={player.id} value={player.id}>
                {player.lastName}, {player.firstName[0]}. #{player.jerseyNumber}
              </option>
            ))}
        </select>
      </div>
      <div className="player-multi-collection">
        {value.map((pd) => {
          const index = players.findIndex((p) => p.id === pd);
          return (
            index >= 0 && (
              <div key={pd} className="player-multi-collection-item">
                <button type="button" onClick={() => onRemove(players[index].id)}>
                  X
                </button>
                <p>
                  {players[index].lastName}, {players[index].firstName[0]}. #{players[index].jerseyNumber}
                </p>
              </div>
            )
          );
        })}
      </div>
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
  header: PropTypes.string,
};
