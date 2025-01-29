import React from 'react';
import PropTypes from 'prop-types';

export default function CheckButton({ className = '', children, name = '', value = false, checked = false, onClick = null }) {
  return (
    <button className={`check-button ${checked && 'cb-selected'} ${className}`} type="button" name={name} value={value} onClick={onClick}>
      {children}
    </button>
  );
}

CheckButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  name: PropTypes.string,
  value: PropTypes.bool,
  checked: PropTypes.bool,
  onClick: PropTypes.func,
};
