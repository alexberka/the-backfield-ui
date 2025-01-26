import React from 'react';
import PropTypes from 'prop-types';
import { FocusTrap } from '@ciceksepeti/cui';

export default function ModalWrapper({ children, onHide = null }) {
  const handleClick = (e) => {
    if (e.target.id === 'modal-backdrop') {
      onHide();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onHide();
    }
  };

  return (
    <div className="modal-trap-wrapper">
      <FocusTrap as="div">
        <div role="button" className="modal-backdrop" id="modal-backdrop" onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={0}>
          {children}
        </div>
      </FocusTrap>
    </div>
  );
}

ModalWrapper.propTypes = {
  children: PropTypes.node,
  onHide: PropTypes.func,
};
