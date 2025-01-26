import React from 'react';
import PropTypes from 'prop-types';
import { FocusTrap } from '@ciceksepeti/cui';

export default function ModalWrapper({ children, onHide = null }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onHide();
    }
  };

  return (
    <div className="modal-trap-wrapper">
      <FocusTrap as="div">
        <div role="button" className="modal-backdrop" onClick={onHide} onKeyDown={handleKeyDown} tabIndex={0}>
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
