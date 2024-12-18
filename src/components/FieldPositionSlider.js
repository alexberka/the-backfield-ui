import React from 'react';
import PropTypes from 'prop-types';

export default function FieldPositionSlider({ name, value, onChange, possession = '', color = '', clearOption = true }) {
  return (
    <div className="pf-field-position">
      <input className={`pf-field-position-slider slider-${possession} slider-${value == null && 'off'}`} style={color !== '' ? { border: `1px solid ${color}` } : {}} type="range" name={name} min="-50" max="50" onChange={onChange} value={value || 0} />
      {clearOption && (
        <button className="pf-field-position-clear" type="button" name={name} value="null" onClick={onChange} disabled={value === null}>
          Clear
        </button>
      )}
    </div>
  );
}

FieldPositionSlider.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  possession: PropTypes.string,
  color: PropTypes.string,
  clearOption: PropTypes.bool,
};
